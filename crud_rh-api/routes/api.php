<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CandidateController;

/**
 * API REST de candidatos.
 * - apiResource cria: index, store, show, update, destroy
 * - Se precisar de rotas extras (ex.: alterar status), dá pra adicionar aqui.
 */
Route::apiResource('candidates', CandidateController::class);
