<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Area;
use App\Models\AreaTieneCategorium;
use App\Models\Categorium;
use Illuminate\Support\Facades\DB;
use App\Models\Convocatoria;


class AreaController extends Controller{
    #Obtiene todas la areas de una convocatoria id
    public function obtenerAreasPorConvocatoria($idConvocatoria){
        $areas = Area::where('id_convocatoria_convocatoria', $idConvocatoria)
            //->where('activo', true) //si solo quiero activas
            ->get();

        return response()->json($areas);
    }
    
    #Crea una nueva area asociada a id_convocatoria
    public function store(Request $request){
        // Validar que envíen nombre y convocatoria
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'id_convocatoria' => 'required|exists:convocatoria,id_convocatoria'
        ]);

        // Crear y guardar nueva área
        $area = Area::create([
            'nombre_area' => $validated['nombre'],
            'id_convocatoria_convocatoria' => $validated['id_convocatoria'],
            'activo' => true // por ahora siempre se crea activo.
        ]);

        return response()->json([
            'message' => 'Área creada exitosamente.'
        ], 201);
    }

    #Editar un área asociada
    public function update(Request $request){
        $validated = $request->validate([
            'id_area' => 'required|integer|exists:area,id_area',
            'nombre_area' => 'required|string|max:255',
            'activo' => 'nullable|boolean',
        ]);

        $area = Area::find($validated['id_area']);

        $area->nombre_area = $validated['nombre_area'];

        if (isset($validated['activo'])) {
            $area->activo = $validated['activo'];
        }

        $area->save();

        return response()->json([
            'message' => 'Área actualizada correctamente.',
            'area' => $area
        ], 200);
    }

    #Eliminar un área por id_area e id_convocatoria
    public function destroy(Request $request){
    $validated = $request->validate([
        'id_convocatoria' => 'required|exists:convocatoria,id_convocatoria',
        'id_area' => 'required|exists:area,id_area',
    ]);

    // Buscar el área y verificar que pertenezca a la convocatoria
    $area = Area::where('id_area', $validated['id_area'])
                ->where('id_convocatoria_convocatoria', $validated['id_convocatoria'])
                ->first();

    if (!$area) {
        return response()->json([
            'message' => 'Área no encontrada en esta convocatoria.'
        ], 404);
    }

    $area->delete(); // Soft delete o hard delete, según configuración

    return response()->json([
        'message' => 'Área eliminada exitosamente.'
    ]);
    }


    //Para devolver areas, categorias y grados, relacionados.
    public function AreasConcategoriasConGradosPorConvocatoria($id_convocatoria){
        $relaciones = AreaTieneCategorium::with([
            'area',
            'categorium.gradoInicial',
            'categorium.gradoFinal'
        ])
        // Filtrar solo las áreas que pertenecen a la convocatoria deseada
        ->whereHas('area', function ($query) use ($id_convocatoria) {
            $query->where('id_convocatoria_convocatoria', $id_convocatoria);
        })
        ->get();

        // Agrupar por área
        $areas = $relaciones->groupBy('id_area_area')->map(function ($items, $areaId) {
            $area = $items->first()->area;

            return [
                'id_area' => $area->id_area,
                'nombre_area' => $area->nombre_area,
                'categorias' => $items->map(function ($item) {
                    $categoria = $item->categorium;
                    return [
                        'id_categoria' => $categoria->id_categoria,
                        'nombre_categoria' => $categoria->nombre_categoria,
                        'grado_inicial_id' => $categoria->grado_ini,
                        'grado_inicial_nombre' => $categoria->gradoInicial ? $categoria->gradoInicial->nombre_grado : null,
                        'grado_final_id' => $categoria->grado_fin,
                        'grado_final_nombre' => $categoria->gradoFinal ? $categoria->gradoFinal->nombre_grado : null,
                    ];
                })->values()
            ];
        })->values();

        return response()->json($areas);
    }

    //Para crear una relacion de Area-Categoria-Grados
    /*
    public function asignarAreaCategoriaGrado(Request $request){
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
    */

    #Relaciona un área y una categoría.
    public function asignarAreaCategoria(Request $request){
        $validated = $request->validate([
            'id_area' => 'required|integer|exists:area,id_area',
            'id_categoria' => 'required|integer|exists:categoria,id_categoria',
            'precio' => 'nullable|numeric|min:0',
            //'activo' => 'nullable|boolean'
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
                'precio' => $validated['precio'] ?? 0,
                //'activo' => $validated['activo'] ?? true,
                'activo' => true, //por ahora le pondré por defecto true.
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

    #Elimna la relación de un área y una categoría.
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
                'message' => 'Asignación área-categoría eliminada correctamente.',
                'eliminados' => $eliminados
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
