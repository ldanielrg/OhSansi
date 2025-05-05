<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AreaTieneCategorium;
use App\Models\Categorium;
use Illuminate\Support\Facades\DB;
use App\Models\Convocatoria;

class CategoriaController extends Controller{

    #Obtiene categorias dado un id_convocatoria
    public function obtenerCategoriasPorConvocatoria(Request $request){
        $validated = $request->validate([
            'id_convocatoria' => 'required|integer|exists:convocatoria,id_convocatoria'
        ]);

        $categorias = Categorium::where('id_convocatoria_convocatoria', $validated['id_convocatoria'])
            // ->where('activo', true)
            ->with(['gradoInicial', 'gradoFinal'])
            ->get();

        return response()->json($categorias);
    }

    public function porArea($id_area)    {
        $resultado = AreaTieneCategorium::with('categorium')
        ->where('id_area_area', $id_area)
        ->get()
        ->map(function ($cat) {
            return [
                'id_categoria' => $cat->id_categoria_categoria,
                'nombre_categoria' => $cat->categorium->nombre_categoria,
            ];
        });


        return response()->json($resultado);
    }

    public function todo(){
        return Categorium::all();
    }

    public function categoriasConGradosPorConvocatoria($id_convocatoria){
        // Validamos que la convocatoria exista
        if (!\App\Models\Convocatoria::where('id_convocatoria', $id_convocatoria)->exists()) {
            return response()->json([
                'message' => 'Convocatoria no encontrada.'
            ], 404);
        }

        $categorias = Categorium::with(['gradoInicial', 'gradoFinal'])
            ->where('id_convocatoria_convocatoria', $id_convocatoria)
            ->get()
            ->map(function ($categoria) {
                return [
                    'id_categoria' => $categoria->id_categoria,
                    'nombre_categoria' => $categoria->nombre_categoria,
                    'grado_inicial_id' => $categoria->grado_ini,
                    'grado_inicial_nombre' => $categoria->gradoInicial ? $categoria->gradoInicial->nombre_grado : null,
                    'grado_final_id' => $categoria->grado_fin,
                    'grado_final_nombre' => $categoria->gradoFinal ? $categoria->gradoFinal->nombre_grado : null,
                ];
            });

        return response()->json($categorias);
    }

    //Crear categoría por nombre y asociarlo a convocatoria
    public function store(Request $request, $id_convocatoria){
        // Validación del cuerpo del request
        $validated = $request->validate([
            'nombre_categoria' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            //'grado_ini' => 'required|exists:grado,id_grado',
            //'grado_fin' => 'required|exists:grado,id_grado',
            //'activo' => 'nullable|boolean'
        ]);

        // Validar que la convocatoria exista
        if (!Convocatoria::where('id_convocatoria', $id_convocatoria)->exists()) {
            return response()->json([
                'message' => 'Convocatoria no encontrada.'
            ], 404);
        }

        // Crear categoría vinculada a la convocatoria
        $categoria = Categorium::create([
            'nombre_categoria' => $validated['nombre_categoria'],
            'descripcion' => $validated['descripcion'] ?? null,
            'grado_ini' => null, //$validated['grado_ini'],
            'grado_fin' => null, //$validated['grado_fin'],
            //'activo' => $validated['activo'] ?? true,
            'activo' => true,
            'id_convocatoria_convocatoria' => $id_convocatoria
        ]);

        return response()->json([
            'message' => 'Categoría creada exitosamente.',
            'categoria' => $categoria,
        ], 201);
    }

    #Para editar una categoria
    public function update(Request $request){
        $validated = $request->validate([
            'id_categoria' => 'required|integer|exists:categoria,id_categoria',
            'nombre_categoria' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            //'grado_ini' => 'required|exists:grado,id_grado',
            //'grado_fin' => 'required|exists:grado,id_grado',
            // 'activo' => 'nullable|boolean'
        ]);

        // Buscar categoría directamente por ID
        $categoria = Categorium::find($validated['id_categoria']);

        if (!$categoria) {
            return response()->json([
                'message' => 'Categoría no encontrada.'
            ], 404);
        }

        // Actualizar campos
        $categoria->update([
            'nombre_categoria' => $validated['nombre_categoria'],
            'descripcion' => $validated['descripcion'] ?? null,
            //'grado_ini' => $validated['grado_ini'],
            //'grado_fin' => $validated['grado_fin'],
            'activo' => true //$validated['activo'] ?? true
        ]);

        return response()->json([
            'message' => 'Categoría actualizada correctamente.',
            'categoria' => $categoria
        ]);
    }

    //Eliminar categoría por ID
    public function destroy($id){
        $categoria = Categorium::find($id);

        if (!$categoria) {
            return response()->json([
                'message' => 'Categoría no encontrada.',
            ], 404);
        }

        $categoria->delete();

        return response()->json([
            'message' => 'Categoría eliminada correctamente.',
        ]);
    }


    public function asignarGradosCategoria(Request $request){
        $validated = $request->validate([
            'id_categoria' => 'required|integer|exists:categoria,id_categoria',
            'grado_inicial_id' => 'required|integer|exists:grado,id_grado',
            'grado_final_id' => 'required|integer|exists:grado,id_grado',
        ]);

        DB::beginTransaction();

        try {
            // Buscar la categoría
            $categoria = Categorium::findOrFail($validated['id_categoria']);

            // Actualizar los grados inicial y final
            $categoria->grado_ini = $validated['grado_inicial_id'];
            $categoria->grado_fin = $validated['grado_final_id'];
            $categoria->save();

            DB::commit();

            return response()->json([
                'message' => 'Grados asignados a la categoría correctamente.'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al asignar grados a categoría.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function limpiarGradosCategoria(Request $request){
        $validated = $request->validate([
            'id_categoria' => 'required|integer|exists:categoria,id_categoria',
        ]);

        DB::beginTransaction();

        try {
            $categoria = Categorium::findOrFail($validated['id_categoria']);

            $categoria->grado_ini = null;
            $categoria->grado_fin = null;
            $categoria->save();

            DB::commit();

            return response()->json([
                'message' => 'Grados limpiados de la categoría correctamente.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al limpiar grados de la categoría.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
