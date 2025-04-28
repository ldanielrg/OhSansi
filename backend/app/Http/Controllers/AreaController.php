<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Area;

class AreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Area::all();
    }

    // Crear nueva área
    public function store(Request $request)
    {
        // Validar que envíen un nombre
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        // Crear y guardar nueva área
        $area = Area::create([
            'nombre_area' => $validated['nombre'],
        ]);

        return response()->json([
            'message' => 'Área creada exitosamente.',
            'area' => $area,
        ], 201);
    }

    // Eliminar un área por id
    public function destroy($id)
    {
        $area = Area::find($id);

        if (!$area) {
            return response()->json([
                'message' => 'Área no encontrada.',
            ], 404);
        }

        $area->delete();

        return response()->json([
            'message' => 'Área eliminada correctamente.',
        ]);
    }
}
