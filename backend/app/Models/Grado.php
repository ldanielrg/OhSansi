<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Grado
 * 
 * @property int $id_grado
 * @property string|null $nombre_grado
 * 
 * @property Collection|CategoriaTieneGrado[] $categoria_tiene_grados
 *
 * @package App\Models
 */
class Grado extends Model
{
	protected $table = 'grado';
	protected $primaryKey = 'id_grado';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_grado' => 'int'
	];

	protected $fillable = [
		'nombre_grado'
	];

	public function categoria_tiene_grados()
	{
		return $this->hasMany(CategoriaTieneGrado::class, 'id_grado_grado');
	}
}
