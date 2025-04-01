<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UnidadEducativa;

class UnidadEducativaController extends Controller
{
    public function store(Request $request)
    {
        // Validación de campos
        $request->validate([
            'nombre' => 'required|string|max:255',
            'rue' => 'required|string|max:100',
            'departamento_id' => 'required|integer',
            'municipio_id' => 'required|integer',
        ]);

        // Verificar si ya existe un colegio con ese RUE
        $existe = UnidadEducativa::where('rue_ue', $request->rue)->exists();

        if ($existe) {
            return response()->json([
                'message' => 'Ya existe una UNIDAD EDUCATIVA con ese RUE.'
            ], 409); // 409 Conflict
        }

        // Crear el nuevo colegio, INGRESANDO A LA BD
        $nuevaUE = UnidadEducativa::create([
            'nombre_ue' => $request->nombre,
            'rue_ue' => $request->rue,
            'id_depart' => $request->departamento_id,
            'id_municipio' => $request->municipio_id
        ]);

        return response()->json([
            'message' => 'Unidad Educativa registrada exitosamente.',
            'data' => $nuevaUE
        ], 201); // 201 Created
    }
}
