<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ShareMenus;
use App\Http\Middleware\CheckMenuPermission;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Exclude rute dari proteksi CSRF
        $middleware->validateCsrfTokens(except: [
            'register/simpan',
            'api/register/simpan',
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            ShareMenus::class,
        ]);

        $middleware->alias([
            'menu.permission' => CheckMenuPermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Paksa Exception mengembalikan JSON jika request berasal dari fetch/AJAX
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            if ($request->is('register/*') || $request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });
    })->create();
