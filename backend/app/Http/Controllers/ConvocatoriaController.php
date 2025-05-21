<?php

namespace App\Http\Controllers;

use App\Models\Convocatoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\Area;
use App\Models\AreaTieneCategorium;
use App\Models\Categorium;
use App\Traits\RegistraBitacora;


class ConvocatoriaController extends Controller
{

    use RegistraBitacora;

    #Obtiene todas las convocatorias
    public function index(){
        return response()->json(Convocatoria::all());
    }
    #Obtiene todas las convocatorias ACTIVAS
    public function indexActivas(){
        $convocatorias = Convocatoria::where('activo', true)->get();

        return response()->json($convocatorias);
    }
    #Cambia el estado de una convocatoria de activa a inactiva, y viceversa.
    public function toggleActivo($id_convocatoria){
        $convocatoria = Convocatoria::find($id_convocatoria);
    
        if (!$convocatoria) {
            return response()->json([
                'message' => 'Convocatoria no encontrada.'
            ], 404);
        }
    
        // Cambiar estado activo al valor contrario
        $convocatoria->activo = !$convocatoria->activo;
        $convocatoria->save();
    
        return response()->json([
            'message' => 'Estado de convocatoria actualizado.',
            'id_convocatoria' => $convocatoria->id_convocatoria,
            'nuevo_estado' => $convocatoria->activo
        ]);
    }

    #Para crear una convocatoria
    public function store(Request $request){
        Log::debug($request);
        //Validación
        $validator = Validator::make($request->all(), [
            'nombre_convocatoria' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_final' => 'required|date|after_or_equal:fecha_inicio',
            //'activo' => 'required|boolean', por defecto lo pondré en TRUE
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // 📝 Log de datos recibidos
        Log::info('Datos recibidos para convocatoria:', $request->all());

        $convocatoria = Convocatoria::create([
            'nombre_convocatoria' => $request->input('nombre_convocatoria'),
            'descripcion' => $request->input('descripcion'),
            'fecha_inicio' => $request->input('fecha_inicio'),
            'fecha_final' => $request->input('fecha_final'),
            'activo' => true
        ]);

        return response()->json([
            'message' => 'Convocatoria creada correctamente.'
        ], 201);
    }

    #Muestra datos de una determinada convocatoria
    //MODIFIQUE YO
    public function show($id_convocatoria){
        $convocatoria = Convocatoria::where('id_convocatoria', $id_convocatoria)->get();
        return response()->json($convocatoria);
    }

    #Para actualizar datos de una convocatoria
    public function update(Request $request,$id){
        $convocatoria = Convocatoria::findOrFail($id);
        $convocatoria->update($request->all());

        return response()->json($convocatoria);
    }

    #Eliminar una convocatoria.
    public function destroy(string $id){
        $convocatoria = Convocatoria::findOrFail($id);
        $datosAntes = $convocatoria->toArray();
        Convocatoria::destroy($id);
        $this->guardarBitacora(
            'eliminación',
            'convocatoria',
            $id,
            'Eliminación de convocatoria',
            $datosAntes
        );

        return response()->json(null, 204);
    }

    #Obtiene todas las areas de determinada convocatoria
    public function obtenerAreasPorConvocatoria($id){
        $areas = Area::where('id_convocatoria_convocatoria', $id)->get();
        if ($areas->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron áreas para esta convocatoria.'
            ], 404);
        }
        return response()->json($areas);
    }
    #Obtiene todas las categorias de determinada convocatoria
    public function obtenerCategoriasPorConvocatoria($id){
        $categorias = Categorium::where('id_convocatoria_convocatoria', $id)->get();
        if ($categorias->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron categorias para esta convocatoria.'
            ], 404);
        }
        return response()->json($categorias);
    }
    #Obtiene todas las AREA-CATEGORIA para determinada Convocatoria
    public function obtenerAreasCategoriaPorConvocatoria($idConvocatoria)    {
        $registros = DB::table('area_tiene_categoria')
            ->join('area', 'area.id_area', '=', 'area_tiene_categoria.id_area_area')
            ->join('categoria', 'categoria.id_categoria', '=', 'area_tiene_categoria.id_categoria_categoria')
            ->where('area.id_convocatoria_convocatoria', $idConvocatoria)
            ->where('categoria.id_convocatoria_convocatoria', $idConvocatoria)
            ->select(
                'area_tiene_categoria.*',
                'area.nombre_area as nombre_area',
                'categoria.nombre_categoria as nombre_categoria'
            )
            ->get();

        return response()->json($registros);
    }

    #Obtiene todas las AREA-CATEGORIA-GRADOS para determinada Convocatoria
    public function obtenerAreasCategoriaGradosPorConvocatoria($idConvocatoria){
        $registros = DB::table('area_tiene_categoria')
            ->join('area', 'area.id_area', '=', 'area_tiene_categoria.id_area_area')
            ->join('categoria', 'categoria.id_categoria', '=', 'area_tiene_categoria.id_categoria_categoria')
            ->leftJoin('grado as grado_ini', 'grado_ini.id_grado', '=', 'categoria.grado_ini')
            ->leftJoin('grado as grado_fin', 'grado_fin.id_grado', '=', 'categoria.grado_fin')
            ->where('area.id_convocatoria_convocatoria', $idConvocatoria)
            ->where('categoria.id_convocatoria_convocatoria', $idConvocatoria)
            ->select(
                'area_tiene_categoria.*',
                'area.nombre_area as nombre_area',
                'categoria.nombre_categoria as nombre_categoria',
                'grado_ini.nombre_grado as nombre_grado_ini',
                'grado_fin.nombre_grado as nombre_grado_fin'
            )
            ->get();

        return response()->json($registros);
    }
}

