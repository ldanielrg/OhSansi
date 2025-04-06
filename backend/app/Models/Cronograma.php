<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Cronograma
 * 
 * @property int $id_cronog
 * @property Carbon|null $fecha
 * @property string|null $observacion
 * 
 * @property Collection|Convocatorium[] $convocatoria
 * @property Collection|Evento[] $eventos
 *
 * @package App\Models
 */
class Cronograma extends Model
{
	protected $table = 'cronograma';
	protected $primaryKey = 'id_cronog';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_cronog' => 'int',
		'fecha' => 'datetime'
	];

	protected $fillable = [
		'fecha'
	];

	public function convocatoria()
	{
		return $this->hasMany(Convocatorium::class, 'id_cronog');
	}

	public function eventos()
	{
		return $this->hasMany(Evento::class, 'id_cronog');
	}
}
