<?php
namespace App\Http\Controllers;


use App\Models\Formulario;
use App\Models\Registrador;
use App\Models\Estudiante;
use App\Models\EstudianteEstaInscrito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;;

class InscripcionController extends Controller{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'registrador.nombre' => 'required|string',
            'registrador.apellido' => 'required|string',
            'registrador.email' => 'required|email',
            'registrador.ci' => 'required|string',

            'id_ue' => 'required|integer',

            'estudiantes' => 'required|array|min:1',
            'estudiantes.*.nombre' => 'required|string',
            'estudiantes.*.apellido' => 'required|string',
            'estudiantes.*.email' => 'required|email',
            'estudiantes.*.ci' => 'required|string',
            'estudiantes.*.fecha_nacimiento' => 'required|date',
            'estudiantes.*.rude' => 'required|string',
            'estudiantes.*.idAarea' => 'required|integer',
            'estudiantes.*.idCategoria' => 'required|integer',
        ]);

        try {
            DB::beginTransaction();

            // 1. Crear registrador
            $registrador = Registrador::create($request->input('registrador'));

            
            Log::debug($registrador);
            
            // 2. Crear formulario
            $formulario = Formulario::create([
                'id_registrador_registrador' => $registrador->id_registrador,
                'id_ue_ue' => $request->id_ue
            ]);
            Log::debug($formulario);
    
            // 3. Crear estudiantes y asociarlos al formulario
            foreach ($request->estudiantes as $est) {
                // Separar los campos del estudiante
                $estudianteData = [
                    'nombre' => $est['nombre'],
                    'apellido' => $est['apellido'],
                    'email' => $est['email'],
                    'ci' => $est['ci'],
                    'fecha_nacimiento' => $est['fecha_nacimiento'],
                    'rude' => $est['rude'],
                ];

                // Crear estudiante asociado al formulario
                $estudiante = Estudiante::create($estudianteData);
                Log::debug($estudiante);
                // Crear inscripción en tabla pivote estudiante_esta_inscrito
                EstudianteEstaInscrito::create([
                    'id_estudiante_estudiante' => $estudiante->id_estudiante,
                    'id_area_area' => $est['idAarea'],
                    'id_categ' => $est['idCategoria'],
                    'id_formulario_formulario' => $formulario->id_formulario
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Formulario y estudiantes registrados correctamente.'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al guardar el formulario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}