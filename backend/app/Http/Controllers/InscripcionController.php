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
        //Mejoraré mi backend con esto directamente, no necesitará "registrador"
        //$user = $request->user();


        $validated = $request->validate([
            'registrador.nombre' => 'required|string',
            'registrador.apellido' => 'required|string',
            'registrador.email' => 'required|email',
            'registrador.ci' => 'required|integer|min:1',

            'id_ue' => 'required|integer',
            'id_formulario_actual' => 'required|integer',

            'estudiantes' => 'required|array|min:1',
            'estudiantes.*.nombre' => 'required|string',
            'estudiantes.*.apellido' => 'required|string',
            'estudiantes.*.email' => 'required|email',
            'estudiantes.*.ci' => 'required|integer|min:1',
            'estudiantes.*.fecha_nacimiento' => 'required|date',
            'estudiantes.*.rude' => 'required|integer|min:1',
            'estudiantes.*.idAarea' => 'required|integer',
            'estudiantes.*.idCategoria' => 'required|integer',
        ]);

        try {
            DB::beginTransaction();

            $registradorData = $validated['registrador'];

            $registrador = Registrador::firstOrCreate(
                ['ci' => $registradorData['ci']],
                $registradorData
            );
            Log::debug($registrador);
            

            // Obtener el ID del formulario actual desde el request
            $idFormularioActual = $request->input('id_formulario_actual');

            // 2. Crear formulario
            // Si es 0, crear uno nuevo
            if ($idFormularioActual == 0) {
                $formulario = Formulario::create([
                    'id_registrador_registrador' => $registrador->id_registrador,
                    'id_ue_ue' => $request->id_ue
                ]);
            } else {
                // Si no, buscar el formulario existente
                $formulario = Formulario::find($idFormularioActual);
                //validar que exista
                if (!$formulario) {
                    return response()->json(['error' => 'Formulario no encontrado.'], 404);
                }
            }
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
                $estudiante = Estudiante::firstOrCreate(
                    ['ci' => $est['ci']],
                    $estudianteData
                );
                Log::debug($estudiante);

                //Verificar que el estudiante no esté inscrito en es AREA-CATEGORIA
                $yaInscrito = EstudianteEstaInscrito::where([
                    'id_estudiante_estudiante' => $estudiante->id_estudiante,
                    'id_formulario_formulario' => $formulario->id_formulario,
                    'id_area_area' => $est['idAarea'],
                    'id_categ' => $est['idCategoria'],
                ])->exists();

                // Crear inscripción en tabla pivote estudiante_esta_inscrito
                if (!$yaInscrito) {
                    EstudianteEstaInscrito::create([
                        'id_estudiante_estudiante' => $estudiante->id_estudiante,
                        'id_area_area' => $est['idAarea'],
                        'id_categ' => $est['idCategoria'],
                        'id_formulario_formulario' => $formulario->id_formulario
                    ]);
                }
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