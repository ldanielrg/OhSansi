<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        
        // Lista de permisos que quieres agregar
        $permisos = [
            'inscribir',
            'crear_evento',
            'crear_convocatoria',
            'crear_ue',
            'crear_cuentas',
            'crear_doc',
            'crear_aux',
        ];

        // Crear permisos y asignarlos al rol admin
        $rol1 = Role::where('name', 'Admin')->first();

        foreach ($permisos as $permisoNombre) {
            $permiso = Permission::firstOrCreate(['name' => $permisoNombre]);
            if (!$rol1->hasPermissionTo($permiso)) {
                $rol1->givePermissionTo($permiso);
            }
        }


        $rol2 = Role::where('name', 'Director')->first();
        $permiso2 = Permission::where('name', 'crear_doc')->first();
        if (!$rol2->hasPermissionTo($permiso2)) {
            $rol2->givePermissionTo($permiso2);
        }

        
    }
}