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
	public $incrementing = true;
	public $timestamps = false;

	protected $casts = [
		'id_categoria' => 'int',
		'activo' => 'bool'
	];

	protected $fillable = [
		'nombre_categoria',
		'descripcion',
		'activo',
		'grado_ini',
		'grado_fin',
		'id_convocatoria_convocatoria'
	];

	public function area_tiene_categoria()
	{
		return $this->hasMany(AreaTieneCategorium::class, 'id_categoria_categoria');
	}

	public function estudiante_esta_inscritos()
	{
		return $this->hasMany(EstudianteEstaInscrito::class, 'id_categ');
	}

	public function gradoInicial()
	{
		return $this->belongsTo(Grado::class, 'grado_ini', 'id_grado');
	}

	public function gradoFinal()
	{
		return $this->belongsTo(Grado::class, 'grado_fin', 'id_grado');
	}
	public function convocatoria()
	{
		return $this->belongsTo(Convocatoria::class, 'id_convocatoria_convocatoria');
	}
	
}
