<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CuentaController extends Controller{

    
    public function store(Request $request)    {
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


    public function devolverUsuarios(Request $request)    {
        //$user = Auth::user(); También funciona, pero el VC me da que no reconoce hasRoles.
        $user = $request->user();

        if (!$user->hasRole('Admin')) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }
        
        $users = User::with('roles')->get()->map(function($user) {
            return [
                'id'    => $user->id,
                'nombre'  => $user->name,
                'apellido'  => $user->apellido,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first(), //Aqui me devulve sólo el primer rol (porque solo hay uno por usuario)
            ];
        });

        return response()->json($users);
    }

    public function eliminarUsuario(Request $request, $id)    {
        $user = $request->user();

        if (!$user->hasRole('Admin')) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        $usuarioEliminar = User::find($id);

        if (!$usuarioEliminar) {
            return response()->json([
                'message' => 'Usuario no encontrado.'
            ], 404);
        }

        // Opcional: Evitar que el Admin se elimine a sí mismo
        if ($usuarioEliminar->id == $user->id) {
            return response()->json([
                'message' => 'No puedes eliminar tu propia cuenta.'
            ], 403);
        }

        $usuarioEliminar->delete();

        return response()->json([
            'message' => 'Usuario eliminado correctamente.'
        ], 200);
    }


}
