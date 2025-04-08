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
            'name' => 'Antonio Banderas',
            'username' => 'Antonio2025',
            'email' => 'Antonio@gmail.com',
            'phone' => '+59172707548',
            'password' => Hash::make('antoniopass')
        ]);
    }
}