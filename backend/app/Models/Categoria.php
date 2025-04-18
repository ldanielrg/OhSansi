<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Categoria
 * 
 * @property int $id_categoria
 * @property string|null $nombre_categ
 * @property string|null $descripcion
 * @property bool|null $activo
 * 
 * @property Collection|AreaTieneCategoria[] $area_tiene_categoria
 * @property Collection|CategoriaTieneGrado[] $categoria_tiene_grados
 *
 * @package App\Models
 */
class Categoria extends Model
{
	protected $table = 'categoria';
	protected $primaryKey = 'id_categoria';
	public $timestamps = false;

	protected $casts = [
		'id_categoria' => 'int',
		'activo' => 'bool'
	];

	protected $fillable = [
		'nombre_categ',
		'descripcion',
		'activo'
	];

	public function area_tiene_categoria()
	{
		return $this->hasMany(Area_tiene_categoria::class, 'id_categoria');
	}

	public function categoria_tiene_grados()
	{
		return $this->hasMany(Categoria_Tiene_Grado::class, 'id_categoria');
	}
}

