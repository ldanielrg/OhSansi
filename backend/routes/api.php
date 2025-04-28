<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CuentaController;
use App\Http\Controllers\PermisoController;

//AGREGUE YO
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\UnidadEducativaController;

use App\Http\Controllers\EventoController;
use App\Http\Controllers\CronogramaController;
use App\Http\Controllers\ConvocatoriaController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\CategoriaController;

use App\Http\Controllers\UserController;

Route::get('/departamentos', [DepartamentoController::class, 'index']);
Route::get('/municipios/{id_depart}', [MunicipioController::class, 'porDepartamento']);
Route::get('/municipios', [MunicipioController::class, 'sinDepartamento']);

Route::post('/unidad-educativa', [UnidadEducativaController::class, 'store']);
Route::get('/unidades-educativas', [UnidadEducativaController::class, 'index']); //PARA OBTENER LOS DATOS UE
Route::put('/unidad-educativa/{id}', [UnidadEducativaController::class, 'update']);
Route::delete('/unidad-educativa/{id}', [UnidadEducativaController::class, 'destroy']);
Route::apiResource('/eventos', EventoController::class);
Route::apiResource('/convocatorias', ConvocatoriaController::class);
Route::get('/areas', [AreaController::class, 'index']);
Route::get('/categorias/{id_area}', [CategoriaController::class, 'porArea']);
Route::post('/convocatorias/{id}/areas', [ConvocatoriaController::class, 'asignarAreas']);




//PERMISOS Y ROLES. Toda ruta relacionada con esto se encuentra aquí:
Route::post('/login', [AuthController::class, 'login']);
Route::post('/crear-cuenta', [CuentaController::class, 'store']);


//INSCRIPCIONES
Route::middleware('auth:sanctum')->post('/inscribir', [InscripcionController::class, 'store']);
Route::middleware('auth:sanctum')->post('/formularios', [InscripcionController::class, 'recuperarFormularios']);
Route::middleware('auth:sanctum')->get('/formularios/{id}', [InscripcionController::class, 'mostrarFormulario']);
Route::middleware('auth:sanctum')->delete('/formularios/{id}', [InscripcionController::class, 'eliminarFormulario']);



// RECUPERAR DATOS DE USER
Route::get('/user', [UserController::class, 'profile']);
Route::put('/user', [UserController::class, 'update']);

// ORDENE MEJOR
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'profile']);
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/permisos', [PermisoController::class, 'index']);
});