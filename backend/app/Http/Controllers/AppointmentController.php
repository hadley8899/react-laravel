<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AppointmentController extends Controller
{
    /* -------- index (paginated, optional filters) */
    public function index(): AnonymousResourceCollection
    {
        $q = Appointment::with(['customer','vehicle'])
            ->where('company_id', Auth::user()->company->id);

        if ($type = request('service_type')) $q->where('service_type', $type);
        if ($status = request('status'))     $q->where('status', $status);

        if ($from = request('date_from')) $q->whereDate('date_time', '>=', $from);
        if ($to   = request('date_to'))   $q->whereDate('date_time', '<=', $to);

        return AppointmentResource::collection(
            $q->orderBy('date_time')->paginate(request('per_page', 20))
        );
    }

    /* -------- store */
    public function store(StoreAppointmentRequest $req): AppointmentResource|JsonResponse
    {
        $v = $req->validated();

        try {
            DB::beginTransaction();

            $customer = Customer::whereUuid($v['customer_uuid'])
                ->where('company_id', Auth::user()->company->id)->firstOrFail();

            $vehicle  = Vehicle::whereUuid($v['vehicle_uuid'])
                ->where('company_id', Auth::user()->company->id)->firstOrFail();

            $appt = Appointment::create([
                'company_id'        => Auth::user()->company->id,
                'customer_id'       => $customer->id,
                'vehicle_id'        => $vehicle->id,
                'service_type'      => $v['service_type'],
                'date_time'         => $v['date_time'],
                'duration_minutes'  => $v['duration_minutes'],
                'status'            => $v['status'],
                'mechanic_assigned' => $v['mechanic_assigned'] ?? null,
                'notes'             => $v['notes'] ?? null,
            ]);

            DB::commit();
            return new AppointmentResource($appt->load(['customer','vehicle']));
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message'=>'Error creating appointment','error'=>$e->getMessage()],500);
        }
    }

    /* -------- show */
    public function show(string $uuid): AppointmentResource
    {
        $appt = Appointment::with(['customer','vehicle'])
            ->whereUuid($uuid)
            ->where('company_id', Auth::user()->company->id)
            ->firstOrFail();

        return new AppointmentResource($appt);
    }

    /* -------- update */
    public function update(UpdateAppointmentRequest $req, string $uuid): JsonResponse
    {
        $v = $req->validated();
        $appt = Appointment::whereUuid($uuid)
            ->where('company_id', Auth::user()->company->id)
            ->firstOrFail();

        try {
            DB::beginTransaction();

            if (isset($v['customer_uuid'])) {
                $appt->customer_id = Customer::whereUuid($v['customer_uuid'])
                    ->where('company_id', Auth::user()->company->id)
                    ->value('id');
            }
            if (isset($v['vehicle_uuid'])) {
                $appt->vehicle_id = Vehicle::whereUuid($v['vehicle_uuid'])
                    ->where('company_id', Auth::user()->company->id)
                    ->value('id');
            }

            $appt->fill($v)->save();

            DB::commit();
            return response()->json([
                'message'=>'Appointment updated',
                'appointment'=> new AppointmentResource($appt->fresh(['customer','vehicle']))
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message'=>'Error','error'=>$e->getMessage()],500);
        }
    }

    /* -------- destroy */
    public function destroy(string $uuid): JsonResponse
    {
        Appointment::whereUuid($uuid)
            ->where('company_id', Auth::user()->company->id)
            ->firstOrFail()->delete();

        return response()->json(['message'=>'Appointment deleted']);
    }
}
