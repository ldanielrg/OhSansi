<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\Departamento;
use App\Models\Municipio;

class DepartamentoSeeder extends Seeder
{
    public function run(): void
    {
        // Crear departamentos
        $dep1 = Departamento::updateOrCreate(['nombre_departamento' => 'Cochabamba']);
        $dep2 = Departamento::updateOrCreate(['nombre_departamento' => 'Santa Cruz']);
        $dep3 = Departamento::updateOrCreate(['nombre_departamento' => 'Beni']);
        $dep4 = Departamento::updateOrCreate(['nombre_departamento' => 'Chuquisaca']);
        $dep5 = Departamento::updateOrCreate(['nombre_departamento' => 'Tarija']);
        $dep6 = Departamento::updateOrCreate(['nombre_departamento' => 'Pando']);
        $dep7 = Departamento::updateOrCreate(['nombre_departamento' => 'La Paz']);
        $dep8 = Departamento::updateOrCreate(['nombre_departamento' => 'Oruro']);
        $dep9 = Departamento::updateOrCreate(['nombre_departamento' => 'Potosi']);

        // Relacionar los municipio a cochabamba (sólo cocha por ahora)
        Municipio::updateOrCreate([
            'nombre_municipio' => 'Quillacollo',
            'id_departamento_departamento' => $dep1->id_departamento,
        ]);
        Municipio::updateOrCreate([
            'nombre_municipio' => 'Sacaba',
            'id_departamento_departamento' => $dep1->id_departamento,
        ]);
        Municipio::updateOrCreate([
            'nombre_municipio' => 'Tiquipaya',
            'id_departamento_departamento' => $dep1->id_departamento,
        ]);
        Municipio::updateOrCreate([
            'nombre_municipio' => 'Colcapirhua',
            'id_departamento_departamento' => $dep1->id_departamento,
        ]);
        Municipio::updateOrCreate([
            'nombre_municipio' => 'Vinto',
            'id_departamento_departamento' => $dep1->id_departamento,
        ]);
        Municipio::updateOrCreate([
            'nombre_municipio' => 'Sipe Sipe,',
            'id_departamento_departamento' => $dep1->id_departamento,
        ]);

    }
}
