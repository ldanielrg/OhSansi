<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AreaTieneCategorium;
use App\Models\Categorium;
use Illuminate\Support\Facades\DB;


class CategoriaController extends Controller{

    public function obtenerCategoriasPorConvocatoria($idConvocatoria){
        $categorias = Categorium::where('id_convocatoria_convocatoria', $idConvocatoria)
            ->where('activo', true)
            ->with(['gradoInicial', 'gradoFinal']) // incluye info de grado_ini y grado_fin
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

    public function categoriasConGrados()    {
        $categorias = Categorium::with(['gradoInicial', 'gradoFinal'])->get()
            ->map(function ($categoria) {
                return [
                    'id_categoria'    => $categoria->id_categoria,
                    'nombre_categoria'=> $categoria->nombre_categoria,
                    'grado_inicial_id'=> $categoria->grado_ini,
                    'grado_inicial_nombre'   => $categoria->gradoInicial ? $categoria->gradoInicial->nombre_grado : null,
                    'grado_final_id'  => $categoria->grado_fin,
                    'grado_final_nombre'     => $categoria->gradoFinal ? $categoria->gradoFinal->nombre_grado : null,
                ];
            });

        return response()->json($categorias);
    }

    //Crear categoría por nombre
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_categoria' => 'required|string|max:255',
        ]);

        $categoria = Categorium::create([
            'nombre_categoria' => $validated['nombre_categoria'],
        ]);

        return response()->json([
            'message' => 'Categoría creada exitosamente.',
            'categoria' => $categoria,
        ], 201);
    }

    //Eliminar categoría por ID
    public function destroy($id)
    {
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


    public function asignarGradosCategoria(Request $request)
    {
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

    public function limpiarGradosCategoria(Request $request)
    {
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
