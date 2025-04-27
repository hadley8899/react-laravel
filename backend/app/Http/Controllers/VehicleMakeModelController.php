<?php

namespace App\Http\Controllers;

use App\Models\VehicleMake;
use App\Models\VehicleModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleMakeModelController extends Controller
{
    /**
     * Get all vehicle makes, optionally filtered by search term.
     */
    public function getMakes(Request $request): JsonResponse
    {
        $query = VehicleMake::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'LIKE', "%{$search}%");
        }

        $makes = $query->orderBy('name')->get();

        return response()->json([
            'data' => $makes
        ]);
    }

    /**
     * Get models for a specific make, optionally filtered by search term.
     */
    public function getModels(Request $request, VehicleMake $make): JsonResponse
    {
        $query = $make->models();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'LIKE', "%$search%");
        }

        $models = $query->orderBy('name')->get();

        return response()->json([
            'data' => $models
        ]);
    }
}
