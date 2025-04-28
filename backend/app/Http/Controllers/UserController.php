<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'username' => $request->user()->username,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => 'nullable|string|min:6',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json(['message' => 'Perfil actualizado exitosamente']);
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
