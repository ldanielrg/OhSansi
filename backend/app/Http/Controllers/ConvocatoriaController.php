<?php

namespace App\Http\Controllers;

use App\Models\Convocatoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
class ConvocatoriaController extends Controller
{
    #Obtiene todas las convocatorias
    public function index(){
        return response()->json(Convocatoria::all());
    }

    #Para crear una convocatoria
    public function store(Request $request){
        Log::debug($request);
        //Validación
        $validator = Validator::make($request->all(), [
            'nombre_convocatoria' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_final' => 'required|date|after_or_equal:fecha_inicio',
            'activo' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // 📝 Log de datos recibidos
        Log::info('Datos recibidos para convocatoria:', $request->all());

        $convocatoria = Convocatoria::create([
            'nombre_convocatoria' => $request->input('nombre_convocatoria'),
            'descripcion' => $request->input('descripcion'),
            'fecha_inicio' => $request->input('fecha_inicio'),
            'fecha_final' => $request->input('fecha_final'),
            'activo' => $request->input('activo')
        ]);

        return response()->json([
            'message' => 'Convocatoria creada correctamente.'
        ], 201);
    }

    #Muestra datos de una determinada convocatoria
    public function show($id){
        return response()->json(Convocatoria::findOrFail($id));
    }

    #Para actualizar datos de una convocatoria
    public function update(Request $request,$id){
        $convocatoria = Convocatoria::findOrFail($id);
        $convocatoria->update($request->all());

        return response()->json($convocatoria);
    }

    #Eliminar una convocatoria.
    public function destroy(string $id){
        Convocatoria::destroy($id);
        return response()->json(null, 204);
    }
}

