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
        $area = Area::firstOrCreate(
            ['nombre_area' => 'Biología'],
            ['activo' => true]
        );

        // Crear categorías
        $cat4 = Categorium::firstOrCreate(['nombre_categoria' => 'Jaguar']);
        $cat5 = Categorium::firstOrCreate(['nombre_categoria' => 'Lagarto']);

        // Relacionar áreas y categorías (vía tabla pivote)
        AreaTieneCategorium::firstOrCreate([
            'id_area_area' => $area->id_area,
            'id_categoria_categoria' => $cat4->id_categoria,
        ]);

        AreaTieneCategorium::firstOrCreate([
            'id_area_area' => $area->id_area,
            'id_categoria_categoria' => $cat5->id_categoria,
        ]);

    }
}
