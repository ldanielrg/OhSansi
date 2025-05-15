<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class EstudianteEstaInscrito
 * 
 * @property int $id_estudiante_estudiante
 * @property int $id_formulario_formulario
 * @property int|null $id_area_area
 * @property int|null $id_categ
 * 
 * @property Estudiante $estudiante
 * @property Formulario $formulario
 * @property Area|null $area
 * @property Categorium|null $categorium
 *
 * @package App\Models
 */
class EstudianteEstaInscrito extends Model
{
	protected $table = 'estudiante_esta_inscrito';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_estudiante_estudiante' => 'int',
		'id_formulario_formulario' => 'int',
		'team', 'int',
	];

	protected $fillable = [
		'id_estudiante_estudiante',
		'id_inscrito_en',
		'id_formulario_formulario',
		'team',
	];

	public function estudiante()
	{
		return $this->belongsTo(Estudiante::class, 'id_estudiante_estudiante');
	}

	public function formulario()
	{
		return $this->belongsTo(Formulario::class, 'id_formulario_formulario');
	}

	public function inscrito()
	{
		return $this->belongsTo(AreaTieneCategorium::class, 'id_inscrito_en', 'id');
	}
}
