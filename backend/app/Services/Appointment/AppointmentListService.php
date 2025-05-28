<?php

namespace App\Services\Appointment;

use App\Models\Appointment;
use App\Services\Appointment\AppointmentService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class AppointmentListService extends AppointmentService
{

    /**
     * @param int $companyId
     * @param string|null $serviceType
     * @param string|null $status
     * @param string|null $dateFrom
     * @param string|null $dateTo
     * @return Builder
     */
    public static function listAppointments(int $companyId, string|null $serviceType = null, string|null $status = null, string|null $dateFrom = null, string|null $dateTo = null): Builder
    {
        $query = Appointment::with(['customer', 'vehicle'])
            ->where('company_id', $companyId);

        if ($serviceType) {
            $query->where('service_type', $serviceType);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($dateFrom) {
            $query->whereDate('date_time', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('date_time', '<=', $dateTo);
        }

        $query->orderBy('date_time')->paginate(request('per_page', 20));

        return $query;
    }
}
