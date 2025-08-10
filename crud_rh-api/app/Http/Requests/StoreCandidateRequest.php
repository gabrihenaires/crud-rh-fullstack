<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCandidateRequest extends FormRequest
{
    // Autorização simples (poderia integrar com policies se houver auth)
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Regras de criação:
     * - CPF no formato 000.000.000-00 (uma validação simples; não faz verificação de dígitos)
     * - email e cpf únicos
     */
    public function rules(): array
    {
        return [
            'name'   => ['required','string','min:3','max:120'],
            'email'  => ['required','email','max:150','unique:candidates,email'],
            'cpf'    => ['required','string','max:14','unique:candidates,cpf', 'regex:/^\d{3}\.\d{3}\.\d{3}-\d{2}$/'],
            'phone'  => ['nullable','string','max:20'],
            'status' => ['nullable','in:em_analise,aprovado,reprovado'],
        ];
    }

    public function messages(): array
    {
        return [
            // Mensagem customizada pro padrão de CPF
            'cpf.regex' => 'O CPF deve estar no formato 000.000.000-00.',
        ];
    }
}
