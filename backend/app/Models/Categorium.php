<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Categorium
 * 
 * @property int $id_categoria
 * @property string|null $nombre_categoria
 * @property string|null $descripcion
 * @property bool|null $activo
 * 
 * @property Collection|CategoriaTieneGrado[] $categoria_tiene_grados
 * @property Collection|AreaTieneCategorium[] $area_tiene_categoria
 * @property Collection|EstudianteEstaInscrito[] $estudiante_esta_inscritos
 *
 * @package App\Models
 */
class Categorium extends Model
{
	protected $table = 'categoria';
	protected $primaryKey = 'id_categoria';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_categoria' => 'int',
		'activo' => 'bool'
	];

	protected $fillable = [
		'nombre_categoria',
		'descripcion',
		'activo'
	];

	public function categoria_tiene_grados()
	{
		return $this->hasMany(CategoriaTieneGrado::class, 'id_categoria_categoria');
	}

	public function area_tiene_categoria()
	{
		return $this->hasMany(AreaTieneCategorium::class, 'id_categoria_categoria');
	}

	public function estudiante_esta_inscritos()
	{
		return $this->hasMany(EstudianteEstaInscrito::class, 'id_categ');
	}
}
