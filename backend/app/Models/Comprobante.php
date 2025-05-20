<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comprobante extends Model
{
    protected $table = 'comprobante';
    protected $primaryKey = 'id_comprobante';
    public $timestamps = false;

    protected $casts = [
        'codigo' => 'string',
        'id_orden_pago' => 'int',
        'estado' => 'boolean',
        'imagen' => 'string'
    ];

    protected $fillable = [
        'codigo',
        'id_orden_pago',
        'estado',
        'imagen'
    ];

    public function orden_pago()
    {
        return $this->belongsTo(OrdenPago::class, 'id_orden_pago', 'id_orden');
    }
}
