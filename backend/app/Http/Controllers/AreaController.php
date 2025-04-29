<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Area;
use App\Models\AreaTieneCategorium;

class AreaController extends Controller{
    
    public function index()    {
        return Area::all();
    }

    public function store(Request $request)    {
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

    public function AreasConcategoriasConGrados()
{
    // Traemos todas las relaciones con carga de modelos
    $relaciones = AreaTieneCategorium::with(['area', 'categorium.gradoInicial', 'categorium.gradoFinal'])->get();

    // Agrupamos por área
    $areas = $relaciones->groupBy('id_area_area')->map(function ($items, $areaId) {
        $area = $items->first()->area; // El área es la misma para todos los items agrupados

        return [
            'id_area'   => $area->id_area,
            'nombre_area' => $area->nombre_area,
            'categorias' => $items->map(function ($item) {
                $categoria = $item->categorium;
                return [
                    'id_categoria'    => $categoria->id_categoria,
                    'nombre_categoria'=> $categoria->nombre_categoria,
                    'grado_inicial_id'=> $categoria->grado_ini,
                    'grado_inicial_nombre' => $categoria->gradoInicial ? $categoria->gradoInicial->nombre_grado : null,
                    'grado_final_id'  => $categoria->grado_fin,
                    'grado_final_nombre'   => $categoria->gradoFinal ? $categoria->gradoFinal->nombre_grado : null,
                ];
            })->values()
        ];
    })->values();

    return response()->json($areas);
}


}
