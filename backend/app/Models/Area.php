<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Area
 * 
 * @property int $id_area
 * @property string|null $nombre_area
 * @property bool|null $activo
 * @property int|null $id_convocatoria_convocatoria
 * 
 * @property Convocatorium|null $convocatorium
 * @property Collection|AreaTieneCategorium[] $area_tiene_categoria
 * @property Collection|EstudianteEstaInscrito[] $estudiante_esta_inscritos
 *
 * @package App\Models
 */
class Area extends Model
{
	protected $table = 'area';
	protected $primaryKey = 'id_area';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_area' => 'int',
		'activo' => 'bool',
		'id_convocatoria_convocatoria' => 'int'
	];

	protected $fillable = [
		'nombre_area',
		'activo',
		'id_convocatoria_convocatoria'
	];

	public function convocatorium()
	{
		return $this->belongsTo(Convocatorium::class, 'id_convocatoria_convocatoria');
	}

	public function area_tiene_categoria()
	{
		return $this->hasMany(AreaTieneCategorium::class, 'id_area_area');
	}

	public function estudiante_esta_inscritos()
	{
		return $this->hasMany(EstudianteEstaInscrito::class, 'id_area_area');
	}
}
