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
}
