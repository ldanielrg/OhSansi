<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CuentaController;

//AGREGUE YO
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\UnidadEducativaController;
use App\Http\Controllers\Auth\RecuperacionController;

Route::get('/departamentos', [DepartamentoController::class, 'index']);
Route::get('/municipios/{id_depart}', [MunicipioController::class, 'porDepartamento']);
Route::post('/unidad-educativa', [UnidadEducativaController::class, 'store']);

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/crear-cuenta', [CuentaController::class, 'store']);


//Ruta controlador
Route::prefix('auth')->group(function () {
    Route::post('/enviar-codigo', [PasswordResetController::class, 'sendCode']);
    Route::post('/verificar-codigo', [PasswordResetController::class, 'verifyCode']);
    Route::post('/restablecer-contrasena', [PasswordResetController::class, 'resetPassword']);
});
Route::post('/auth/enviar-codigo', [RecuperacionController::class, 'enviarCodigo']);
Route::post('/auth/enviar-codigo-correo', [RecuperacionController::class, 'enviarCodigoCorreo']);
Route::post('/auth/verificar-codigo', [RecuperacionController::class, 'verificarCodigo']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);