<?php

namespace App\Http\Controllers;

use App\Models\Convocatoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // ✅ Importar Log correctamente

class ConvocatoriaController extends Controller
{
    /**
     * Mostrar todas las convocatorias.
     */
    public function index()
    {
        return response()->json(Convocatoria::all());
    }

    /**
     * Crear una nueva convocatoria.
     */
    public function store(Request $request)
    {
        Log::info('Datos recibidos para convocatoria:', $request->all());

        $convocatoria = Convocatoria::create([
            'nombre_convocatoria' => $request->input('nombre_convocatoria'),
            'descripcion' => $request->input('descripcion'),
            'precio' => $request->input('precio'),
            'fecha_inicio' => $request->input('fecha_inicio'),
            'fecha_final' => $request->input('fecha_final'),
        ]);

        return response()->json($convocatoria, 201);
    }

    /**
     * Mostrar una convocatoria específica.
     */
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

