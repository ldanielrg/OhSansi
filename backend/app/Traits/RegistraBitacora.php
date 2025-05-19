<?php

namespace App\Traits;

use App\Models\Bitacora;
use Illuminate\Support\Facades\Auth;

trait RegistraBitacora
{
    public function guardarBitacora($accion, $tabla, $registroId = null, $descripcion = null, $datosAntes = null, $datosDespues = null)
    {
        Bitacora::create([
            'usuario_id'       => auth('sanctum')->id(),
            'accion'           => $accion,
            'tabla_afectada'   => $tabla,
            'registro_id'      => $registroId,
            'descripcion'      => $descripcion,
            'datos_anteriores' => $datosAntes,
            'datos_nuevos'     => $datosDespues,
        ]);
    }
}
