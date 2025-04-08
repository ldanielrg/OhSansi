<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Hash;

class RecuperacionController extends Controller
{
    public function enviarCodigo(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Correo no encontrado'], 404);
        }

        // Aquí puedes generar y enviar un código si deseas
        
        // Por ahora solo validamos que existe

        return response()->json(['message' => 'Código enviado con éxito'], 200);
    }
    public function enviarCodigoCorreo(Request $request)
{
    $request->validate(['email' => 'required|email']);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'Correo no encontrado'], 404);
    }

    $codigo = rand(100000, 999999); // Código numérico de 6 dígitos

    $user->codigo_recuperacion = $codigo;
    $user->save();

    Mail::raw("Tu código de verificación es: $codigo", function ($message) use ($user) {
        $message->to($user->email)
                ->subject('Código de recuperación de cuenta');
    });

    return response()->json(['message' => 'Código enviado']);
}

public function verificarCodigo(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'code' => 'required|digits:6'
    ]);

    $user = User::where('email', $request->email)
                ->where('codigo_recuperacion', $request->code)
                ->first();

    if (!$user) {
        return response()->json(['message' => 'Código inválido o expirado'], 401);
    }

    // Opcional: eliminar el código después de verificarlo
    $user->codigo_recuperacion = null;
    $user->save();

    return response()->json(['message' => 'Código verificado con éxito']);
}

public function restablecerContrasena(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|confirmed|min:8'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    $user->password = Hash::make($request->password);
    $user->codigo_recuperacion = null; // Limpieza del código
    $user->save();

    return response()->json(['message' => 'Contraseña actualizada correctamente']);
}

}
