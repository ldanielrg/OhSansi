<?php

namespace App\Http\Controllers\Api;
use App\Models\Formulario;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FormularioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Formulario::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $formulario = Formulario::create($request->all());
        return response()->json($formulario, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Formulario::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $formulario = Formulario::findOrFail($id);
        $formulario->update($request->all());
        return response()->json($formulario);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Formulario::destroy($id);
        return response()->json(null, 204);
    }
}
