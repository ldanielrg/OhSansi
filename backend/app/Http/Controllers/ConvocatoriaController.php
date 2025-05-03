<?php

namespace App\Http\Controllers;

use App\Models\Convocatoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
class ConvocatoriaController extends Controller
{
    #Obtiene todas las convocatorias
    public function index(){
        return response()->json(Convocatoria::all());
    }

    #Para crear una convocatoria
    public function store(Request $request){
        Log::debug($request);
        //Validación
        $validator = Validator::make($request->all(), [
            'nombre_convocatoria' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_final' => 'required|date|after_or_equal:fecha_inicio',
            'activo' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // 📝 Log de datos recibidos
        Log::info('Datos recibidos para convocatoria:', $request->all());

        $convocatoria = Convocatoria::create([
            'nombre_convocatoria' => $request->input('nombre_convocatoria'),
            'descripcion' => $request->input('descripcion'),
            'fecha_inicio' => $request->input('fecha_inicio'),
            'fecha_final' => $request->input('fecha_final'),
            'activo' => $request->input('activo')
        ]);

        return response()->json([
            'message' => 'Convocatoria creada correctamente.'
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json(Convocatoria::findOrFail($id));
    }

    /**
     * Actualizar una convocatoria existente.
     */
    public function update(Request $request, string $id)
    {
        $convocatoria = Convocatoria::findOrFail($id);
        $convocatoria->update($request->all());

        return response()->json($convocatoria);
    }

    /**
     * Eliminar una convocatoria.
     */
    public function destroy(string $id)
    {
        Convocatoria::destroy($id);
        return response()->json(null, 204);
    }

    /**
     * Asignar áreas a una convocatoria (optimizado usando insertMany).
     */
    public function asignarAreas(Request $request, $idConvocatoria)
    {
        $areaIds = $request->input('areas'); // array de id_area
        Log::info('Áreas recibidas para asignar:', $request->all());

        // 🔥 Optimización: preparar array de inserciones
        $insertData = [];
        foreach ($areaIds as $idArea) {
            $insertData[] = [
                'id_convocatoria' => $idConvocatoria,
                'id_area' => $idArea,
            ];
        }

        // 🔥 Un solo insert masivo
        DB::table('convocatoria_tiene_areas')->insert($insertData);

        return response()->json(['message' => 'Áreas asignadas correctamente']);
    }
}

