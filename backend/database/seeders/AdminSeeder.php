<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run()
    {
        // Crear el rol (si no existe)
        $rol = Role::firstOrCreate(['name' => 'admin']);

        // Crear el usuario
        $usuario = User::firstOrCreate(
            ['email' => 'admin@ejemplo.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password123')
            ]
        );

        // Asignar el rol al usuario
        $usuario->assignRole($rol);
    }
}