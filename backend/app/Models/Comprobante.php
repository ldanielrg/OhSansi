<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Comprobante
 * 
 * @property int $id_comprobante
 * @property bytea|null $imagen
 * @property int|null $id_orden_orden_pago
 * @property int|null $id_formulario_formulario_orden_pago
 * 
 * @property OrdenPago|null $orden_pago
 *
 * @package App\Models
 */
class Comprobante extends Model
{
	protected $table = 'comprobante';
	protected $primaryKey = 'id_comprobante';
	public $incrementing = true;
	public $timestamps = false;

	protected $casts = [
		'id_comprobante' => 'int',
		'imagen' => 'string',
		'codigo' => 'string',
		'id_orden_pago' => 'int',
		
	];

	protected $fillable = [
		'id_comprobante',
		'codigo',
		'imagen',
		'id_orden_pago'
	];

	public function orden_pago()
	{
		return $this->belongsTo(OrdenPago::class, 'id_orden_orden_pago')
					->where('orden_pago.id_orden', '=', 'comprobante.id_orden_orden_pago')
					->where('orden_pago.id_formulario_formulario', '=', 'comprobante.id_orden_orden_pago')
					->where('orden_pago.id_orden', '=', 'comprobante.id_formulario_formulario_orden_pago')
					->where('orden_pago.id_formulario_formulario', '=', 'comprobante.id_formulario_formulario_orden_pago');
	}
}
