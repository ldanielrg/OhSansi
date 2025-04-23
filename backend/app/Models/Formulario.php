<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Formulario
 * 
 * @property int $id_formulario
 * @property int $id_registrador_registrador
 * @property int $rue_unidad_educativa
 * @property int $id_municipio_municipio_unidad_educativa
 * @property int $id_departamento_departamento_municipio_unidad_educativa
 * @property int $id_convocatoria_convocatoria
 * 
 * @property Registrador $registrador
 * @property UnidadEducativa $unidad_educativa
 * @property Convocatorium $convocatorium
 * @property Collection|OrdenPago[] $orden_pagos
 * @property Collection|EstudianteEstaInscrito[] $estudiante_esta_inscritos
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
		'id_registrador_registrador' => 'int',
		'rue_unidad_educativa' => 'int',
		'id_municipio_municipio_unidad_educativa' => 'int',
		'id_departamento_departamento_municipio_unidad_educativa' => 'int',
		'id_convocatoria_convocatoria' => 'int'
	];

	protected $fillable = [
		'id_registrador_registrador',
		'rue_unidad_educativa',
		'id_municipio_municipio_unidad_educativa',
		'id_departamento_departamento_municipio_unidad_educativa',
		'id_convocatoria_convocatoria'
	];

	public function registrador()
	{
		return $this->belongsTo(Registrador::class, 'id_registrador_registrador');
	}

	public function unidad_educativa()
	{
		return $this->belongsTo(UnidadEducativa::class, 'rue_unidad_educativa')
					->where('unidad_educativa.rue', '=', 'formulario.rue_unidad_educativa')
					->where('unidad_educativa.id_municipio_municipio', '=', 'formulario.rue_unidad_educativa')
					->where('unidad_educativa.id_departamento_departamento_municipio', '=', 'formulario.rue_unidad_educativa')
					->where('unidad_educativa.rue', '=', 'formulario.id_municipio_municipio_unidad_educativa')
					->where('unidad_educativa.id_municipio_municipio', '=', 'formulario.id_municipio_municipio_unidad_educativa')
					->where('unidad_educativa.id_departamento_departamento_municipio', '=', 'formulario.id_municipio_municipio_unidad_educativa')
					->where('unidad_educativa.rue', '=', 'formulario.id_departamento_departamento_municipio_unidad_educativa')
					->where('unidad_educativa.id_municipio_municipio', '=', 'formulario.id_departamento_departamento_municipio_unidad_educativa')
					->where('unidad_educativa.id_departamento_departamento_municipio', '=', 'formulario.id_departamento_departamento_municipio_unidad_educativa');
	}

	public function convocatorium()
	{
		return $this->belongsTo(Convocatorium::class, 'id_convocatoria_convocatoria');
	}

	public function orden_pagos()
	{
		return $this->hasMany(OrdenPago::class, 'id_formulario_formulario');
	}

	public function estudiante_esta_inscritos()
	{
		return $this->hasMany(EstudianteEstaInscrito::class, 'id_formulario_formulario');
	}
}
