<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Municipio extends Model
{
    protected $table = 'municipio';
    protected $primaryKey = 'id_municipio';
    public $timestamps = false;

    protected $fillable = ['nombre_municipio', 'id_depart'];

    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'id_depart', 'id_depart');
    }
}
