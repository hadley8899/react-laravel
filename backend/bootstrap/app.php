<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;
use App\Console\Commands\DispatchDueCampaigns;

return Application::configure(basePath: dirname(__DIR__))

    /* -----------------------------------------------------------------
     | HTTP / Console routes
     |------------------------------------------------------------------ */
    ->withRouting(
        api:     __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health:  '/up',
        apiPrefix: '',
    )

    /* -----------------------------------------------------------------
     | Global middleware
     |------------------------------------------------------------------ */
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: ['*']);
    })

    /* -----------------------------------------------------------------
     | Exception handling
     |------------------------------------------------------------------ */
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })

    /* -----------------------------------------------------------------
     | Artisan commands
     |------------------------------------------------------------------ */
    ->withCommands([
        DispatchDueCampaigns::class,
    ])

    /* -----------------------------------------------------------------
     | Task scheduling
     |------------------------------------------------------------------ */
    ->withSchedule(function (Schedule $schedule) {
        $schedule->command('campaign:dispatch-due --chunk=200')->everyThirtySeconds();
    })

    ->create();
