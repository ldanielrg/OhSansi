<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CuentaController extends Controller{

    
    public function store(Request $request)    {
        $user = $request->user();

        // Verificar que tenga rol permitido
        if (!$user->hasAnyRole(['Admin', 'Director', 'Adm. Inscripcion'])) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        // Validación básica
        $request->validate([
            'nombres' => 'required|string',
            'apellidos' => 'required|string',
            'correo' => 'required|email|unique:users,email',
            'ci' => 'required|integer|unique:users,ci',
            'password' => 'required|string|min:6',
            'rol' => 'required|string',
            // unidad_educativa_id puede venir o no, validaremos después según necesidad
        ]);

        // Control de creación según quien crea
        if ($user->hasRole('Director') && $request->rol !== 'Docente') {
            return response()->json([
                'message' => 'Los Directores solo pueden crear cuentas de tipo "Docente".'
            ], 403);
        }

        if ($user->hasRole('Adm. Inscripcion') && $request->rol !== 'Aux') {
            return response()->json([
                'message' => 'El personal de Inscripción solo puede crear cuentas de tipo "Aux".'
            ], 403);
        }

        // Preparar datos para la creación
        $datos = [
            'name' => $request->nombres,
            'apellido' => $request->apellidos,
            'email' => $request->correo,
            'ci' => $request->ci,
            'password' => bcrypt($request->password),
        ];

        // Lógica de unidad educativa
        if (in_array($request->rol, ['Director', 'Docente'])) {
            if ($user->hasRole('Admin')) {
                // Admin DEBE mandar unidad educativa
                if (!$request->filled('unidad_educativa_id')) {
                    return response()->json([
                        'message' => 'Debes seleccionar una Unidad Educativa para el nuevo usuario.'
                    ], 422);
                }
                $datos['id_ue_ue'] = $request->unidad_educativa_id;
            } elseif ($user->hasRole('Director')) {
                // Director: se usa su propia unidad educativa
                $datos['id_ue_ue'] = $user->id_ue_ue;
            }
        }

        // Crear el usuario
        $nuevoUsuario = User::create($datos);

        // Asignar rol
        $nuevoUsuario->assignRole($request->rol);

        return response()->json([
            'message' => 'Usuario creado con éxito.'
        ], 201);
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
