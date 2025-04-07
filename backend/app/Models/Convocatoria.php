<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Convocatoria
 * 
 * @property int $id_convocatoria
 * @property int|null $id_cronog
 * @property string|null $nombre_convocatoria
 * @property string|null $descripcion
 * @property Carbon|null $fecha_ini
 * @property Carbon|null $fecha_fin
 * @property string|null $documento
 * @property bool|null $estado
 * 
 * @property Cronograma|null $cronograma
 * @property Collection|ConvocatoriaTieneArea[] $convocatoria_tiene_areas
 * @property Collection|Formulario[] $formularios
 *
 * @package App\Models
 */
class Convocatoria extends Model
{
	protected $table = 'convocatoria';
	protected $primaryKey = 'id_convocatoria';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_convocatoria' => 'int',
		'id_cronog' => 'int',
		'fecha_ini' => 'datetime',
		'fecha_fin' => 'datetime',
		'estado' => 'bool'
	];

	protected $fillable = [
		'descripcion',
		'id_cronog',
		'estado',
		'nombre_convocatoria'
	];

	public function cronograma()
	{
		return $this->belongsTo(Cronograma::class, 'id_cronog');
	}

	public function convocatoria_tiene_areas()
	{
		return $this->hasMany(ConvocatoriaTieneArea::class, 'id_convocatoria');
	}

	public function formularios()
	{
		return $this->hasMany(Formulario::class, 'id_convocatoria');
	}
}

