<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //$role1 = Role::create(['name' => 'Admin']);
        $role2 = Role::create(['name' => 'Director']);
        $role3 = Role::create(['name' => 'Docente']);
        $role4 = Role::create(['name' => 'Tutor']);
        $role5 = Role::create(['name' => 'Adm. Inscripcion']);
        $role6 = Role::create(['name' => 'Caja']);
        $role7 = Role::create(['name' => 'Organizador']);
        $role8 = Role::create(['name' => 'Aux']);
    }
}
