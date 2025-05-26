<?php

namespace App\Http\Controllers;

use App\Models\OrdenPago;
use App\Models\Formulario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrdenPagoController extends Controller
{
    /**
     * Retorna la orden de pago asociada al formulario, validando que el usuario sea el dueño.
     */
    public function mostrarPorFormulario($id_formulario, Request $request)
    {
        $user = $request->user();

        $formulario = Formulario::with('unidad_educativa')
                            ->where('id_formulario', $id_formulario)
                            ->where('id_usuario', $user->id)
                            ->first();

        if (!$formulario) {
            return response()->json(['error' => 'Formulario no encontrado o no pertenece al usuario.'], 404);
        }

        $orden = OrdenPago::where('id_formulario_formulario', $id_formulario)->first();

        if (!$orden) {
            return response()->json(['error' => 'Orden de pago no encontrada para este formulario.'], 404);
        }

        // Detalles por grupo (como antes)
        $detalles = DB::table('estudiante_esta_inscrito as ei')
            ->join('area_tiene_categoria as ac', 'ei.id_inscrito_en', '=', 'ac.id')
            ->select('ei.id_inscrito_en', 'ei.team', 'ac.precio')
            ->where('ei.id_formulario_formulario', $id_formulario)
            ->groupBy('ei.id_inscrito_en', 'ei.team', 'ac.precio')
            ->get();

        // Calcular monto total del formulario, sumando una vez por grupo
        $montoTotal = $detalles->sum('precio');

        return response()->json([
            'id_orden' => $orden->id_orden,
            'estado' => $orden->estado,
            'fecha_emision' => $orden->fecha_emision?->format('Y-m-d'),
            'fecha_vencimiento' => $orden->fecha_vencimiento?->format('Y-m-d'),
            'monto_total' => $orden->monto_total,
            'id_formulario' => $formulario->id_formulario,
            'unidad_educativa' => [
                'nombre' => $formulario->unidad_educativa->nombre_ue ?? 'No definido',
            ],
            'detalles_por_grupo' => $detalles,
            'monto_total' => $montoTotal
        ]);
    }

    /**
     * (Opcional) Crear una nueva orden de pago.
     */
    public function crear(Request $request)
    {
        $validated = $request->validate([
            'fecha_emision' => 'required|date',
            'fecha_vencimiento' => 'required|date|after_or_equal:fecha_emision',
            'id_formulario_formulario' => 'required|exists:formulario,id_formulario',
        ]);

        $formulario = Formulario::find($validated['id_formulario_formulario']);

        if (!$formulario || $formulario->id_usuario !== $request->user()->id) {
            return response()->json(['error' => 'No autorizado o formulario no encontrado.'], 403);
        }
        $detalles = DB::table('estudiante_esta_inscrito as ei')
                    ->join('area_tiene_categoria as ac', 'ei.id_inscrito_en', '=', 'ac.id')
                    ->select('ei.id_inscrito_en', 'ei.team', 'ac.precio')
                    ->where('ei.id_formulario_formulario', $validated['id_formulario_formulario'])
                    ->groupBy('ei.id_inscrito_en', 'ei.team', 'ac.precio')
                    ->get();

                // Calcular monto total del formulario, sumando una vez por grupo
                $montoTotal = $detalles->sum('precio');
        $orden = OrdenPago::create([
            'fecha_emision' => $validated['fecha_emision'],
            'fecha_vencimiento' => $validated['fecha_vencimiento'],
            'monto_total' => $montoTotal,
            'estado' => 'false',
            'id_formulario_formulario' => $validated['id_formulario_formulario'],
        ]);

        return response()->json(['message' => 'Orden de pago creada correctamente.', 'orden' => $orden], 201);
    }


    #Calcular precio total de un formulario
    public function calcularTotalPorEquipo($idFormulario){
        // Detalles por grupo (como antes)
        $detalles = DB::table('estudiante_esta_inscrito as ei')
            ->join('area_tiene_categoria as ac', 'ei.id_inscrito_en', '=', 'ac.id')
            ->select('ei.id_inscrito_en', 'ei.team', 'ac.precio')
            ->where('ei.id_formulario_formulario', $idFormulario)
            ->groupBy('ei.id_inscrito_en', 'ei.team', 'ac.precio')
            ->get();

        // Calcular monto total del formulario, sumando una vez por grupo
        $montoTotal = $detalles->sum('precio');

        return response()->json([
            'detalles_por_grupo' => $detalles,
            'monto_total' => $montoTotal
        ]);
    }
}
