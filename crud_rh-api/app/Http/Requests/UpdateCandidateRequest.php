<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCandidateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Regras de atualização:
     * - Campos opcionais (sometimes) pra permitir patch parcial.
     * - Unique ignora o próprio registro (Rule::unique()->ignore()).
     */
    public function rules(): array
    {
        // O parâmetro de rota é {candidate} (route model binding ativo)
        $candidate = $this->route('candidate');

        return [
            'name'   => ['sometimes','string','min:3','max:120'],
            'email'  => [
                'sometimes','email','max:150',
                Rule::unique('candidates','email')->ignore($candidate?->id)
            ],
            'cpf'    => [
                'sometimes','string','max:14',
                Rule::unique('candidates','cpf')->ignore($candidate?->id),
                'regex:/^\d{3}\.\d{3}\.\d{3}-\d{2}$/'
            ],
            'phone'  => ['sometimes','nullable','string','max:20'],
            'status' => ['sometimes','in:em_analise,aprovado,reprovado'],
        ];
    }

    public function messages(): array
    {
        return [
            'cpf.regex' => 'O CPF deve estar no formato 000.000.000-00.',
        ];
    }
}
