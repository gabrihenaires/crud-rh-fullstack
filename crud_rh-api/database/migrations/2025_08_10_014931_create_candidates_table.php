<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tabela 'candidates'
 * - Index em (name, status) pra acelerar busca e filtro.
 * - status padrão: 'em_analise'.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('email')->unique();
            $table->string('cpf', 14)->unique();
            $table->string('phone', 20)->nullable();

            // em_analise | aprovado | reprovado
            $table->string('status', 20)->default('em_analise');

            $table->timestamps();

            // Índice composto ajuda listar/filtrar rapidamente
            $table->index(['name', 'status']);
        });
    }
};
