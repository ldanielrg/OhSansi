<?php

use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\AreaTieneCategorium;
use App\Models\Categorium;

class AreaCategoriaSeeder extends Seeder
{
    public function run(): void
    {
        // Crear áreas
        $areaFisica = Area::updateOrCreate(
            ['nombre_area' => 'Física'],
            ['activo' => true]
        );

        // Crear categorías
        $cat4 = Categorium::updateOrCreate(['nombre_categoria' => '4S']);
        $cat5 = Categorium::updateOrCreate(['nombre_categoria' => '5S']);
        $cat6 = Categorium::updateOrCreate(['nombre_categoria' => '6S']);

        // Relacionar áreas y categorías (vía tabla pivote)
        AreaTieneCategorium::updateOrCreate([
            'id_area_area' => $areaFisica->id_area,
            'id_categoria_categoria' => $cat4->id_categoria,
        ]);

        AreaTieneCategorium::updateOrCreate([
            'id_area_area' => $areaFisica->id_area,
            'id_categoria_categoria' => $cat5->id_categoria,
        ]);

        AreaTieneCategorium::updateOrCreate([
            'id_area_area' => $areaFisica->id_area,
            'id_categoria_categoria' => $cat6->id_categoria,
        ]);

    }
}
