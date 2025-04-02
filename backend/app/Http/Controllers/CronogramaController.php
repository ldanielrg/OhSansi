<?php

namespace App\Http\Controllers\Api;
use App\Models\Cronograma;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CronogramaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Cronograma::all();
    
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $cronograma = Cronograma::create($request->all());
        return response()->json($cronograma, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Cronograma::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $cronograma = Cronograma::findOrFail($id);
        $cronograma->update($request->all());
        return response()->json($cronograma);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Cronograma::destroy($id);
        return response()->json(null, 204);
    }
}
