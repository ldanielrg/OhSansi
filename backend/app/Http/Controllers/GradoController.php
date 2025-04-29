<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grado;

class GradoController extends Controller
{
    
    public function todo()    {
        return Grado::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $grado = Grado::create([
            'nombre_grado' => $validated['nombre'],
        ]);

        return response()->json([
            'message' => 'Grado creado exitosamente.',
            'grado' => $grado,
        ], 201);
    }

    public function destroy($id)
    {
        $grado = Grado::find($id);

        if (!$grado) {
            return response()->json([
                'message' => 'Grado no encontrado.',
            ], 404);
        }

        $grado->delete();

        return response()->json([
            'message' => 'Grado eliminado correctamente.',
        ]);
    }
}
