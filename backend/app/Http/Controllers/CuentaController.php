<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class CuentaController extends Controller{

    
public function store(Request $request)
{
    $request->validate([
        'nombres' => 'required|string',
        'apellidos' => 'required|string',
        'correo' => 'required|email|unique:users,email',
        //'celular' => 'nullable|string',
        'password' => 'required|string|min:6',
        'rol' => 'required|string',
    ]);

    $user = User::create([
        'name' => $request->nombres . ' ' . $request->apellidos,
        'email' => $request->correo,
        'password' => bcrypt($request->password),
    ]);

    $user->assignRole($request->rol); // usando laravel-permission

    return response()->json(['message' => 'Usuario creado con éxito'], 201);
}


}
