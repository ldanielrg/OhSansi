<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        
        //Al crear nuevos eliminar los que ya existen ya esta registrados !!!!!!

        User::create([
            'name' => 'Luis',
            'username' => 'luis2025',
            'email' => 'luis@gmail.com',
            'phone' => '+59171234567',
            'password' => Hash::make('luispass')
        ]);
    
        User::create([
            'name' => 'Oscar Ordoñez',
            'username' => 'Oscar',
            'email' => 'Oscar@gmail.com',
            'phone' => '+59176543210',
            'password' => Hash::make('Oscarpass')
        ]);
        User::create([
            'name' => 'Correo Prueba',
            'username' => 'correo2025',
            'email' => 'tu@correo.com',
            'phone' => '+59171234583',
            'password' => Hash::make('Correopass')
        ]);
    }
}
