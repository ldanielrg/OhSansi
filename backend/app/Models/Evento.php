<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Evento
 * 
 * @property int $id_evento
 * @property string|null $nombre_evento
 * @property Carbon|null $fecha_inicio
 * @property Carbon|null $fecha_final
 * @property int $id_convocatoria_convocatoria
 * 
 * @property Convocatorium $convocatorium
 *
 * @package App\Models
 */
class Evento extends Model
{
	protected $table = 'evento';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_evento' => 'int',
		'fecha_inicio' => 'datetime',
		'fecha_final' => 'datetime',
		'id_convocatoria_convocatoria' => 'int'
	];

	protected $fillable = [
		'nombre_evento',
		'fecha_inicio',
		'fecha_final',
		'id_convocatoria_convocatoria' // AGREGUE YO
	];

	public function convocatorium()
	{
		return $this->belongsTo(Convocatorium::class, 'id_convocatoria_convocatoria');
	}
}
