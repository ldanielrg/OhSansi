<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Estudiante
 * 
 * @property int $id_estudiante
 * @property string|null $nombre
 * @property string|null $apellido
 * @property string|null $email
 * @property string|null $ci
 * @property Carbon|null $fecha_nacimiento
 * @property string|null $rude
 * 
 * @property Collection|EstudianteEstaInscrito[] $estudiante_esta_inscritos
 *
 * @package App\Models
 */
class Estudiante extends Model
{
	protected $table = 'estudiante';
	protected $primaryKey = 'id_estudiante';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_estudiante' => 'int',
		'fecha_nacimiento' => 'datetime'
	];

	protected $fillable = [
		'nombre',
		'apellido',
		'email',
		'ci',
		'fecha_nacimiento',
		'rude'
	];

	public function estudiante_esta_inscritos()
	{
		return $this->hasMany(EstudianteEstaInscrito::class, 'id_estudiante_estudiante');
	}
}
