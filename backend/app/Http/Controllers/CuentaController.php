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


    public function devolverUsuarios(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('Admin') && !$user->hasRole('Director')) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        if ($user->hasRole('Admin')) {
            // Admin: ve todos los usuarios
            $users = User::with('roles')->get();
        } else {
            // Director: solo ve usuarios de su unidad educativa
            $users = User::with('roles')
                        ->where('id_ue_ue', $user->id_ue_ue)
                        ->get();
        }

        $usuariosFormateados = $users->map(function($usuario) {
            return [
                'id'       => $usuario->id,
                'nombre'   => $usuario->name,
                'apellido' => $usuario->apellido,
                'email'    => $usuario->email,
                'role'     => $usuario->getRoleNames()->first(), // primer rol
            ];
        });

        return response()->json($usuariosFormateados);
    }

    public function eliminarUsuario(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->hasRole('Admin') && !$user->hasRole('Director')) {
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

        // No puede eliminarse a sí mismo
        if ($usuarioEliminar->id == $user->id) {
            return response()->json([
                'message' => 'No puedes eliminar tu propia cuenta.'
            ], 403);
        }

        if ($user->hasRole('Admin')) {
            // Admin puede eliminar sin restricciones (excepto a sí mismo)
            $usuarioEliminar->delete();
            return response()->json([
                'message' => 'Usuario eliminado correctamente.'
            ], 200);
        }

        if ($user->hasRole('Director')) {
            // Director: Restricciones adicionales
            $mismoUnidadEducativa = $usuarioEliminar->id_ue_ue == $user->id_ue_ue;
            $rolesPermitidos = ['Director', 'Docente'];
            $rolUsuario = $usuarioEliminar->getRoleNames()->first(); // suponemos un rol por usuario

            if (!$mismoUnidadEducativa || !in_array($rolUsuario, $rolesPermitidos)) {
                return response()->json([
                    'message' => 'No tienes permisos para eliminar este usuario.'
                ], 403);
            }

            $usuarioEliminar->delete();
            return response()->json([
                'message' => 'Usuario eliminado correctamente.'
            ], 200);
        }
    }


}
