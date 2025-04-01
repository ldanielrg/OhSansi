<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departamento extends Model
{
    protected $table = 'departamento';
    protected $primaryKey = 'id_depart';
    public $timestamps = false;

    protected $fillable = ['nombre_depart'];

    public function municipios()
    {
        return $this->hasMany(Municipio::class, 'id_depart', 'id_depart');
    }
}
