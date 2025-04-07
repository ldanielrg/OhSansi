<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Formulario
 * 
 * @property int $id_formulario
 * @property int|null $id_ue
 * @property int|null $id_convocatoria
 * @property string|null $comprobante
 * 
 * @property UnidadEducativa|null $unidad_educativa
 * @property Convocatorium|null $convocatorium
 * @property Collection|Estudiante[] $estudiantes
 *
 * @package App\Models
 */
class Formulario extends Model
{
	protected $table = 'formulario';
	protected $primaryKey = 'id_formulario';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_formulario' => 'int',
		'id_ue' => 'int',
		'id_convocatoria' => 'int'
	];

	protected $fillable = [
		'id_ue',
		'id_convocatoria',
		'comprobante'
	];

	public function unidad_educativa()
	{
		return $this->belongsTo(UnidadEducativa::class, 'id_ue');
	}

	public function convocatorium()
	{
		return $this->belongsTo(Convocatoria::class, 'id_convocatoria');
	}

	public function estudiantes()
	{
		return $this->belongsToMany(Estudiante::class, 'formulario_incluye_estudiante', 'id_formulario', 'id_estudiante');
	}
}
