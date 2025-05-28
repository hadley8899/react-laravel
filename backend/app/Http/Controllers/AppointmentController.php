<?php

namespace App\Http\Controllers;

use App\Http\Requests\Appointment\StoreAppointmentRequest;
use App\Http\Requests\Appointment\UpdateAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\User;
use App\Services\Appointment\AppointmentDestroyService;
use App\Services\Appointment\AppointmentListService;
use App\Services\Appointment\AppointmentStoreService;
use App\Services\Appointment\AppointmentUpdateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Throwable;

class AppointmentController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Appointment::class, 'appointment');
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return AppointmentResource::collection(AppointmentListService::listAppointments(
            Auth::user()->company->id,
            request('service_type'),
            request('status'),
            request('date_from'),
            request('date_to')
        )->paginate());
    }

    /**
     * @param StoreAppointmentRequest $request
     * @return AppointmentResource|JsonResponse
     */
    public function store(StoreAppointmentRequest $request): AppointmentResource|JsonResponse
    {
        $validated = $request->validated();

        /** @var User $user */
        $user = Auth::user();
        try {
            $appointment = AppointmentStoreService::storeAppointment(
                $user,
                $validated['customer_uuid'] ?? null,
                $validated['vehicle_uuid'] ?? null,
                $validated['service_type'] ?? null,
                $validated['date_time'] ?? null,
                $validated['duration_minutes'] ?? null,
                $validated['status'] ?? null,
                $validated['mechanic_assigned'] ?? null,
                $validated['notes'] ?? null
            );
            return new AppointmentResource($appointment->load(['customer', 'vehicle']));
        } catch (Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error creating appointment', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * @param Appointment $appointment
     * @return AppointmentResource
     */
    public function show(Appointment $appointment): AppointmentResource
    {
        // Does the appointment belong to the user's company?
        if ($appointment->company_id !== Auth::user()->company->id) {
            throw new NotFoundHttpException('Appointment not found');
        }

        return new AppointmentResource($appointment);
    }

    /**
     * @param UpdateAppointmentRequest $req
     * @param Appointment $appointment
     * @return AppointmentResource|JsonResponse
     */
    public function update(UpdateAppointmentRequest $req, Appointment $appointment): AppointmentResource|JsonResponse
    {
        // Does the appointment belong to the user's company?
        if ($appointment->company_id !== Auth::user()->company->id) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        try {
            $updatedAppointment = AppointmentUpdateService::update($appointment, $req->validated());
            return new AppointmentResource($updatedAppointment);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Error updating appointment', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * @param Appointment $appointment
     * @return JsonResponse
     */
    public function destroy(Appointment $appointment): JsonResponse
    {
        // Does the appointment belong to the user's company?
        if ($appointment->company_id !== Auth::user()->company->id) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        AppointmentDestroyService::destroy($appointment);

        return response()->json(['message' => 'Appointment deleted']);
    }
}
