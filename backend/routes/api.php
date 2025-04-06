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

Route::get('/departamentos', [DepartamentoController::class, 'index']);
Route::get('/municipios/{id_depart}', [MunicipioController::class, 'porDepartamento']);
Route::post('/unidad-educativa', [UnidadEducativaController::class, 'store']);

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');



//PERMISOS Y ROLES. Toda ruta relacionada con esto se encuentra aquí:
Route::post('/login', [AuthController::class, 'login']);
Route::post('/crear-cuenta', [CuentaController::class, 'store']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/permisos', [PermisoController::class, 'index']);