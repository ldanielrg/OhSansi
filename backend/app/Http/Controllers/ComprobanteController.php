<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comprobante;
use App\Models\OrdenPago;
use App\Models\Formulario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ComprobanteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|numeric|unique:comprobante,codigo',
            'id_orden_pago' => 'required|integer|exists:orden_pago,id_orden',
            'imagen' => 'required|file|mimes:jpeg,png,jpg,bmp,webp|max:2048',
            'codigo_ocr' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // 1. Subir imagen al disco
            $ruta = $request->file('imagen')->store('comprobantes', 'public');

            // 2. Determinar si el código es válido (coincide con OCR)
            $codigoManual = $validated['codigo'];
            $codigoOCR = $request->input('codigo_ocr');

            $coincide = $codigoOCR && trim($codigoOCR) === trim($codigoManual);
            $estadoPago = $coincide ? true : false;

            // 3. Crear comprobante
            $comprobante = Comprobante::create([
                'codigo' => $codigoManual,
                'id_orden_pago' => $validated['id_orden_pago'],
                'estado' => $estadoPago,
                'imagen' => $ruta,
            ]);

            // 4. Si coincide el código, actualizar estado de orden_pago y formulario
            if ($estadoPago) {
                $orden = OrdenPago::with('formulario')->find($validated['id_orden_pago']);
                $orden->estado = true;
                $orden->save();

                $formulario = Formulario::find($orden->id_formulario_formulario);
                if ($formulario) {
                    $formulario->pagado = true;
                    $formulario->save();
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Comprobante procesado correctamente.',
                'estado_verificado' => $estadoPago,
                'ruta_imagen' => $ruta
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al procesar el comprobante.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
