<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Grado;

class GradoController extends Controller
{
    public function todo(){
        return Grado::all();
    }
}
