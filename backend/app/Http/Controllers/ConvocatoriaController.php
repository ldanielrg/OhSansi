<?php

namespace App\Http\Controllers;

use App\Models\Convocatoria;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
 
class ConvocatoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Convocatoria::all();
    
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        \Log::info('Datos recibidos para convocatoria:', $request->all());

        $convocatoria = \App\Models\Convocatoria::create([
            'descripcion' => $request->input('descripcion'),
            'id_cronog' => $request->input('id_cronog'),
            'estado' => $request->input('estado'),
            'nombre_convocatoria' => $request->input('nombre_convocatoria'),
        ]);

        return response()->json($convocatoria, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Convocatoria::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $convocatoria = Convocatoria::findOrFail($id);
        $convocatoria->update($request->all());
        return response()->json($convocatoria);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Convocatoria::destroy($id);
        return response()->json(null, 204);
    }

    public function asignarAreas(Request $request, $idConvocatoria)
    {
        $areaIds = $request->input('areas'); // array de id_area
        \Log::info('Áreas recibidas para asignar:', $request->all());
        foreach ($areaIds as $idArea) {
            \Log::info("Insertando area $idArea en convocatoria $idConvocatoria");
            DB::table('convocatoria_tiene_areas')->insert([
                'id_convocatoria' => $idConvocatoria,
                'id_area' => $idArea, 
            ]);
        }

        return response()->json(['message' => 'Áreas asignadas correctamente']);
    }

}
