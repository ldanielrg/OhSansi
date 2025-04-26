<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Municipio
 * 
 * @property int $id_municipio
 * @property string|null $nombre_municipio
 * @property int $id_departamento_departamento
 * 
 * @property Departamento $departamento
 * @property Collection|UnidadEducativa[] $unidad_educativas
 *
 * @package App\Models
 */
class Municipio extends Model
{
	protected $table = 'municipio';
	protected $primaryKey = 'id_municipio';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_municipio' => 'int',
		'id_departamento_departamento' => 'int'
	];

	protected $fillable = [
		'nombre_municipio'
	];

	public function departamento()
	{
		return $this->belongsTo(Departamento::class, 'id_departamento_departamento', 'id_departamento');
	}

	public function unidad_educativas()
	{
		return $this->hasMany(UnidadEducativa::class, 'id_municipio');
	}
}
