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
    public function store(Request $request, $id_convocatoria){
        // Validar que envíen nombre y convocatoria
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
        ]);
        // Validar que la convocatoria exista
        if (!Convocatoria::where('id_convocatoria', $id_convocatoria)->exists()) {
            return response()->json([
                'message' => 'Convocatoria no encontrada.'
            ], 404);
        }

        // Crear y guardar nueva área
        $area = Area::create([
            'nombre_area' => $validated['nombre'],
            'id_convocatoria_convocatoria' => $validated['id_convocatoria'], //AGREGUE YO
            'activo' => true // por ahora siempre se crea activo.
        ]);

        return response()->json([
            'message' => 'Área creada exitosamente.'
        ], 201);
    }

    //AGREGUE YO EL METODO NUEVO
    public function storeDesdeRuta(Request $request, $id_convocatoria){
        // Validar solo el nombre del área
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        // Asegurarse que la convocatoria exista
        if (!Convocatoria::where('id_convocatoria', $id_convocatoria)->exists()) {
            return response()->json(['message' => 'Convocatoria no encontrada.'], 404);
        }

        // Crear el área asociada a la convocatoria
        $area = Area::create([
            'nombre_area' => $validated['nombre'],
            'id_convocatoria_convocatoria' => $id_convocatoria,
            'activo' => true
        ]);

        return response()->json([
            'message' => 'Área creada exitosamente.',
            'area' => $area
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

    #Eliminar un área por id_area
    public function destroy($id_area){
        $area = Area::find($id_area);

        if (!$area) {
            return response()->json([
                'message' => 'Área no encontrada.'
            ], 404);
        }

        $area->delete(); // Soft delete o hard delete según configuración

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

    #Relaciona un área y una categoría.
    public function asignarAreaCategoria(Request $request){
        $validated = $request->validate([
            'id_area' => 'required|integer|exists:area,id_area',
            'id_categoria' => 'required|integer|exists:categoria,id_categoria',
            'precio' => 'nullable|numeric|min:0',
            'nro_participantes' => 'integer|min:1',
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
                'nro_participantes' => $validated['nro_participantes'],
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

        // Limpiar grados en la categoría
        $categoria = Categorium::find($validated['id_categoria']);
        if ($categoria) {
            $categoria->grado_ini = null;
            $categoria->grado_fin = null;
            $categoria->save();
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
