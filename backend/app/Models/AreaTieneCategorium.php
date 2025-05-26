<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class AreaTieneCategorium
 * 
 * @property int $id_categoria_categoria
 * @property int $id_area_area
 * 
 * @property Categorium $categorium
 * @property Area $area
 *
 * @package App\Models
 */
class AreaTieneCategorium extends Model
{
	protected $table = 'area_tiene_categoria';
	protected $primaryKey = 'id';
	public $incrementing = true;
	public $timestamps = false;

	protected $casts = [
		'id'  => 'int',
		'id_categoria_categoria' => 'int',
		'id_area_area' => 'int',
		'precio' => 'decimal:2',
        'activo' => 'bool',
        'nro_participantes' => 'integer',
	];
	
	protected $fillable = [
        'id_area_area',
        'id_categoria_categoria',
		'precio',
		'activo',
		'nro_participantes',
    ];

	public function categorium()
	{
		return $this->belongsTo(Categorium::class, 'id_categoria_categoria');
	}

	public function area()
	{
		return $this->belongsTo(Area::class, 'id_area_area');
	}
}
