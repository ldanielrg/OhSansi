<?php

/**
 * Created by Reliese Model.
 */

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
 *
 * @package App\Models
 */
class OrdenPago extends Model
{
	protected $table = 'orden_pago';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_orden' => 'int',
		'fecha_emision' => 'datetime',
		'fecha_vencimiento' => 'datetime',
		'monto_total' => 'int',
		'estado' => 'bool',
		'id_formulario_formulario' => 'int'
	];

	protected $fillable = [
		'fecha_emision',
		'fecha_vencimiento',
		'monto_total',
		'estado'
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
