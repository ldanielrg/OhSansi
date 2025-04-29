<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use App\Models\Convocatoria; // ✅ Asegura importar el modelo correcto

/**
 * Class Evento
 * 
 * @property int $id_evento
 * @property string|null $nombre_evento
 * @property Carbon|null $fecha_inicio
 * @property Carbon|null $fecha_final
 * @property int $id_convocatoria_convocatoria
 * 
 * @property Convocatoria $convocatoria
 *
 * @package App\Models
 */
class Evento extends Model
{
    protected $table = 'evento';

    protected $primaryKey = 'id_evento'; // ✅ Laravel necesita un PK definido para trabajar correctamente

    public $incrementing = true; // ✅ Porque id_evento sí es autoincremental
    public $timestamps = false;  // ✅ Tu tabla no maneja created_at ni updated_at

    protected $casts = [
        'id_evento' => 'int',
        'fecha_inicio' => 'date',
        'fecha_final' => 'date',
        'id_convocatoria_convocatoria' => 'int'
    ];

    protected $fillable = [
        'nombre_evento',
        'fecha_inicio',
        'fecha_final',
        'id_convocatoria_convocatoria'
    ];

    public function convocatoria()
    {
        return $this->belongsTo(Convocatoria::class, 'id_convocatoria_convocatoria');
    }
}
