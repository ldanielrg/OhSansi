<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UnidadEducativa;

class UnidadEducativaController extends Controller
{
    // PARA OBTENER LOS DATOS DE UE /api/unidades-educativas
    public function index()
    {
        $unidades = UnidadEducativa::with(['departamento', 'municipio'])->get();

        $resultado = $unidades->map(function ($ue) {
            return [
                'id' => $ue->id_ue,
                'nombre' => $ue->nombre_ue,
                'rue' => $ue->rue_ue,
                'departamento_id' => $ue->id_depart,
                'departamento_nombre' => $ue->departamento->nombre_depart ?? '—',
                'municipio_id' => $ue->id_municipio,
                'municipio_nombre' => $ue->municipio->nombre_municipio ?? '—',
            ];
        });

        return response()->json($resultado);
    }

    //CREAR NUEVA UNIDAD EDUCATIVA
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
            'rue' => $request->rue,
            'id_departamento' => $request->departamento_id,
            'id_municipio' => $request->municipio_id
        ]);

        return response()->json([
            'message' => 'Unidad Educativa registrada exitosamente.',
            'data' => $nuevaUE
        ], 201); // 201 Created
    }

    // EDITAR/ACTUALIZACION DE UE
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'rue' => 'required|string|max:100',
            'departamento_id' => 'required|integer',
            'municipio_id' => 'required|integer',
        ]);

        $ue = UnidadEducativa::findOrFail($id);

        $ue->update([
            'nombre_ue' => $request->nombre,
            'rue' => $request->rue,
            'id_departamento' => $request->departamento_id,
            'id_municipio' => $request->municipio_id
        ]);

        return response()->json($ue); // Devuelve la UE actualizada
    }

    // ELIMINAR UNIDAD EDUCATIVA
    public function destroy($id)
    {
        $ue = UnidadEducativa::findOrFail($id);
        $ue->delete();

        return response()->json(['message' => 'Unidad educativa eliminada.']);
    }
}
