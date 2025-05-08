<?php

namespace App\Http\Controllers;

use App\Models\OrdenPago;
use App\Models\Formulario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrdenPagoController extends Controller
{
    /**
     * Retorna la orden de pago asociada al formulario, validando que el usuario sea el dueño.
     */
    public function mostrarPorFormulario($id_formulario, Request $request)
    {
        $user = $request->user();

        $formulario = Formulario::where('id_formulario', $id_formulario)
                                ->where('id_usuario', $user->id)
                                ->first();

        if (!$formulario) {
            return response()->json(['error' => 'Formulario no encontrado o no pertenece al usuario.'], 404);
        }

        $orden = OrdenPago::where('id_formulario_formulario', $id_formulario)->first();

        if (!$orden) {
            return response()->json(['error' => 'Orden de pago no encontrada para este formulario.'], 404);
        }

        return response()->json($orden);
    }

    /**
     * (Opcional) Crear una nueva orden de pago.
     */
    public function crear(Request $request)
    {
        $validated = $request->validate([
            'fecha_emision' => 'required|date',
            'fecha_vencimiento' => 'required|date|after_or_equal:fecha_emision',
            'monto_total' => 'required|integer|min:0',
            'id_formulario_formulario' => 'required|exists:formulario,id_formulario',
        ]);

        $formulario = Formulario::find($validated['id_formulario_formulario']);

        if (!$formulario || $formulario->id_usuario !== $request->user()->id) {
            return response()->json(['error' => 'No autorizado o formulario no encontrado.'], 403);
        }

        $orden = OrdenPago::create([
            'fecha_emision' => $validated['fecha_emision'],
            'fecha_vencimiento' => $validated['fecha_vencimiento'],
            'monto_total' => $validated['monto_total'],
            'estado' => false,
            'id_formulario_formulario' => $validated['id_formulario_formulario'],
        ]);

        return response()->json(['message' => 'Orden de pago creada correctamente.', 'orden' => $orden], 201);
    }
}
