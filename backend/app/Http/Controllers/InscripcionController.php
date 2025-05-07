<?php
namespace App\Http\Controllers;


use App\Models\Formulario;
use App\Models\Registrador;
use App\Models\Estudiante;
use App\Models\EstudianteEstaInscrito;
use App\Models\AreaTieneCategorium;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;;

class InscripcionController extends Controller{
    #Inscribir estudiantes (sólo inscripción)
    public function inscribirEstudiantes(Request $request){
        
        Log::debug($request);

        $validated = $request->validate([
            'id_formulario_actual' => 'required|integer',
            'id_convocatoria' => 'required|exists:convocatoria,id_convocatoria',
            'estudiantes' => 'required|array|min:1',
            'estudiantes.*.id_estudiante' => 'nullable|exists:estudiante,id_estudiante',
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
                    'id_ue_ue' => $user->id_ue_ue,
                    'id_convocatoria_convocatoria' => $validated['id_convocatoria']
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

                // Buscamos o Creamos Estudiante
                if (empty($est['id_estudiante'])) {
                    // No hay id_estudiante. Entonces buscar por CI
                    $estudiante = Estudiante::where('ci', $est['ci'])->first();
                    if (!$estudiante) {
                        // No se encontró por CI, crear uno nuevo
                        $estudiante = Estudiante::create($estudianteData);
                    }
                } else {
                    // Hay id_estudiante, entonces buscar por id.
                    $estudiante = Estudiante::find($est['id_estudiante']);
                    if (!$estudiante) {
                        continue; //Si no hay id, pasamos al siguiente estudiante en la lista para isncribir.
                    }
                }

                Log::debug($estudiante);

                //Buscamos la combinación de idArea e idCategoria en la tabla "area_tiene_categoria"
                $relacion = AreaTieneCategorium::where('id_area_area', $est['idAarea'])
                    ->where('id_categoria_categoria', $est['idCategoria'])
                    ->first();

                if (!$relacion) {
                    continue; //Si no existe esa Area-Categoria, pasamos al siguiente estudiante para inscribir.
                }

                //Vemos si el estudiante ya está inscrito en esa Area-Categoria
                $yaInscrito = EstudianteEstaInscrito::where([
                    'id_estudiante_estudiante' => $estudiante->id_estudiante,
                    'id_formulario_formulario' => $formulario->id_formulario,
                    'id_inscrito_en' => $relacion->id
                ])->exists();
                //Sólo inscribimos si no está inscrito.
                if (!$yaInscrito) {
                    EstudianteEstaInscrito::create([
                        'id_estudiante_estudiante' => $estudiante->id_estudiante,
                        'id_formulario_formulario' => $formulario->id_formulario,
                        'id_inscrito_en' => $relacion->id
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