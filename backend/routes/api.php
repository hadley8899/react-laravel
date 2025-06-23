<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyUserManagementController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerTagController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MediaLibraryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehicleMakeModelController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])->middleware(['throttle:6,1'])->name('verification.verify');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.reset');
Route::post('/accept-invitation', [AuthController::class, 'acceptInvitation'])->name('invitations.accept');
// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'user']);

    // User routes
    Route::prefix('/users')->group(function () {
        // Route::get('', [UserController::class, 'index']);
        // Route::post('', [UserController::class, 'store']);
        // Route::get('/{user:uuid}', [UserController::class, 'show']);
        Route::put('/{user:uuid}', [UserController::class, 'update']);
        Route::post('/{user:uuid}/change-password', [UserController::class, 'changePassword']);
        // Route::delete('/{user:uuid}', [UserController::class, 'destroy']);
        Route::put('/{user:uuid}/preferences', [UserController::class, 'updatePreferences']);
    });

    // Company User Management Routes
    Route::prefix('/company/users')->group(function () {
        Route::get('/', [CompanyUserManagementController::class, 'index']);
        Route::post('/', [CompanyUserManagementController::class, 'store']);
        Route::get('/{user:uuid}', [CompanyUserManagementController::class, 'show']);
        Route::put('/{user:uuid}', [CompanyUserManagementController::class, 'update']);
        Route::delete('/{user:uuid}', [CompanyUserManagementController::class, 'destroy']);
        Route::put('/{user:uuid}/status', [CompanyUserManagementController::class, 'updateStatus']);
        Route::put('/{user:uuid}/roles', [CompanyUserManagementController::class, 'assignRoles']);
        Route::put('/{user:uuid}/permissions', [CompanyUserManagementController::class, 'assignPermissions']);
        Route::post('/{user:uuid}/reset-password', [CompanyUserManagementController::class, 'resetPassword'])->name('companyUserManagement.resetPassword');
    });

    // Dashboard routes
    Route::middleware('auth:sanctum')->prefix('dashboard')->group(function () {
        Route::get('/overview', [DashboardController::class, 'overview']);
        Route::get('/charts', [DashboardController::class, 'chartData']);
        Route::get('/activity', [DashboardController::class, 'recentActivity']);
    });

    // Role and Permission Routes
    Route::get('/company/roles', [CompanyUserManagementController::class, 'getAvailableRoles']);
    Route::get('/company/permissions', [CompanyUserManagementController::class, 'getAvailablePermissions']);
    Route::patch('/companies/{company:uuid}/setup', [CompanyController::class, 'completeSetup'])->name('companies.completeSetup');

    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('notifications.index');
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
        Route::patch('/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
        Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    });

    // Customer routes
    Route::prefix('/customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index']);
        Route::post('/', [CustomerController::class, 'store']);
        Route::get('/{customer:uuid}', [CustomerController::class, 'show']);
        Route::put('/{customer:uuid}', [CustomerController::class, 'update']);
        Route::delete('/{customer:uuid}', [CustomerController::class, 'destroy']);

        Route::post('/{customer:uuid}/tags', [CustomerTagController::class, 'sync']);
    });

    Route::prefix('/tags')->group(function () {
        Route::get('/', [TagController::class, 'index']);
        Route::post('/', [TagController::class, 'store']);
        Route::get('/{tag:uuid}', [TagController::class, 'show']);
        Route::put('/{tag:uuid}', [TagController::class, 'update']);
        Route::delete('/{tag:uuid}', [TagController::class, 'destroy']);

        // Customers with this tag
        Route::get('/{tag:uuid}/customers', [TagController::class, 'customers']);
    });

    // Invoice routes
    Route::prefix('/invoices')->group(function () {
        Route::get('/', [InvoiceController::class, 'index']);
        Route::post('/', [InvoiceController::class, 'store']);
        Route::get('/{uuid}', [InvoiceController::class, 'show']);
        Route::put('/{uuid}', [InvoiceController::class, 'update']);
        Route::delete('/{uuid}', [InvoiceController::class, 'destroy']);
        Route::get('/{uuid}/pdf', [InvoiceController::class, 'generatePdf']);
        Route::post('/{uuid}/email', [InvoiceController::class, 'email']);
    });

    // Vehicle routes
    Route::prefix('/vehicles')->group(function () {
        Route::get('/', [VehicleController::class, 'index']);
        Route::post('/', [VehicleController::class, 'store']);
        Route::get('/{vehicle:uuid}', [VehicleController::class, 'show']);
        Route::put('/{vehicle:uuid}', [VehicleController::class, 'update']);
        Route::delete('/{vehicle:uuid}', [VehicleController::class, 'destroy']);
    });

    // Vehicle makes and models
    Route::get('/vehicle-makes', [VehicleMakeModelController::class, 'getMakes']);
    Route::get('/vehicle-makes/{make:uuid}/models', [VehicleMakeModelController::class, 'getModels']);

    // Company routes
    Route::get('/current-company', [CompanyController::class, 'currentCompany']);
    Route::put('/companies/{company:uuid}/settings', [CompanyController::class, 'updateSettings'])->name('companies.updateSettings');
    Route::put('/companies/{company:uuid}/billing', [CompanyController::class, 'updateBilling'])->name('companies.updateBilling');
    Route::put('/companies/{company:uuid}', [CompanyController::class, 'update']);
    Route::get('/companies', [CompanyController::class, 'index']);
    Route::post('/companies/switch-company', [CompanyController::class, 'switchCompany']);

    // Appointments routes
    Route::prefix('/appointments')->group(function () {
        Route::get('/', [AppointmentController::class, 'index']);
        Route::post('/', [AppointmentController::class, 'store']);
        Route::get('/{appointment:uuid}', [AppointmentController::class, 'show']);
        Route::put('/{appointment:uuid}', [AppointmentController::class, 'update']);
        Route::delete('/{appointment:uuid}', [AppointmentController::class, 'destroy']);
    });

    Route::prefix('/media')->group(function () {
        Route::get('/directories', [MediaLibraryController::class, 'listDirectories']);
        Route::post('/directories', [MediaLibraryController::class, 'storeDirectory']);
        Route::patch('/directories/{directory:uuid}', [MediaLibraryController::class, 'updateDirectory']);
        Route::delete('/directories/{directory:uuid}', [MediaLibraryController::class, 'destroyDirectory']);

        Route::get('/assets', [MediaLibraryController::class, 'listAssets']);
        Route::post('/assets', [MediaLibraryController::class, 'uploadAsset']);
        Route::patch('/assets/{asset:uuid}', [MediaLibraryController::class, 'updateAsset']);
        Route::delete('/assets/{asset:uuid}', [MediaLibraryController::class, 'destroyAsset']);
        Route::post('/assets/{asset:uuid}/restore', [MediaLibraryController::class, 'restoreAsset']);
    });
});
