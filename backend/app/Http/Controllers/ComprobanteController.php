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
    public function store123(Request $request)
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
            ->whereRaw('"estado" = true')
            ->first();

        if ($comprobanteExistente) {
            return response()->json([
                'message' => 'Este comprobante ya fue verificado anteriormente.',
                'ruta_imagen' => $comprobanteExistente->imagen
            ], 409); // HTTP 409 Conflict
        }

        DB::beginTransaction();

        try {
            // Guardar imagen en carpeta public/comprobantes
            $imagen = $request->file('imagen');
            $filename = 'comprobante_' . time() . '.' . $imagen->getClientOriginalExtension();
            Log::debug($filename);
            $destinationPath = public_path('comprobantes');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            Log::debug($destinationPath);
            $imagen->move($destinationPath, $filename);

            $rutaPublica = '/comprobantes/' . $filename;

            // Crear el comprobante con estado = false
            $comprobante = Comprobante::create([
                'codigo' => $validated['codigo'],
                'id_orden_pago' => $validated['id_orden_pago'],
                'imagen' => $rutaPublica,
                'estado' => 'false'
            ]);

            // Validar coincidencia con OCR
            if (
                !empty($validated['codigo_ocr']) &&
                str_contains($validated['codigo_ocr'], (string) $validated['codigo'])
            ) {
                // Actualizar estado del comprobante
                $comprobante->estado = 'true';
                $comprobante->save();

                // Actualizar estado de orden de pago
                $orden = OrdenPago::findOrFail($validated['id_orden_pago']);
                $orden->estado = 'true';
                $orden->save();

                // Actualizar estado de formulario
                $formulario = Formulario::findOrFail($orden->id_formulario_formulario);
                $formulario->pagado = 'true';
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
            Log::error("Error al guardar comprobante: " . $e->getMessage());
            return response()->json([
                'message' => 'Error interno al procesar el comprobante.',
                'error' => 'Excepción no controlada.'
            ], 500);
        }
    }

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

        // Buscar comprobante existente para esta orden de pago
        $comprobanteExistente = Comprobante::where('id_orden_pago', $validated['id_orden_pago'])->first();

        if ($comprobanteExistente) {
            if ($comprobanteExistente->estado === true) {
                return response()->json([
                    'message' => 'El comprobante para esta orden ya fue verificado exitosamente.',
                    'ruta_imagen' => $comprobanteExistente->imagen
                ], 409);
            } else {
                return response()->json([
                    'message' => 'El comprobante para esta orden está pendiente de revisión administrativa.',
                    'ruta_imagen' => $comprobanteExistente->imagen
                ], 409);
            }
        }

        DB::beginTransaction();

        try {
            // Guardar imagen en carpeta public/comprobantes
            $imagen = $request->file('imagen');
            $filename = 'comprobante_' . time() . '.' . $imagen->getClientOriginalExtension();
            Log::debug($filename);
            $path = $imagen->storeAs('comprobantes', $filename, 'public');  // Guarda en storage/app/public/comprobantes
            $rutaPublica = '/storage/' . $path;
            // Crear el comprobante
            $comprobante = Comprobante::create([
                'codigo' => $validated['codigo'],
                'id_orden_pago' => $validated['id_orden_pago'],
                'imagen' => $rutaPublica,
                'estado' => '0',]);
            Log::debug($comprobante);
            // Validar coincidencia con OCR
            if (
                !empty($validated['codigo_ocr']) &&
                str_contains($validated['codigo_ocr'], (string) $validated['codigo'])
            ) {
                // Actualizar estado del comprobante
                $comprobante->update(['estado' => '1']);
                $comprobante->save();

                // Actualizar estado de orden de pago
                $orden = OrdenPago::findOrFail($validated['id_orden_pago']);
                $orden->update(['estado' => '1']);
                $orden->save();

                // Actualizar estado de formulario
                $formulario = Formulario::findOrFail($orden->id_formulario_formulario);
                $formulario->update(['pagado' => '1']);
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
            Log::error("Error al guardar comprobante: " . $e->getMessage());
            return response()->json([
                'message' => 'Error interno al procesar el comprobante.',
                'error' => $e->getMessage(),  // Muestra el error real
            ], 500);
        }
    }


    public function verificarCodigo($codigo)
    {
        $comprobante = Comprobante::where('codigo', $codigo)
            ->whereRaw('"estado" = true')
            ->first();

        return response()->json([
            'verificado' => (bool) $comprobante,
            'ruta_imagen' => $comprobante->imagen ?? null
        ]);
    }

    // ComprobanteController.php
    public function comprobantesPendientes()
    {
        $pendientes = Comprobante::whereRaw('"estado" = false')->get();

        foreach ($pendientes as $c) {
            Log::info("Comprobante pendiente:", $c->toArray());
            // Convierte '/comprobantes/nombre.jpg' a 'http://tu-dominio.com/comprobantes/nombre.jpg'
            $c->imagen = asset($c->imagen);
        }

        return response()->json($pendientes);
    }


    public function actualizarEstado($id, Request $request)
    {
        $validated = $request->validate([
            'estado' => 'required|boolean',
        ]);

        $comprobante = Comprobante::findOrFail($id);
        $aux = $validated['estado'];
        if ($aux == 1) {
            $comprobante->update(['estado' => '1']);
            $comprobante->save();
        } else {
            $comprobante->update(['estado' => '0']);
            $comprobante->save();
        }

        // Si lo marcaron como válido, actualizar también orden y formulario
        if ($validated['estado']) {
            $orden = OrdenPago::findOrFail($comprobante->id_orden_pago);
            $orden->estado = 'true';
            $orden->save();

            $formulario = Formulario::findOrFail($orden->id_formulario_formulario);
            $formulario->pagado = 'true';
            $formulario->save();
        }

        return response()->json(['message' => 'Estado actualizado con éxito.']);
    }

}



