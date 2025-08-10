<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCandidateRequest;
use App\Http\Requests\UpdateCandidateRequest;
use App\Models\Candidate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CandidateController extends Controller
{
    /**
     * Lista candidatos com filtro por status, busca de texto e paginação.
     * - Valida query params pra garantir tipos e limites (defesa da API).
     * - Usa ILIKE no Postgres e fallback case-insensitive em outros drivers.
     * - Ordena por id desc pra mostrar últimos cadastrados primeiro.
     */
    public function index(Request $request): JsonResponse
    {
        // 1) Validação dos query params (evita SQL injection, números absurdos, etc.)
        $validated = $request->validate([
            'status'   => ['nullable', 'in:em_analise,aprovado,reprovado'],
            'search'   => ['nullable', 'string', 'max:150'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page'     => ['nullable', 'integer', 'min:1'],
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $status  = $validated['status']   ?? null;
        $search  = $validated['search']   ?? null;

        $q = Candidate::query();

        // 2) Filtro por status (executado só se informado)
        $q->when($status, function ($query, $status) {
            $query->where('status', $status);
        });

        // 3) Busca textual por nome/email/cpf (case-insensitive)
        if ($search !== null && $search !== '') {
            $driver = DB::getDriverName(); // 'pgsql', 'mysql', 'sqlite', etc.
            $like   = "%{$search}%";

            if ($driver === 'pgsql') {
                // Postgres: ILIKE (case-insensitive nativo)
                $q->where(function ($w) use ($like) {
                    $w->where('name',  'ilike', $like)
                      ->orWhere('email','ilike', $like)
                      ->orWhere('cpf',  'ilike', $like);
                });
            } else {
                // Fallback universal: LOWER(col) LIKE LOWER(?)
                $q->where(function ($w) use ($like) {
                    $w->whereRaw('LOWER(name)  LIKE LOWER(?)',  [$like])
                      ->orWhereRaw('LOWER(email) LIKE LOWER(?)', [$like])
                      ->orWhereRaw('LOWER(cpf)   LIKE LOWER(?)', [$like]);
                });
            }
        }

        // 4) Ordenação + paginação
        $candidates = $q->orderByDesc('id')->paginate($perPage);

        return response()->json($candidates);
    }

    /**
     * Cria um candidato.
     * - Validação está no StoreCandidateRequest.
     */
    public function store(StoreCandidateRequest $request): JsonResponse
    {
        $candidate = Candidate::create($request->validated());
        return response()->json($candidate, 201);
    }

    /**
     * Exibe um candidato específico (route model binding).
     */
    public function show(Candidate $candidate): JsonResponse
    {
        return response()->json($candidate);
    }

    /**
     * Atualiza um candidato.
     * - Validação está no UpdateCandidateRequest.
     * - Unique ignora o próprio id (handled no FormRequest).
     */
    public function update(UpdateCandidateRequest $request, Candidate $candidate): JsonResponse
    {
        $candidate->update($request->validated());
        return response()->json($candidate);
    }

    /**
     * Remove um candidato (soft delete não aplicado aqui).
     */
    public function destroy(Candidate $candidate): JsonResponse
    {
        $candidate->delete();
        return response()->json(null, 204);
    }
}
