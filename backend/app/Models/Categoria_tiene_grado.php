<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CategoriaTieneGrado
 * 
 * @property int $id_grado
 * @property int $id_categoria
 * 
 * @property Grado $grado
 * @property Categoria $categoria
 *
 * @package App\Models
 */
class Categoria_tiene_grado extends Model
{
	protected $table = 'categoria_tiene_grado';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_grado' => 'int',
		'id_categoria' => 'int'
	];

	public function grado()
	{
		return $this->belongsTo(Grado::class, 'id_grado');
	}

	public function categoria()
	{
		return $this->belongsTo(Categorium::class, 'id_categoria');
	}
}

