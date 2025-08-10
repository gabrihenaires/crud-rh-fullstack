<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

/**
 * Bootstrap da aplicação Laravel 11:
 * - Declara arquivos de rotas.
 * - Espaços para middleware globais e tratativa centralizada de exceções.
 */
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Adicione middleware globais aqui se necessário.
        // Ex.: $middleware->append(\App\Http\Middleware\Cors::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Registre handlers globais de exceção aqui se quiser customizar respostas JSON.
    })
    ->create();
