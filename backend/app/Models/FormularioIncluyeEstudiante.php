<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class FormularioIncluyeEstudiante
 * 
 * @property int $id_estudiante
 * @property int $id_formulario
 * 
 * @property Estudiante $estudiante
 * @property Formulario $formulario
 *
 * @package App\Models
 */
class FormularioIncluyeEstudiante extends Model
{
	protected $table = 'formulario_incluye_estudiante';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_estudiante' => 'int',
		'id_formulario' => 'int'
	];

	public function estudiante()
	{
		return $this->belongsTo(Estudiante::class, 'id_estudiante');
	}

	public function formulario()
	{
		return $this->belongsTo(Formulario::class, 'id_formulario');
	}
}
