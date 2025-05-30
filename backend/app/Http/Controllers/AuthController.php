<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        //Esto busca por email, y verifica si contraseña coincide
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $user = $request->user(); // Recuperamos el usuario ya autenticado.
        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'name' => $user->name,
                'apellido' => $user->apellido,
                'ci' => $user->ci,
                'email' => $user->email,
            ],
            'roles' => $user->getRoleNames()
        ]);
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada']);
    }

    public function verifyPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['valid' => false, 'message' => 'Usuario no autenticado'], 401);
        }

        $passwordCorrecta = Hash::check($request->password, $user->password);

        return response()->json(['valid' => $passwordCorrecta]);
    }
}
