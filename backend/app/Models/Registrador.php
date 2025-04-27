<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Registrador
 * 
 * @property int $id_registrador
 * @property string|null $nombre
 * @property string|null $apellido
 * @property string|null $email
 * @property string|null $ci
 * 
 * @property Collection|Formulario[] $formularios
 *
 * @package App\Models
 */
class Registrador extends Model
{
	protected $table = 'registrador';
	protected $primaryKey = 'id_registrador';
	public $timestamps = false;

	protected $casts = [
		'id_registrador' => 'int'
	];

	protected $fillable = [
		'nombre',
		'apellido',
		'email',
		'ci'
	];

	public function formularios()
	{
		return $this->hasMany(Formulario::class, 'id_registrador_registrador');
	}
}
