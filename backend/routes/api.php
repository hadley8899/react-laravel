<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehicleMakeModelController;
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

    // User routes
    Route::controller(UserController::class)->group(function () {
        Route::prefix('/users')->group(function () {
            // Route::get('', 'index');
            // Route::post('', 'store');
            // Route::get('/{user:uuid}', 'show');
            Route::put('/{user:uuid}', 'update');
            Route::post('/{user:uuid}/change-password', 'changePassword');
            // Route::delete('/{user:uuid}', 'destroy');
        });
    });

    // Customer routes
    Route::controller(CustomerController::class)->group(function () {
        Route::prefix('/customers')->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::get('/{customer:uuid}', 'show');
            Route::put('/{customer:uuid}', 'update');
            Route::delete('/{customer:uuid}', 'destroy');
        });
    });

    // Vehicle routes
    Route::controller(VehicleController::class)->group(function () {
        Route::get('/vehicles', 'index');
        Route::post('/vehicles', 'store');
        Route::get('/vehicles/{vehicle:uuid}', 'show');
        Route::put('/vehicles/{vehicle:uuid}', 'update');
        Route::delete('/vehicles/{vehicle:uuid}', 'destroy');
    });

    Route::controller(VehicleMakeModelController::class)->group(function () {
        Route::get('/vehicle-makes', 'getMakes');
        Route::get('/vehicle-makes/{make:uuid}/models', 'getModels');
    });
});
