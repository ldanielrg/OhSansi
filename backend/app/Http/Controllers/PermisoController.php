<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PermisoController extends Controller
{
    public function index(Request $request)
    {
        $permisos = $request->user()->getAllPermissions()->pluck('name');

        return response()->json([
            'permisos' => $permisos
        ]);
    }
}
