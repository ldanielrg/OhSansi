<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Convocatorium
 * 
 * @property int $id_convocatoria
 * @property string|null $nombre_convocatoria
 * @property string|null $descripcion
 * @property int|null $precio
 * @property Carbon|null $fecha_inicio
 * @property Carbon|null $fecha_final
 * 
 * @property Collection|Area[] $areas
 * @property Collection|Formulario[] $formularios
 * @property Collection|Evento[] $eventos
 *
 * @package App\Models
 */
class Convocatoria extends Model
{
	protected $table = 'convocatoria';
	protected $primaryKey = 'id_convocatoria';
	public $incrementing = true;
	public $timestamps = false;

	protected $casts = [
		'id_convocatoria' => 'int',
		'precio' => 'int',
		'fecha_inicio' => 'datetime',
		'fecha_final' => 'datetime'
	];

	protected $fillable = [
		'nombre_convocatoria',
		'descripcion',
		'fecha_inicio',
		'fecha_final',
		'activo'
	];

	public function areas()
	{
		return $this->hasMany(Area::class, 'id_convocatoria_convocatoria');
	}

	public function formularios()
	{
		return $this->hasMany(Formulario::class, 'id_convocatoria_convocatoria');
	}

	public function eventos()
	{
		return $this->hasMany(Evento::class, 'id_convocatoria_convocatoria');
	}
}
