<?php
namespace App\Http\Controllers;


use App\Models\Formulario;
use App\Models\Registrador;
use App\Models\Estudiante;
use App\Models\EstudianteEstaInscrito;
use App\Models\OrdenPago;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;;

class InscripcionController extends Controller{
    public function store(Request $request){
        
        Log::debug($request);

        $validated = $request->validate([
            'id_formulario_actual' => 'required|integer',
            'estudiantes' => 'required|array|min:1',
            'estudiantes.*.id_estudiante' => 'nullable|exists:estudiante,id_estudiante', //Este es bueno, lo coloco porque valida también que 
                                                 //si viene ID entonces mínimo ese id exista en la tabla estudiantes
            'estudiantes.*.nombre' => 'required|string',
            'estudiantes.*.apellido' => 'required|string',
            'estudiantes.*.email' => 'required|email',
            'estudiantes.*.ci' => 'required|integer|min:1',
            'estudiantes.*.fecha_nacimiento' => 'required|date',
            'estudiantes.*.rude' => 'required|integer|min:1',
            'estudiantes.*.idAarea' => 'required|integer',
            'estudiantes.*.idCategoria' => 'required|integer',
        ]);
        Log::debug($validated);
        $user = $request->user();
        
        try {
            DB::beginTransaction();

            $registradorData = [
                'nombre' => $user->name,    
                'apellido' => $user->apellido ?? '', 
                'email' => $user->email,
                'ci' => $user->ci,
            ];

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
                    'id_usuario' => $user->id,
                    'id_ue_ue' => $user->id_ue_ue
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
                    'id_estudiante' => $est['id_estudiante'],
                    'nombre' => $est['nombre'],
                    'apellido' => $est['apellido'],
                    'email' => $est['email'],
                    'ci' => $est['ci'],
                    'fecha_nacimiento' => $est['fecha_nacimiento'],
                    'rude' => $est['rude'],
                ];

                // Crear estudiante o Actualiza. Dependiendo si el id_estudiante existe
                if (isset($est['id_estudiante'])) {
                    // Si viene el id_estudiante, actualizamos por ID
                    $estudiante = Estudiante::find($est['id_estudiante']);
                    if ($estudiante) {
                        $estudiante->update($estudianteData);
                    } else {
                        // Si el ID no existe (por algún error), tratar de buscar por CI
                        $estudiante = Estudiante::firstOrCreate(
                            ['ci' => $est['ci']],
                            $estudianteData
                        );
                    }
                } else {
                    // No viene ID, entonces buscar por CI o crear. Asi evitamos duplicados p
                    $estudiante = Estudiante::firstOrCreate(
                        ['ci' => $est['ci']],
                        $estudianteData
                    );
                }
                
                
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

    #Recupera formularios llenados por un usuario
    public function recuperarFormularios(Request $request, $id_convocatoria){
        $user = $request->user();

        $formularios = Formulario::where('id_usuario', $user->id)
            ->where('id_convocatoria_convocatoria', $id_convocatoria)
            ->withCount('inscripciones')
            ->get();

        return response()->json([
            'formularios' => $formularios
        ], 200);
    }

    #Muestra los estudiantes inscritos en un formulario especifico
    public function mostrarFormulario($id){
        $formulario = Formulario::with('inscripciones.estudiante', 'inscripciones.inscrito.area', 'inscripciones.inscrito.categorium')
                                ->findOrFail($id);

        // Recolectar estudiantes formateados
        $estudiantes = $formulario->inscripciones->map(function ($inscripcion) {
            $inscrito = $inscripcion->inscrito;
            return [
                'id_estudiante' => $inscripcion->estudiante->id_estudiante ?? '',
                'nombre' => $inscripcion->estudiante->nombre ?? '',
                'apellido' => $inscripcion->estudiante->apellido ?? '',
                'email' => $inscripcion->estudiante->email ?? '',
                'ci' => $inscripcion->estudiante->ci ?? '',
                'fecha_nacimiento' => $inscripcion->estudiante->fecha_nacimiento ?? '',
                'rude' => $inscripcion->estudiante->rude ?? '',
                'idAarea' =>  $inscrito->area->id_area,
                'nombre_area' => $inscrito->area->nombre_area ?? '',
                'idCategoria' => $inscrito->categorium->id_categoria,
                'nombre_categoria' => $inscrito->categorium->nombre_categoria ?? '',
            ];
        });

        return response()->json([
            'id_formulario' => $formulario->id_formulario,
            'estudiantes' => $estudiantes
        ]);
    }

    public function eliminarFormulario(Request $request, $id){
        $user = $request->user(); // Usuario autenticado

        DB::beginTransaction();

        try {
            $formulario = Formulario::find($id);

            if (!$formulario) {
                return response()->json(['message' => 'Formulario no encontrado.'], 404);
            }

            // Verificar si el formulario pertenece al usuario
            if ($formulario->id_usuario !== $user->id) {
                return response()->json(['message' => 'No autorizado para eliminar este formulario.'], 403);
            }

            // Eliminar inscripciones asociadas
            EstudianteEstaInscrito::where('id_formulario_formulario', $id)->delete();

            // Eliminar el formulario
            $formulario->delete();

            DB::commit();

            return response()->json(['message' => 'Formulario e inscripciones eliminados exitosamente.'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al eliminar el formulario',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}