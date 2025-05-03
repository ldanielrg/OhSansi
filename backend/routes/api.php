<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\UnidadEducativaController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\CronogramaController;
use App\Http\Controllers\ConvocatoriaController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\GradoController;
use App\Http\Controllers\UserController;

//Convocatoria
Route::get('/convocatorias', [ConvocatoriaController::class, 'index']);
Route::post('/convocatoria-crear', [ConvocatoriaController::class, 'store']);
Route::get('/convocatoria-detalle/{id}', [ConvocatoriaController::class, 'show']);
Route::post('/convocatoria-editar/{id}', [ConvocatoriaController::class, 'update']);
Route::delete('/convocatoria-eliminar/{id}', [ConvocatoriaController::class, 'destroy']);
//Gestión de Convocatorias
Route::get('/convocatoria-areas/{id}', [ConvocatoriaController::class, 'obtenerAreasPorConvocatoria']);
Route::get('/convocatoria-categorias/{id}', [ConvocatoriaController::class, 'obtenerCategoriasPorConvocatoria']);
Route::get('/convocatoria-areas-categorias/{id}', [ConvocatoriaController::class, 'obtenerAreasCategoriaPorConvocatoria']);
Route::get('/convocatoria-areas-categorias-grados/{id}', [ConvocatoriaController::class, 'obtenerAreasCategoriaGradosPorConvocatoria']);
    //Para CRUD areas
    Route::get('/areas', [AreaController::class, 'index']);
    Route::delete('/area-eliminar/{id}', [AreaController::class, 'destroy']);
    Route::post('/area-crear', [AreaController::class, 'store']);
    Route::get('/areas-categorias-grados', [AreaController::class, 'AreasConcategoriasConGrados']);
    Route::post('/asignacionAreaCategoriaGrado', [AreaController::class, 'asignarAreaCategoriaGrado']);
    Route::post('/asignar-area-categoria', [AreaController::class, 'asignarAreaCategoria']);
    Route::delete('/eliminar-area-categoria', [AreaController::class, 'eliminarAsignacionAreaCategoria']);

Route::get('/categorias', [CategoriaController::class, 'todo']);
Route::get('/categorias/{id_area}', [CategoriaController::class, 'porArea']);
Route::get('/categorias-grados', [CategoriaController::class, 'categoriasConGrados']);
Route::delete('/categoria-eliminar/{id}', [CategoriaController::class, 'destroy']);
Route::post('/categoria-crear', [CategoriaController::class, 'store']);
Route::post('/asignar-grados-categoria', [CategoriaController::class, 'asignarGradosCategoria']);
Route::post('/limpiar-grados-categoria', [CategoriaController::class, 'limpiarGradosCategoria']);
//Departamentos/Municipios
Route::get('/departamentos', [DepartamentoController::class, 'index']);
Route::get('/municipios/{id_depart}', [MunicipioController::class, 'porDepartamento']);
Route::get('/municipios', [MunicipioController::class, 'sinDepartamento']);
//Unidades Educativas
Route::post('/unidad-educativa', [UnidadEducativaController::class, 'store']);
Route::get('/unidades-educativas', [UnidadEducativaController::class, 'index']); //PARA OBTENER LOS DATOS UE
Route::put('/unidad-educativa/{id}', [UnidadEducativaController::class, 'update']);
Route::delete('/unidad-educativa/{id}', [UnidadEducativaController::class, 'destroy']);



Route::get('/grados', [GradoController::class, 'todo']);
Route::delete('/grado-eliminar/{id}', [GradoController::class, 'destroy']);
Route::post('/grado-crear', [GradoController::class, 'store']);

// Eventos
Route::apiResource('/eventos', EventoController::class);
//////

Route::post('/login', [AuthController::class, 'login']);//Para logueo
Route::middleware('auth:sanctum')->get('/obtener-cuentas', [CuentaController::class, 'devolverUsuarios']);//Obtiene todos los usuarios con roles
Route::middleware('auth:sanctum')->delete('/eliminar-cuenta/{id}', [CuentaController::class, 'eliminarUsuario']);
Route::middleware('auth:sanctum')->post('/crear-cuenta', [CuentaController::class, 'store']);



//INSCRIPCIONES
Route::middleware('auth:sanctum')->post('/inscribir', [InscripcionController::class, 'store']);
Route::middleware('auth:sanctum')->post('/formularios', [InscripcionController::class, 'recuperarFormularios']);
Route::middleware('auth:sanctum')->get('/formularios/{id}', [InscripcionController::class, 'mostrarFormulario']);
Route::middleware('auth:sanctum')->delete('/formulario-eliminar', [InscripcionController::class, 'eliminarFormulario']);

//RUTAS PROTEGIDAS
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'profile']);
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/permisos', [PermisoController::class, 'index']);
    Route::post('/user/verify-password', [AuthController::class, 'verifyPassword']); //AGREGUE YO PARA VERIFICAR PASSWORD 
});

#Rutas sin proteger (sólo para pruebas)
