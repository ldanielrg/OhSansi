<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validamos los campos con los nombres que usas en el frontend
        $request->validate([
            'usuario' => 'required|string',
            'correo' => 'required|email',
            'contrasena' => 'required|string',
        ]);

        // Buscamos el usuario por 'usuario' y 'correo'
        $user = User::where('username', $request->usuario)
                    ->where('email', $request->correo)
                    ->first();

        // Verificamos si existe y si la contraseña es válida
        if (!$user || !Hash::check($request->contrasena, $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        // Creamos un token con Sanctum
        $token = $user->createToken('token')->plainTextToken;

        // Devolvemos el token y los datos del usuario
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'roles' => method_exists($user, 'getRoleNames') ? $user->getRoleNames() : [],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada']);
    }
}
