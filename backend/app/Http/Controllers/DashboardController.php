<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
    /**
     * Return the four headline numbers + month-over-month deltas.
     *
     * Expected columns:
     *  - users.last_login_at  (nullable timestamp)
     *  - invoices.status      (draft|pending|paid|overdue|cancelled)
     *  - invoices.paid_at     (timestamp when status flips to “paid”)
     *  - appointments.status  (Scheduled|Confirmed|In Progress|Completed|…)
     *
     * If you use different column names, tweak the queries below.
     */
    public function overview(): JsonResponse
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $prevStart = $now->copy()->subMonth()->startOfMonth();
        $prevEnd = $prevStart->copy()->endOfMonth();

        /* ─────── current figures ─────── */
        $totalUsers = User::count();

        $activeUsers = User::query()->where('last_login_at', '>=', $now->copy()->subDays(30))
            ->count();

        $revenue = Invoice::query()->where('status', 'paid')
            ->whereBetween('created_at', [$startOfMonth, $now])
            ->sum('total');

        $completedTasks = Appointment::query()->where('status', 'Completed')
            ->whereBetween('updated_at', [$startOfMonth, $now])
            ->count();

        /* ─────── previous-month baselines ─────── */
        $prevTotalUsers = User::query()->where('created_at', '<', $prevEnd)->count();

        $prevActiveUsers = User::whereBetween('last_login_at', [$prevStart, $prevEnd])
            ->count();

        $prevRevenue = Invoice::query()->where('status', 'paid')
            ->whereBetween('created_at', [$prevStart, $prevEnd])
            ->sum('total');

        $prevCompletedTasks = Appointment::query()->where('status', 'Completed')
            ->whereBetween('updated_at', [$prevStart, $prevEnd])
            ->count();

        /* ─────── deltas (guard against ÷0) ─────── */
        $delta = fn($current, $previous) => $previous ? ($current - $previous) / $previous : 0;

        return response()->json([
            'data' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'revenue' => $revenue,
                'completed_tasks' => $completedTasks,
                'deltas' => [
                    'total_users' => $delta($totalUsers, $prevTotalUsers),
                    'active_users' => $delta($activeUsers, $prevActiveUsers),
                    'revenue' => $delta($revenue, $prevRevenue),
                    'completed_tasks' => $delta($completedTasks, $prevCompletedTasks),
                ],
            ],
        ]);
    }

// app/Http/Controllers/DashboardController.php
    public function chartData(): JsonResponse
    {
        $now = Carbon::now();
        $monthsBack = 11;               // 0-based index → 12 points

        $labels = [];
        $activeUsers = [];
        $newSignups = [];

        /* Build 12 monthly buckets (oldest → newest) */
        for ($i = $monthsBack; $i >= 0; $i--) {
            $from = $now->copy()->subMonths($i)->startOfMonth();
            $to = $from->copy()->endOfMonth();

            $labels[] = $from->format('M');

            /* users who logged-in during the month */
            $activeUsers[] = User::query()->whereBetween('last_login_at', [$from, $to])->count();

            /* brand-new accounts this month */
            $newSignups[] = User::query()->whereBetween('created_at', [$from, $to])->count();
        }

        /* Revenue split by invoice status ─ change if you add a “source” column later */
        $revenueByStatus = Invoice::query()->selectRaw('status, SUM(total) as total')
            ->where('status', 'paid')          // keep only money you’ve actually banked
            ->groupBy('status')
            ->pluck('total', 'status')          // → ['paid' => 12345, …]
            ->toArray();

        return response()->json([
            'data' => [
                'labels' => $labels,
                'active_users' => $activeUsers,
                'new_signups' => $newSignups,
                'revenue_by_source' => $revenueByStatus,   // keeps the same key the front-end expects
            ],
        ]);
    }

    public function recentActivity(): JsonResponse
    {
        /*
         | Gather the 25 most-recent events across invoices, appointments,
         | and new-user sign-ups.  Add/remove sources as you wish.
        */

        $events = collect();

        // ── invoices ────────────────────────────────────────────────
        Invoice::with('customer')
            ->latest('created_at')
            ->take(25)
            ->get()
            ->each(function (Invoice $inv) use ($events) {
                $events->push([
                    'id' => Str::uuid()->toString(),
                    'type' => 'Invoice',
                    'description' => "Invoice #{$inv->invoice_number} {$inv->status}",
                    'amount' => (float)$inv->total,
                    'status' => $inv->status,                  // paid|pending|…
                    'date' => $inv->created_at,
                    'user' => [
                        'name' => optional($inv->customer)->first_name
                            ? "{$inv->customer->first_name} {$inv->customer->last_name}"
                            : 'Unknown Customer',
                        'avatar' => null,                           // fill later if you store one
                    ],
                ]);
            });

        // ── appointments ────────────────────────────────────────────
        Appointment::with('customer')
            ->latest('created_at')
            ->take(25)
            ->get()
            ->each(function (Appointment $app) use ($events) {
                $events->push([
                    'id' => Str::uuid()->toString(),
                    'type' => 'Appointment',
                    'description' => "{$app->service_type} {$app->status}",
                    'amount' => null,
                    'status' => Str::lower($app->status),      // Scheduled → scheduled
                    'date' => $app->created_at,
                    'user' => [
                        'name' => "{$app->customer->first_name} {$app->customer->last_name}",
                        'avatar' => null,
                    ],
                ]);
            });

        // ── brand-new users ─────────────────────────────────────────
        User::latest('created_at')
            ->take(25)
            ->get()
            ->each(function (User $user) use ($events) {
                $events->push([
                    'id' => Str::uuid()->toString(),
                    'type' => 'User',
                    'description' => 'New user registered',
                    'amount' => null,
                    'status' => 'completed',
                    'date' => $user->created_at,
                    'user' => [
                        'name' => $user->name,
                        'avatar' => null,
                    ],
                ]);
            });

        /* combine, sort, and trim to the newest 25 */
        $activities = $events
            ->sortByDesc('date')
            ->take(25)
            ->values()
            ->map(fn($e) => [
                ...$e,
                'date_diff' => $e['date']->diffForHumans(),        // e.g. "2 hours ago"
            ]);

        return response()->json(['data' => $activities]);
    }
}
