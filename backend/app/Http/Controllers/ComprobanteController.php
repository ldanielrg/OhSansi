<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\Comprobante;
use App\Models\OrdenPago;
use App\Models\Formulario;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\File;


class ComprobanteController extends Controller
{
    public function store(Request $request)
    {
        // Validación de entrada
        $validated = $request->validate([
            //'codigo' => 'required|numeric|unique:comprobante,codigo',
            'codigo' => 'required|numeric',
            'id_orden_pago' => 'required|integer|exists:orden_pago,id_orden',
            'imagen' => 'required|file|mimes:jpeg,png,jpg,bmp,webp|max:2048',
            'codigo_ocr' => 'nullable|string'
        ]);

        // Verificar si ya existe un comprobante verificado con el mismo código
        $comprobanteExistente = Comprobante::where('codigo', $validated['codigo'])
            ->where('estado', true)
            ->first();

        if ($comprobanteExistente) {
            return response()->json([
                'message' => 'Este comprobante ya fue verificado anteriormente.',
                'ruta_imagen' => $comprobanteExistente->imagen
            ], 409); // HTTP 409 Conflict
        }

        DB::beginTransaction();

        try {
            // Guardar imagen en disco
            $imagen = $request->file('imagen');
            $filename = 'comprobante_' . time() . '.' . $imagen->getClientOriginalExtension();
            //$path = $imagen->storeAs('public/comprobantes', $filename);
            $path = $imagen->storeAs('comprobantes', $filename); // sin "public/"
            //$rutaPublica = Storage::url($path); // Genera: /storage/comprobantes/...
            $rutaPublica = '../../comprobantes/' . $filename;

            // Crear el comprobante con estado = false
            $comprobante = Comprobante::create([
                'codigo' => $validated['codigo'],
                'id_orden_pago' => $validated['id_orden_pago'],
                'imagen' => $rutaPublica,
                'estado' => false
            ]);

            // Validar coincidencia con OCR
            if (
                !empty($validated['codigo_ocr']) &&
                str_contains($validated['codigo_ocr'], (string) $validated['codigo'])
            ) {
                // Actualizar estado del comprobante
                $comprobante->estado = true;
                $comprobante->save();

                // Actualizar estado de orden de pago
                $orden = OrdenPago::findOrFail($validated['id_orden_pago']);
                $orden->estado = true;
                $orden->save();

                // Actualizar estado de formulario
                $formulario = Formulario::findOrFail($orden->id_formulario_formulario);
                $formulario->pagado = true;
                $formulario->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Comprobante procesado correctamente.',
                'codigo_verificado' => $comprobante->estado,
                'ruta_imagen' => $rutaPublica,
                'comprobante_id' => $comprobante->id_comprobante
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error interno al procesar el comprobante.',
                'error' => 'Excepción no controlada.'
            ], 500);
        }
    }

    public function verificarCodigo($codigo)
    {
        $comprobante = Comprobante::where('codigo', $codigo)
            ->where('estado', true)
            ->first();

        return response()->json([
            'verificado' => (bool) $comprobante,
            'ruta_imagen' => $comprobante->imagen ?? null
        ]);
    }

    // ComprobanteController.php
    public function comprobantesPendientes()
{
    $pendientes = Comprobante::where('estado', false)->get();

    foreach ($pendientes as $c) {
         Log::info("Comprobante pendiente:", $c->toArray());
        $c->imagen = asset($c->imagen); // esto convierte '/storage/...' en 'http://localhost:8000/storage/...'
    }

    return response()->json($pendientes);
}

    public function actualizarEstado($id, Request $request)
    {
        $validated = $request->validate([
            'estado' => 'required|boolean',
        ]);

        $comprobante = Comprobante::findOrFail($id);
        $comprobante->estado = $validated['estado'];
        $comprobante->save();

        // Si lo marcaron como válido, actualizar también orden y formulario
        if ($validated['estado']) {
            $orden = OrdenPago::findOrFail($comprobante->id_orden_pago);
            $orden->estado = true;
            $orden->save();

            $formulario = Formulario::findOrFail($orden->id_formulario_formulario);
            $formulario->pagado = true;
            $formulario->save();
        }

        return response()->json(['message' => 'Estado actualizado con éxito.']);
    }

}



