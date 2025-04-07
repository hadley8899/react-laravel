<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Get the current authenticated user
        $user = $request->user();

        return response()->json($user);
    }
}
