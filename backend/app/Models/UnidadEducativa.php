<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnidadEducativa extends Model
{
    protected $table = 'unidad_educativa';
    protected $primaryKey = 'id_ue';
    public $timestamps = false;

    protected $fillable = [
        'nombre_ue',
        'rue_ue',
        'id_depart',
        'id_municipio'
    ];

    // RELACION CON DEPARTAMENTO
    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'id_depart', 'id_depart');
    }

    // RELACION CON MUNICIPIO
    public function municipio()
    {
        return $this->belongsTo(Municipio::class, 'id_municipio', 'id_municipio');
    }
}
