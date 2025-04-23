<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Area;
use App\Models\AreaTieneCategorium;
use App\Models\Categorium;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        // Crear áreas
        $areaFisica = Area::firstOrCreate(
            ['nombre_area' => 'Física'],
            ['activo' => true]
        );

        // Crear categorías
        $cat4 = Categorium::firstOrCreate(['nombre_categoria' => '4S']);
        $cat5 = Categorium::firstOrCreate(['nombre_categoria' => '5S']);
        $cat6 = Categorium::firstOrCreate(['nombre_categoria' => '6S']);

        // Relacionar áreas y categorías (vía tabla pivote)
        AreaTieneCategorium::firstOrCreate([
            'id_area_area' => $areaFisica->id_area,
            'id_categoria_categoria' => $cat4->id_categoria,
        ]);

        AreaTieneCategorium::firstOrCreate([
            'id_area_area' => $areaFisica->id_area,
            'id_categoria_categoria' => $cat5->id_categoria,
        ]);

        AreaTieneCategorium::firstOrCreate([
            'id_area_area' => $areaFisica->id_area,
            'id_categoria_categoria' => $cat6->id_categoria,
        ]);

    }
}
