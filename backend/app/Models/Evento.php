<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Evento
 * 
 * @property int $id_evento
 * @property int|null $id_cronog
 * @property string|null $nombre_evento
 * @property string|null $nombre_convocatoria
 * 
 * @property Cronograma|null $cronograma
 *
 * @package App\Models
 */
class Evento extends Model
{
	protected $table = 'evento';
	protected $primaryKey = 'id_evento';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_evento' => 'int',
		'id_cronog' => 'int'
	];

	protected $fillable = [
		'id_cronog',
		'nombre_evento',
		'nombre_convocatoria'
	];

	public function cronograma()
	{
		return $this->belongsTo(Cronograma::class, 'id_cronog');
	}
}
