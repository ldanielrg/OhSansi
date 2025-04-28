<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AreaTieneCategorium;
use App\Models\Categorium;

class CategoriaController extends Controller{
   
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
                    'grado_inicial'   => $categoria->gradoInicial ? $categoria->gradoInicial->nombre : null,
                    'grado_final_id'  => $categoria->grado_fin,
                    'grado_final'     => $categoria->gradoFinal ? $categoria->gradoFinal->nombre : null,
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
}
