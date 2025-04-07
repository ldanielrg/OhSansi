<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use App\Models\User;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\Hash;

class PasswordResetController extends Controller
{
    public function sendCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Correo no encontrado'], 404);
        }

        $code = rand(100000, 999999);

        PasswordReset::updateOrCreate(
            ['email' => $request->email],
            ['code' => $code, 'expires_at' => Carbon::now()->addMinutes(10)]
        );

        Mail::raw("Tu código de recuperación es: $code", function ($message) use ($request) {
            $message->to($request->email)->subject('Código de recuperación');
        });

        return response()->json(['message' => 'Código enviado']);
    }

    //Verificar codigo
    public function verifyCode(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'code' => 'required|size:6'
    ]);

    $reset = PasswordReset::where('email', $request->email)
        ->where('code', $request->code)
        ->where('expires_at', '>', now())
        ->first();

    if (!$reset) {
        return response()->json(['message' => 'Código inválido o expirado'], 400);
    }

    return response()->json(['message' => 'Código válido']);
}

    //Restablecer contraseña
    public function resetPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'code' => 'required|size:6',
        'password' => 'required|min:8|confirmed'
    ]);

    $reset = PasswordReset::where('email', $request->email)
        ->where('code', $request->code)
        ->where('expires_at', '>', now())
        ->first();

    if (!$reset) {
        return response()->json(['message' => 'Código inválido o expirado'], 400);
    }

    $user = User::where('email', $request->email)->first();
    $user->password = Hash::make($request->password);
    $user->save();

    $reset->delete(); // Opcional: eliminar el código

    return response()->json(['message' => 'Contraseña actualizada']);
}

}