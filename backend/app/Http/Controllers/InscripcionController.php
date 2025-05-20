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
            'estudiantes.*.team' => 'required|integer|min:0',
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
                        'id_inscrito_en' => $relacion->id,
                        'team' => $est['team']
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

    #Editar, tanto datos personales como la inscripción de un estudiante
    public function editarEstudiante(Request $request){
        $validated = $request->validate([
            'id_formulario' => 'required|integer|exists:formulario,id_formulario',
    
            'anterior.id_estudiante' => 'required|integer|exists:estudiante,id_estudiante',
            'anterior.idArea' => 'required|integer',
            'anterior.idCategoria' => 'required|integer',
    
            'nuevo.nombre' => 'required|string',
            'nuevo.apellido' => 'required|string',
            'nuevo.email' => 'required|email',
            'nuevo.ci' => 'required|integer',
            'nuevo.rude' => 'required|integer',
            'nuevo.fecha_nacimiento' => 'required|date',
            'nuevo.idArea' => 'required|integer',
            'nuevo.idCategoria' => 'required|integer',
            //'nuevo.team' => 'required|integer|min:0',
        ]);
    
        // Paso 1: Buscar la relación actual (área + categoría)
        $relacionAnterior = AreaTieneCategorium::where('id_area_area', $validated['anterior']['idArea'])
            ->where('id_categoria_categoria', $validated['anterior']['idCategoria'])
            ->first();
    
        if (!$relacionAnterior) {
            return response()->json([
                'message' => 'La combinación área + categoría anterior no existe.'
            ], 422);
        }
    
        // Paso 2: Buscar la inscripción del estudiante
        $inscripcion = EstudianteEstaInscrito::where([
            'id_estudiante_estudiante' => $validated['anterior']['id_estudiante'],
            'id_formulario_formulario' => $validated['id_formulario'],
            'id_inscrito_en' => $relacionAnterior->id
        ])->first();
        
        if (!$inscripcion) {
            return response()->json([
                'message' => 'No se encontró inscripción con esos datos.'
            ], 404);
        }
    
        // Paso 3: Actualizar datos del estudiante
        $estudiante = Estudiante::find($validated['anterior']['id_estudiante']);
    
        if ($estudiante) {
            $estudiante->update([
                'nombre' => $validated['nuevo']['nombre'],
                'apellido' => $validated['nuevo']['apellido'],
                'email' => $validated['nuevo']['email'],
                'ci' => $validated['nuevo']['ci'],
                'rude' => $validated['nuevo']['rude'],
                'fecha_nacimiento' => $validated['nuevo']['fecha_nacimiento'],
            ]);
        }
    
        // Paso 4: Buscar nueva relación (área + categoría)
        $nuevaRelacion = AreaTieneCategorium::where('id_area_area', $validated['nuevo']['idArea'])
            ->where('id_categoria_categoria', $validated['nuevo']['idCategoria'])
            ->first();
    
        if (!$nuevaRelacion) {
            return response()->json([
                'message' => 'La nueva combinación área + categoría no existe.'
            ], 422);
        }
        
        // Paso 5: Validar que no haya ya otra inscripción con ese nuevo id_inscrito_en
        $yaExiste = EstudianteEstaInscrito::where([
            'id_estudiante_estudiante' => $estudiante->id_estudiante,
            'id_formulario_formulario' => $validated['id_formulario'],
            'id_inscrito_en' => $nuevaRelacion->id
        ])->exists();
        
        if ($yaExiste) {
            return response()->json([
                'message' => 'Ya existe una inscripción del estudiante en esa nueva área + categoría.'
            ]);
        }
        // Paso 6: Actualizar la inscripción
        EstudianteEstaInscrito::where([
            'id_estudiante_estudiante' => $inscripcion->id_estudiante_estudiante,
            'id_formulario_formulario' => $inscripcion->id_formulario_formulario,
            'id_inscrito_en' => $inscripcion->id_inscrito_en
        ])->update([
            'id_inscrito_en' => $nuevaRelacion->id,
            'team' => $validated['nuevo']['team']
        ]);
        return response()->json([
            'message' => 'Inscripción y datos del estudiante actualizados correctamente.'
        ]);
    }


    /*Antigua función de eliminar individualmente
    #Elimina un registro de inscripción de un estudiante. Si el estudiante ya no tiene formularios a su nombre, también lo elimina.
    public function eliminarInscripcion(Request $request){
        $validated = $request->validate([
            'id_formulario' => 'required|exists:formulario,id_formulario',
            'id_estudiante' => 'required|exists:estudiante,id_estudiante',
            'idArea' => 'required|integer',
            'idCategoria' => 'required|integer',
            'idEquipo' => 'required|integer',
        ]);

        // Paso 1: Buscar la combinación área + categoría
        $relacion = AreaTieneCategorium::where('id_area_area', $validated['idArea'])
            ->where('id_categoria_categoria', $validated['idCategoria'])
            ->first();

        if (!$relacion) {
            return response()->json([
                'message' => 'No existe una relación entre esa área y esa categoría.'
            ], 422);
        }

        // Paso 2: Buscar la inscripción específica
        $inscripcion = EstudianteEstaInscrito::where([
            'id_estudiante_estudiante' => $validated['id_estudiante'],
            'id_formulario_formulario' => $validated['id_formulario'],
            'id_inscrito_en' => $relacion->id
        ])->first();

        if (!$inscripcion) {
            return response()->json([
                'message' => 'No se encontró la inscripción para eliminar.'
            ], 404);
        }

        // Paso 3: Eliminar solo esa inscripción
        EstudianteEstaInscrito::where([
            'id_estudiante_estudiante' => $validated['id_estudiante'],
            'id_formulario_formulario' => $validated['id_formulario'],
            'id_inscrito_en' => $relacion->id
        ])->delete();

        // Paso 4: Verificar si el estudiante tiene más inscripciones
        $aunTieneInscripciones = EstudianteEstaInscrito::where('id_estudiante_estudiante', $validated['id_estudiante'])->exists();

        // Paso 5: Si no tiene más, eliminar al estudiante
        if (!$aunTieneInscripciones) {
            Estudiante::find($validated['id_estudiante'])?->delete();
        }

        return response()->json([
            'message' => 'Inscripción eliminada correctamente.'
        ]);
    }
    */

    #Nueva función para eliminar a todo el equipo
    public function eliminarInscripcion(Request $request){
        $validated = $request->validate([
            'id_formulario' => 'required|exists:formulario,id_formulario',
            'id_estudiante' => 'required|exists:estudiante,id_estudiante',
            'idArea' => 'required|integer',
            'idCategoria' => 'required|integer',
            'idEquipo' => 'required|integer',
        ]);

        // Paso 1: Buscar la relación área + categoría
        $relacion = AreaTieneCategorium::where('id_area_area', $validated['idArea'])
            ->where('id_categoria_categoria', $validated['idCategoria'])
            ->first();

        if (!$relacion) {
            return response()->json([
                'message' => 'No existe una relación entre esa área y esa categoría.'
            ], 422);
        }

        // Paso 2: Eliminar TODAS las inscripciones del mismo equipo
        $inscripcionesAEliminar = EstudianteEstaInscrito::where([
            'id_formulario_formulario' => $validated['id_formulario'],
            'id_inscrito_en' => $relacion->id,
            'team' => $validated['idEquipo']
        ])->get();

        // Guardar IDs de estudiantes antes de eliminar
        $idsEstudiantes = $inscripcionesAEliminar->pluck('id_estudiante_estudiante')->toArray();

        // Eliminar las inscripciones
        EstudianteEstaInscrito::whereIn('id_estudiante_estudiante', $idsEstudiantes)
            ->where('id_formulario_formulario', $validated['id_formulario'])
            ->where('id_inscrito_en', $relacion->id)
            ->where('team', $validated['idEquipo'])
            ->delete();

        // Paso 3: Verificar cuáles estudiantes ya no tienen inscripciones y eliminarlos
        foreach ($idsEstudiantes as $idEstudiante) {
            $aunTiene = EstudianteEstaInscrito::where('id_estudiante_estudiante', $idEstudiante)->exists();
            if (!$aunTiene) {
                Estudiante::find($idEstudiante)?->delete();
            }
        }

        return response()->json([
            'message' => 'Inscripción del equipo eliminada correctamente.',
            'equipo_eliminado' => $validated['idEquipo'],
            'estudiantes_eliminados' => $idsEstudiantes,
        ]);
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

                'idAarea' => $inscrito->area->id_area ?? '',
                'nombre_area' => $inscrito->area->nombre_area ?? '',
                'idCategoria' => $inscrito->categorium->id_categoria ?? '',
                'nombre_categoria' => $inscrito->categorium->nombre_categoria ?? '',

                'team' => $inscripcion->team ?? null,
                'precio' => $inscrito->precio ?? null
            ];
        });

        return response()->json([
            'id_formulario' => $formulario->id_formulario,
            'id_convocatoria_convocatoria' => $formulario->id_convocatoria_convocatoria,
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

    #Esto te dá el nro del team que te corresponde.
    public function obtenerSiguienteTeam(Request $request){
        $idArea = $request->input('idArea');
        $idCategoria = $request->input('idCategoria');

        // Validación básica (opcional pero recomendado)
        if (!$idArea || !$idCategoria) {
            return response()->json([
                'error' => 'Faltan idArea o idCategoria en la solicitud.'
            ], 422);
        }

        // Buscar el id de area_tiene_categoria
        $inscritoEn = DB::table('area_tiene_categoria')
            ->where('id_area_area', $idArea)
            ->where('id_categoria_categoria', $idCategoria)
            ->value('id');

        if (!$inscritoEn) {
            return response()->json([
                'error' => 'No se encontró una combinación válida en area_tiene_categoria.'
            ], 404);
        }

        // Buscar el último número de team asociado a ese id_inscrito_en
        $ultimoTeam = DB::table('estudiante_esta_inscrito')
            ->where('id_inscrito_en', $inscritoEn)
            ->max('team');

        $siguienteTeam = $ultimoTeam ? $ultimoTeam + 1 : 1;

        return response()->json([
            'siguiente_team' => $siguienteTeam,
            //'id_inscrito_en' => $inscritoEn
        ]);
    }

    #Esto te dá cuantos participantes deben haber en esa area-categoria
    public function obtenerNroParticipantes(Request $request){
        $idArea = $request->input('idArea');
        $idCategoria = $request->input('idCategoria');

        if (!$idArea || !$idCategoria) {
            return response()->json([
                'error' => 'Faltan idArea o idCategoria.'
            ], 422);
        }

        $nroParticipantes = DB::table('area_tiene_categoria')
            ->where('id_area_area', $idArea)
            ->where('id_categoria_categoria', $idCategoria)
            ->value('nro_participantes');

        if (is_null($nroParticipantes)) {
            return response()->json([
                'error' => 'No se encontró esa combinación Area-Categoria O el valor es NULL'
            ], 404);
        }

        return response()->json([
            'nro_participantes' => $nroParticipantes
        ]);
    }
}