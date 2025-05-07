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
	public $timestamps = false;

	protected $casts = [
		'id_formulario' => 'int',
		'id_registrador_registrador' => 'int',
		'id_ue_ue' => 'int',
		'id_convocatoria_convocatoria' => 'int',
		'id_usuario' => 'int'
	];

	protected $fillable = [
		'id_registrador_registrador',
		'id_ue_ue',
		'id_convocatoria_convocatoria',
		'id_usuario',
	];

	public function registrador()
	{
		return $this->belongsTo(Registrador::class, 'id_registrador_registrador');
	}
	public function usuario()
	{
		return $this->belongsTo(User::class, 'id_usuario');
	}

	public function unidad_educativa()
	{
		return $this->belongsTo(UnidadEducativa::class, 'id_ue_ue');
	}

	public function convocatorium()
	{
		return $this->belongsTo(Convocatoria::class, 'id_convocatoria_convocatoria');
	}

	public function orden_pagos()
	{
		return $this->hasMany(OrdenPago::class, 'id_formulario_formulario');
	}

	public function inscripciones()
	{
		return $this->hasMany(EstudianteEstaInscrito::class, 'id_formulario_formulario', 'id_formulario');
	}

}
