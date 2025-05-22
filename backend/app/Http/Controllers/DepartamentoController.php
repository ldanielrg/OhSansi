<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Departamento;

class DepartamentoController extends Controller
{
    public function index()
    {
        /**return Departamento::select('id_depart as id', 'nombre_depart as nombre')->get();*/
        $departamentos = Departamento::select('id_departamento as id', 'nombre_departamento as nombre')->get();

        return response()->json($departamentos);
    }
}
