<?php

namespace App\Http\Controllers;

use App\Models\Formulario;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FormularioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(){
        return Formulario::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){
        $formulario = Formulario::create($request->all());
        return response()->json($formulario, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id){
        return Formulario::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id){
        $formulario = Formulario::findOrFail($id);
        $formulario->update($request->all());
        return response()->json($formulario);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id){
        Formulario::destroy($id);
        return response()->json(null, 204);
    }

    public function obtenerInscritosOficiales($idConvocatoria){
        $registros = DB::table('estudiante_esta_inscrito')
            ->join('formulario', 'formulario.id_formulario', '=', 'estudiante_esta_inscrito.id_formulario_formulario')
            ->join('estudiante', 'estudiante.id_estudiante', '=', 'estudiante_esta_inscrito.id_estudiante_estudiante')
            ->join('area_tiene_categoria', 'area_tiene_categoria.id', '=', 'estudiante_esta_inscrito.id_inscrito_en')
            ->join('area', 'area.id_area', '=', 'area_tiene_categoria.id_area_area')
            ->join('categoria', 'categoria.id_categoria', '=', 'area_tiene_categoria.id_categoria_categoria')
            ->join('unidad_educativa', 'unidad_educativa.id_ue', '=', 'formulario.id_ue_ue')
            ->where('formulario.id_convocatoria_convocatoria', $idConvocatoria)
            #->where('formulario.pagado', true)
            ->select(
                'estudiante.id_estudiante',
                'estudiante.nombre as nombre_estudiante',
                'estudiante.apellido as apellido_estudiante',
                'estudiante.ci as ci',
                'formulario.id_ue_ue as id_ue',
                'unidad_educativa.nombre_ue',
                'area.nombre_area',
                'categoria.nombre_categoria',
            )
            ->get();

        // Agrupar manualmente por estudiante
        $agrupado = $registros->groupBy('id_estudiante')->map(function ($items) {
            $estudiante = $items->first();
            return [
                'ci' => $estudiante->ci,
                'nombre' => $estudiante->nombre_estudiante,
                'apellido' => $estudiante->apellido_estudiante,
                'nombre_ue' => $estudiante->nombre_ue,
                'inscripciones' => $items->map(function ($item) {
                    return [
                        'nombre_area' => $item->nombre_area,
                        'nombre_categoria' => $item->nombre_categoria,
                    ];
                })->values()
            ];
        })->values();

        return response()->json($agrupado);
    }

    

}
