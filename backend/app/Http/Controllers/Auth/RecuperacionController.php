<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Hash;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Validator;

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

public function enviarCodigoWhatsapp(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email'
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'El correo es requerido'], 422);
    }

    $user = \App\Models\User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    if (!$user->phone) {
        return response()->json(['message' => 'El usuario no tiene número registrado'], 422);
    }

    // Generar código numérico de 6 dígitos
    $codigo = rand(100000, 999999);

    // Guardarlo en la base de datos
    $user->codigo_recuperacion = $codigo;
    $user->save();

    // Enviar mensaje por Twilio WhatsApp
    try {
        $twilio = new Client(env('TWILIO_SID'), env('TWILIO_AUTH_TOKEN'));

        $twilio->messages->create(
            'whatsapp:' . $user->phone,
            [
                'from' => env('TWILIO_WHATSAPP_NUMBER'),
                'body' => "Tu código de recuperación es: $codigo"
            ]
        );

        return response()->json(['message' => 'Código enviado por WhatsApp']);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al enviar mensaje: ' . $e->getMessage()], 500);
    }
}

}
