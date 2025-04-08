<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Municipio;

class MunicipioController extends Controller
{
    public function porDepartamento($id_depart)
    {
        /**return Municipio::where('id_depart', $id_depart)
            ->select('id_municipio as id', 'nombre_municipio as nombre')
            ->get();
        */
        $municipios = Municipio::where('id_depart', $id_depart)
            ->select('id_municipio as id', 'nombre_municipio as nombre')
            ->get();

        return response()->json($municipios);
    }
}
