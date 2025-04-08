<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CuentaController;

//AGREGUE YO
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\UnidadEducativaController;

Route::get('/departamentos', [DepartamentoController::class, 'index']);
Route::get('/municipios/{id_depart}', [MunicipioController::class, 'porDepartamento']);

Route::post('/unidad-educativa', [UnidadEducativaController::class, 'store']);
Route::get('/unidades-educativas', [UnidadEducativaController::class, 'index']); //PARA OBTENER LOS DATOS UE
Route::put('/unidad-educativa/{id}', [UnidadEducativaController::class, 'update']);
Route::delete('/unidad-educativa/{id}', [UnidadEducativaController::class, 'destroy']);


Route::post('/login', [AuthController::class, 'login']);
Route::post('/crear-cuenta', [CuentaController::class, 'store']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);