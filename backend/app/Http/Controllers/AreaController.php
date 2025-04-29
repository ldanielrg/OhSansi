<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Area;
use App\Models\AreaTieneCategorium;
use App\Models\Categorium;
use Illuminate\Support\Facades\DB;

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


    //Para devolver areas, categorias y grados, relacionados.
    public function AreasConcategoriasConGrados(){
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

    //Para crear una relacion de Area-Categoria-Grados
    public function asignarAreaCategoriaGrado(Request $request)
    {
        $validated = $request->validate([
            'id_area' => 'required|integer|exists:area,id_area',
            'id_categoria' => 'required|integer|exists:categoria,id_categoria',
            'grado_inicial_id' => 'required|integer|exists:grado,id_grado',
            'grado_final_id' => 'required|integer|exists:grado,id_grado',
        ]);

        DB::beginTransaction(); // <-- inicia la transacción

        try {
            // Paso 1: Verificar si existe relación Área-Categoría
            $relacionExistente = AreaTieneCategorium::where('id_area_area', $validated['id_area'])
                ->where('id_categoria_categoria', $validated['id_categoria'])
                ->first();

            if (!$relacionExistente) {
                AreaTieneCategorium::create([
                    'id_area_area' => $validated['id_area'],
                    'id_categoria_categoria' => $validated['id_categoria'],
                ]);
            }

            // Paso 2: Actualizar la categoría con grados inicial y final
            $categoria = Categorium::findOrFail($validated['id_categoria']);
            $categoria->grado_ini = $validated['grado_inicial_id'];
            $categoria->grado_fin = $validated['grado_final_id'];
            $categoria->save();

            DB::commit(); // <-- si todo sale bien, confirmar

            return response()->json([
                'message' => 'Asignación realizada correctamente.',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // <-- si algo falla, revertir todo

            return response()->json([
                'message' => 'Error al asignar la categoría a grados.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function asignarAreaCategoria(Request $request)    {
        $validated = $request->validate([
            'id_area' => 'required|integer|exists:area,id_area',
            'id_categoria' => 'required|integer|exists:categoria,id_categoria',
        ]);

        DB::beginTransaction();

        try {
            // Verificar si ya existe la relación
            $relacionExistente = AreaTieneCategorium::where('id_area_area', $validated['id_area'])
                ->where('id_categoria_categoria', $validated['id_categoria'])
                ->first();

            if ($relacionExistente) {
                return response()->json([
                    'message' => 'Esta categoría ya está asignada a esta área.'
                ], 409); // Conflict
            }

            // Crear nueva relación
            AreaTieneCategorium::create([
                'id_area_area' => $validated['id_area'],
                'id_categoria_categoria' => $validated['id_categoria'],
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Área y categoría asignadas correctamente.'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al asignar área a categoría.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function eliminarAsignacionAreaCategoria(Request $request){
        $validated = $request->validate([
            'id_area' => 'required|integer|exists:area,id_area',
            'id_categoria' => 'required|integer|exists:categoria,id_categoria',
        ]);
    
        DB::beginTransaction();
    
        try {
            // No usamos Eloquent->delete(), hacemos el query manual
            $eliminados = AreaTieneCategorium::where('id_area_area', $validated['id_area'])
                ->where('id_categoria_categoria', $validated['id_categoria'])
                ->delete();
    
            if ($eliminados === 0) {
                DB::rollBack();
                return response()->json([
                    'message' => 'No se encontró la asignación para eliminar.'
                ], 404);
            }
    
            DB::commit();
    
            return response()->json([
                'message' => 'Asignación área-categoría eliminada correctamente.'
            ], 200);
    
        } catch (\Exception $e) {
            DB::rollBack();
    
            return response()->json([
                'message' => 'Error al eliminar asignación área-categoría.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

}
