<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class AreaTieneCategoria
 * 
 * @property int $id_categoria
 * @property int $id_area
 * 
 * @property Categorium $categorium
 * @property Area $area
 *
 * @package App\Models
 */
class AreaTieneCategoria extends Model
{
	protected $table = 'area_tiene_categoria';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_categoria' => 'int',
		'id_area' => 'int'
	];

	public function categoria()
	{
		return $this->belongsTo(Categoria::class, 'id_categoria');
	}

	public function area()
	{
		return $this->belongsTo(Area::class, 'id_area');
	}
}
