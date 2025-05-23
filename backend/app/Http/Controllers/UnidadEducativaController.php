<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UnidadEducativa;

class UnidadEducativaController extends Controller
{
    // PARA OBTENER LOS DATOS DE UE /api/unidades-educativas
    public function index(){
        $unidades = UnidadEducativa::with(['departamento', 'municipio'])->get();

        $resultado = $unidades->map(function ($ue) {
            return [
                'id_ue' => $ue->id_ue,
                'nombre_ue' => $ue->nombre_ue,
                'rue' => $ue->rue,
                'departamento_id' => $ue->id_departamento,
                'departamento_nombre' => $ue->departamento->nombre_departamento ?? '—',
                'municipio_id' => $ue->id_municipio,
                'municipio_nombre' => $ue->municipio->nombre_municipio ?? '—',
            ];
        });

        return response()->json($resultado);
    }

    //CREAR NUEVA UNIDAD EDUCATIVA
    public function store(Request $request){
        // Validación de campos
        $request->validate([
            'nombre_ue' => 'required|string|max:255',
            'rue' => 'required|max:100',
            'departamento_id' => 'required|integer',
            'municipio_id' => 'required|integer',
        ]);

        // Verificar si ya existe un colegio con ese RUE
        $existe = UnidadEducativa::where('rue', $request->rue)->exists();

        if ($existe) {
            return response()->json([
                'message' => 'Ya existe una UNIDAD EDUCATIVA con ese RUE.'
            ], 409); // 409 Conflict
        }

        // Crear el nuevo colegio, INGRESANDO A LA BD
        $nuevaUE = UnidadEducativa::create([
            'nombre_ue' => $request->nombre_ue,
            'rue' => $request->rue,
            'id_departamento' => $request->departamento_id,
            'id_municipio' => $request->municipio_id
        ]);

        // Cargar relaciones para devolver nombres en la respuesta
        $nuevaUE->load(['departamento', 'municipio']);

        // Mapear igual que en index para consistencia
        $resultado = [
            'id_ue' => $nuevaUE->id_ue,
            'nombre_ue' => $nuevaUE->nombre_ue,
            'rue' => $nuevaUE->rue,
            'departamento_id' => $nuevaUE->id_departamento,
            'departamento_nombre' => $nuevaUE->departamento->nombre_departamento ?? '—',
            'municipio_id' => $nuevaUE->id_municipio,
            'municipio_nombre' => $nuevaUE->municipio->nombre_municipio ?? '—',
        ];

        return response()->json($resultado, 201); // 201 Created
    }

    // EDITAR/ACTUALIZACION DE UE
    public function update(Request $request, $id){
        $request->validate([
            'nombre_ue' => 'required|string|max:255',
            'rue' => 'required|max:100',
            'departamento_id' => 'required|integer',
            'municipio_id' => 'required|integer',
        ]);

        $ue = UnidadEducativa::findOrFail($id);

        $ue->update([
            'nombre_ue' => $request->nombre_ue,
            'rue' => $request->rue,
            'id_departamento' => $request->departamento_id,
            'id_municipio' => $request->municipio_id
        ]);

        // Cargar relaciones para devolver nombres en la respuesta
        $ue->load(['departamento', 'municipio']);

        // Mapear igual que en index para consistencia
        $resultado = [
            'id_ue' => $ue->id_ue,
            'nombre_ue' => $ue->nombre_ue,
            'rue' => $ue->rue,
            'departamento_id' => $ue->id_departamento,
            'departamento_nombre' => $ue->departamento->nombre_departamento ?? '—',
            'municipio_id' => $ue->id_municipio,
            'municipio_nombre' => $ue->municipio->nombre_municipio ?? '—',
        ];

        return response()->json($resultado); // Devuelve la UE actualizada
    }

    // ELIMINAR UNIDAD EDUCATIVA
    public function destroy($id){
        $ue = UnidadEducativa::findOrFail($id);
        $ue->delete();

        return response()->json(['message' => 'Unidad educativa eliminada.']);
    }
}
