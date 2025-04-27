<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AreaTieneCategorium;

class CategoriaController extends Controller
{
    public function porArea($id_area)
    {
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
}
