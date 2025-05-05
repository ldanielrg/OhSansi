<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Grado
 * 
 * @property int $id_grado
 * @property string|null $nombre_grado
 * 
 * @property Collection|CategoriaTieneGrado[] $categoria_tiene_grados
 *
 * @package App\Models
 */
class Grado extends Model
{
	protected $table = 'grado';
	protected $primaryKey = 'id_grado';
	public $incrementing = true;
	public $timestamps = false;

	protected $casts = [
		'id_grado' => 'int'
	];

	protected $fillable = [
		'nombre_grado'
	];

	public function categoriasInicio()
    {
        return $this->hasMany(Categorium::class, 'grado_ini', 'id_grado');
    }

    public function categoriasFin()
    {
        return $this->hasMany(Categorium::class, 'grado_fin', 'id_grado');
    }
	public function convocatoria()
	{
		return $this->belongsTo(Convocatoria::class, 'id_convocatoria_convocatoria');
	}

}
