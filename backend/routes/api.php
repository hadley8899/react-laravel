<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware(['throttle:6,1'])->name('verification.verify');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.reset');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', static function (Request $request) {
        return $request->user();
    });

    // Customer routes
    Route::controller(CustomerController::class)->group(function () {
        Route::get('/customers', 'index');
        Route::post('/customers', 'store');
        Route::get('/customers/{customer:uuid}', 'show');
        Route::put('/customers/{customer:uuid}', 'update');
        Route::delete('/customers/{customer:uuid}', 'destroy');
    });

    Route::controller(VehicleController::class)->group(function () {
        Route::get('/vehicles', 'index');
        Route::post('/vehicles', 'store');
        Route::get('/vehicles/{vehicle:uuid}', 'show');
        Route::put('/vehicles/{vehicle:uuid}', 'update');
        Route::delete('/vehicles/{vehicle:uuid}', 'destroy');
    });
});
