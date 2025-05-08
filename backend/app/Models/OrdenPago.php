<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class OrdenPago
 * 
 * @property int $id_orden
 * @property Carbon|null $fecha_emision
 * @property Carbon|null $fecha_vencimiento
 * @property int|null $monto_total
 * @property bool|null $estado
 * @property int $id_formulario_formulario
 * 
 * @property Formulario $formulario
 * @property Collection|Comprobante[] $comprobantes
 */
class OrdenPago extends Model
{
	protected $table = 'orden_pago';
	protected $primaryKey = 'id_orden';
	public $incrementing = true; // tu campo id_orden es AUTOINCREMENTAL
	public $timestamps = false;

	protected $casts = [
		'fecha_emision' => 'datetime',
		'fecha_vencimiento' => 'datetime',
		'monto_total' => 'int',
		'estado' => 'bool',
		'id_formulario_formulario' => 'int',
	];

	protected $fillable = [
		'fecha_emision',
		'fecha_vencimiento',
		'monto_total',
		'estado',
		'id_formulario_formulario', // ✅ este es requerido para la creación
	];

	public function formulario()
	{
		return $this->belongsTo(Formulario::class, 'id_formulario_formulario');
	}

	public function comprobantes()
	{
		return $this->hasMany(Comprobante::class, 'id_orden_orden_pago');
	}
}

