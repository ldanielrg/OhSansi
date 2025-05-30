<?php
namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class CuentasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $role1 = Role::where('name', 'Admin')->first();
        $usuario = User::firstOrCreate(
            ['email' => 'admin@ejemplo.com'],
            [
                'name' => 'Daniel',
                'password' => Hash::make('contra123'),
                'username' => 'Admin1'
            ]
        );
        $usuario->assignRole($role1);
    
        $role2 = Role::where('name', 'Director')->first();
        $usuario2 = User::firstOrCreate(
            ['email' => 'director@ejemplo.com'],
            [
                'name' => 'Daniel',
                'password' => Hash::make('contra123'),
                'username' => 'Director1'
            ]
        );
        $usuario2->assignRole($role2);

        $role3 = Role::where('name', 'Adm. Inscripcion')->first();
        $usuario3 = User::firstOrCreate(
            ['email' => 'inscripcion@ejemplo.com'],
            [
                'name' => 'Daniel',
                'password' => Hash::make('contra123'),
                'username' => 'Inscrip1'
            ]
        );
        $usuario3->assignRole($role3);

        $role4 = Role::where('name', 'Caja')->first();
        $usuario4 = User::firstOrCreate(
            ['email' => 'caja@ejemplo.com'],
            [
                'name' => 'Daniel',
                'password' => Hash::make('contra123'),
                'username' => 'Caja1'
            ]
        );
        $usuario4->assignRole($role4);

        $role5 = Role::where('name', 'Organizador')->first();
        $usuario5 = User::firstOrCreate(
            ['email' => 'organizador@ejemplo.com'],
            [
                'name' => 'Daniel',
                'password' => Hash::make('contra123'),
                'username' => 'Organizador1'
            ]
        );
        $usuario5->assignRole($role5);
    }
}
