<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class UnidadEducativa
 * 
 * @property int $rue
 * @property string|null $nombre_ue
 * @property int $id_municipio_municipio
 * @property int $id_departamento_departamento_municipio
 * 
 * @property Municipio $municipio
 * @property Collection|Formulario[] $formularios
 *
 * @package App\Models
 */
class UnidadEducativa extends Model
{
	protected $table = 'unidad_educativa';
	protected $primaryKey = 'id_ue';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_municipio' => 'int',
		'id_departamento' => 'int'
	];

	protected $fillable = [
		'nombre_ue',
		'rue',
		'id_municipio',
		'id_departamento'
	];

	public function municipio()
	{
		return $this->belongsTo(Municipio::class, 'id_municipio_municipio')
					->where('municipio.id_municipio', '=', 'unidad_educativa.id_municipio')
					->where('municipio.id_departamento', '=', 'unidad_educativa.id_departamento');
	}

	public function formularios()
	{
		return $this->hasMany(Formulario::class, 'rue_unidad_educativa');
	}
}
