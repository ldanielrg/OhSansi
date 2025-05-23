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
use App\Http\Controllers\FormularioController;
use App\Http\Controllers\GradoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrdenPagoController;
use App\Http\Controllers\ComprobanteController;

//Convocatoria
Route::get('/convocatorias', [ConvocatoriaController::class, 'index']);
Route::get('/convocatorias-activas', [ConvocatoriaController::class, 'indexActivas']);
Route::post('/convocatoria-crear', [ConvocatoriaController::class, 'store']);
Route::get('/convocatoria-detalle/{id_convocatoria}', [ConvocatoriaController::class, 'show']);
Route::post('/convocatoria-editar/{id_convocatoria}', [ConvocatoriaController::class, 'update']);
//Como no se puede eliminar nunca directamente, se está cambiando a la función de desactivar.
//Route::middleware('auth:sanctum')->delete('/convocatoria-eliminar/{id_convocatoria}', [ConvocatoriaController::class, 'destroy']);
Route::middleware('auth:sanctum')->delete('/convocatoria-eliminar/{id_convocatoria}', [ConvocatoriaController::class, 'toggleActivo']);
Route::put('/convocatoria-estado/{id_convocatoria}', [ConvocatoriaController::class, 'toggleActivo']);
//Convocatoria Inscritos oficiales
Route::get('/inscritos-oficiales/{id_convocatoria}', [FormularioController::class, 'obtenerInscritosOficiales']);
Route::get('/disciplinas/{id_convocatoria}', [ConvocatoriaController::class, 'obtenerAreasCategoriaGradosPorConvocatoria']);
//Gestión de Convocatorias
Route::get('/convocatoria-areas/{id_convocatoria}', [ConvocatoriaController::class, 'obtenerAreasPorConvocatoria']);
Route::get('/convocatoria-categorias/{id_convocatoria}', [ConvocatoriaController::class, 'obtenerCategoriasPorConvocatoria']);
Route::get('/convocatoria-areas-categorias/{id_convocatoria}', [ConvocatoriaController::class, 'obtenerAreasCategoriaPorConvocatoria']);
Route::get('/convocatoria-areas-categorias-grados/{id_convocatoria}', [ConvocatoriaController::class, 'obtenerAreasCategoriaGradosPorConvocatoria']);
    //Para CRUD Áreas
    Route::get('/areas/{id_convocatoria}', [AreaController::class, 'obtenerAreasPorConvocatoria']);
    Route::post('/convocatoria/{id_convocatoria}/area', [AreaController::class, 'storeDesdeRuta']); //AGREGUE YO
    Route::post('/area-crear/{id_convocatoria}', [AreaController::class, 'store']); //necesita id_convocatoria
    Route::post('/area-editar', [AreaController::class, 'update']);
    //Como no se puede eliminar nunca directamente, se está cambiando a la función de desactivar.
    //Route::delete('/area-eliminar/{id_area}', [AreaController::class, 'destroy']);
    Route::delete('/area-eliminar/{id_area}', [AreaController::class, 'toggleActivo']);
    Route::get('/areas-categorias-grados/{id_convocatoria}', [AreaController::class, 'AreasConcategoriasConGradosPorConvocatoria']);
    Route::post('/asignar-area-categoria', [AreaController::class, 'asignarAreaCategoria']);
    Route::delete('/eliminar-area-categoria', [AreaController::class, 'eliminarAsignacionAreaCategoria']);
    //Route::post('/asignacionAreaCategoriaGrado', [AreaController::class, 'asignarAreaCategoriaGrado']);
   
    //Para CRUD Categorias
    Route::get('/categorias', [CategoriaController::class, 'obtenerCategoriasPorConvocatoria']);
    Route::get('/categoriasC/{id_convocatoria}', [CategoriaController::class, 'obtenerCategoriasPorConvocatoriaS']);
    Route::get('/categorias/{id_area}', [CategoriaController::class, 'porArea']);
    Route::get('/categorias-grados/{id_convocatoria}', [CategoriaController::class, 'categoriasConGradosPorConvocatoria']);//Obtiene Categorias y Grados "todos"
    //Route::delete('/categoria-eliminar/{id_categoria}', [CategoriaController::class, 'destroy']);
    Route::delete('/categoria-eliminar/{id_categoria}', [CategoriaController::class, 'toggleActivo']);
    Route::post('/categoria-crear/{id_convocatoria}', [CategoriaController::class, 'store']);
    Route::post('/categoria-editar', [CategoriaController::class, 'update']);
    Route::post('/asignar-grados-categoria', [CategoriaController::class, 'asignarGradosCategoria']);
    Route::post('/limpiar-grados-categoria', [CategoriaController::class, 'limpiarGradosCategoria']);
    //Para CRUD Grados
    Route::get('/grados', [GradoController::class, 'todo']);
    Route::delete('/grado-eliminar/{id}', [GradoController::class, 'destroy']);
    Route::post('/grado-crear', [GradoController::class, 'store']);
//Departamentos/Municipios
Route::get('/departamentos', [DepartamentoController::class, 'index']);
Route::get('/municipios/{id_departamento}', [MunicipioController::class, 'porDepartamento']);
Route::get('/municipios', [MunicipioController::class, 'sinDepartamento']);
//Unidades Educativas
Route::post('/unidad-educativa', [UnidadEducativaController::class, 'store']);
Route::get('/unidades-educativas', [UnidadEducativaController::class, 'index']); //PARA OBTENER LOS DATOS UE
Route::put('/unidad-educativa/{id}', [UnidadEducativaController::class, 'update']);
Route::delete('/unidad-educativa/{id}', [UnidadEducativaController::class, 'destroy']);

// Eventos
Route::apiResource('/eventos', EventoController::class);
Route::get('convocatorias/{id}/eventos', [EventoController::class, 'porConvocatoria']);

//CRUD cuentas
Route::post('/login', [AuthController::class, 'login']);//Para logueo
Route::middleware('auth:sanctum')->get('/obtener-cuentas', [CuentaController::class, 'devolverUsuarios']);//Obtiene todos los usuarios con roles
Route::middleware('auth:sanctum')->delete('/eliminar-cuenta/{id}', [CuentaController::class, 'eliminarUsuario']);
Route::middleware('auth:sanctum')->post('/crear-cuenta', [CuentaController::class, 'store']);

//INSCRIPCIONES
Route::middleware('auth:sanctum')->get('/recuperar-formularios/{id_convocatoria}', [InscripcionController::class, 'recuperarFormularios']);
Route::middleware('auth:sanctum')->delete('/formulario-eliminar/{id}', [InscripcionController::class, 'eliminarFormulario']); 
Route::middleware('auth:sanctum')->get('/formulario-detalles/{id_formulario}', [InscripcionController::class, 'mostrarFormulario']);
Route::middleware('auth:sanctum')->get('/formulario-detalles-orden-pago/{id_formulario}', [InscripcionController::class, 'mostrarFormulario2']);
Route::middleware('auth:sanctum')->post('/inscripcion', [InscripcionController::class, 'inscribirEstudiantes']); 
Route::post('/editar-registro-estudiante', [InscripcionController::class, 'editarEstudiante']);
Route::delete('/eliminar-registro-estudiante', [InscripcionController::class, 'eliminarInscripcion']);
Route::get('/dame-mi-team', [InscripcionController::class, 'obtenerSiguienteTeam']);
Route::get('/participantes', [InscripcionController::class, 'obtenerNroParticipantes']);

//RUTAS PROTEGIDAS
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'profile']);
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/permisos', [PermisoController::class, 'index']);
    Route::post('/user/verify-password', [AuthController::class, 'verifyPassword']); //AGREGUE YO PARA VERIFICAR PASSWORD 
});

//ORDEN DE PAGO FORMULARIO

Route::middleware('auth:sanctum')->group(function () {
    //Route::get('/orden-pago/{id_formulario}', [InscripcionController::class, 'calcularTotalPorEquipo']);
    Route::get('/orden-pago/{id_formulario}', [OrdenPagoController::class, 'mostrarPorFormulario']);
    Route::post('/orden-pago', [OrdenPagoController::class, 'crear']); // AGREGUE YO, PARA INSERTAR DATOS EN BD
});


//COMPROBANTE DE PAGO
Route::post('/guardar-comprobante', [ComprobanteController::class, 'store']);
Route::get('/verificar-codigo/{codigo}', [ComprobanteController::class, 'verificarCodigo']);
Route::get('/comprobantes-pendientes', [ComprobanteController::class, 'comprobantesPendientes']);
Route::patch('/comprobantes/{id}', [ComprobanteController::class, 'actualizarEstado']);

#Rutas sin proteger (sólo para pruebas)