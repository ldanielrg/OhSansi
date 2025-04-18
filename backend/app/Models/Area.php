<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Area
 * 
 * @property int $id_area
 * @property string|null $nombre_area
 * @property bool|null $activo
 * 
 * @property Collection|AreaTieneCategorium[] $area_tiene_categoria
 * @property Collection|ConvocatoriaTieneArea[] $convocatoria_tiene_areas
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
		'activo' => 'bool'
	];

	protected $fillable = [
		'nombre_area',
		'activo'
	];

	public function area_tiene_categoria()
	{
		return $this->hasMany(Area_tiene_categoria::class, 'id_area');
	}

	public function convocatoria_tiene_areas()
	{
		return $this->hasMany(Convocatoria_tiene_areas::class, 'id_area');
	}
}
