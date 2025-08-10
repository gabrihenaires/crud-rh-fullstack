<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    // Campos liberados para mass-assignment (usados no create/update)
    protected $fillable = [
        'name',
        'email',
        'cpf',
        'phone',
        'status',
    ];

    /**
     * Hook de modelo:
     * - Normaliza/trim valores antes de salvar (defesa contra espaços fantasmas).
     * - Mantém phone como null quando vazio (evita string vazia no banco).
     */
    protected static function booted(): void
    {
        static::saving(function (self $model) {
            $model->name  = trim((string) $model->name);
            $model->email = trim((string) $model->email);
            $model->cpf   = trim((string) $model->cpf);
            $model->phone = $model->phone ? trim((string) $model->phone) : null;
        });
    }
}
