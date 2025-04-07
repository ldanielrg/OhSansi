<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ConvocatoriaTieneArea
 * 
 * @property int $id_area
 * @property int $id_convocatoria
 * 
 * @property Area $area
 * @property Convocatoria $convocatoria
 *
 * @package App\Models
 */
class Convocatoria_tiene_areas extends Model
{
	protected $table = 'convocatoria_tiene_areas';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_area' => 'int',
		'id_convocatoria' => 'int'
	];

	public function area()
	{
		return $this->belongsTo(Area::class, 'id_area');
	}

	public function convocatoria()
	{
		return $this->belongsTo(Convocatoria::class, 'id_convocatoria');
	}
}
