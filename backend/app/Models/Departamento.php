<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Departamento
 * 
 * @property int $id_departamento
 * @property string|null $nombre_departamento
 * 
 * @property Collection|Municipio[] $municipios
 *
 * @package App\Models
 */
class Departamento extends Model
{
	protected $table = 'departamento';
	protected $primaryKey = 'id_departamento';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_departamento' => 'int'
	];

	protected $fillable = [
		'nombre_departamento'
	];

	public function municipios()
	{
		return $this->hasMany(Municipio::class, 'id_departamento_departamento');
	}
}
