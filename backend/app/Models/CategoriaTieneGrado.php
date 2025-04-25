<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CategoriaTieneGrado
 * 
 * @property int $id_categoria_categoria
 * @property int $id_grado_grado
 * 
 * @property Categorium $categorium
 * @property Grado $grado
 *
 * @package App\Models
 */
class CategoriaTieneGrado extends Model
{
	protected $table = 'categoria_tiene_grado';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_categoria_categoria' => 'int',
		'id_grado_grado' => 'int'
	];

	public function categorium()
	{
		return $this->belongsTo(Categorium::class, 'id_categoria_categoria');
	}

	public function grado()
	{
		return $this->belongsTo(Grado::class, 'id_grado_grado');
	}
}
