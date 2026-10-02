<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use App\Models\SettingApp;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

   public function share(Request $request): array
{
    $shared = parent::share($request);

    $menus = function () use ($request) {
        $user = $request->user();
        if (!$user) return [];

        return Menu::root()
            ->with('children.children')
            ->orderBy('order')
            ->get();
    };

    return array_merge($shared, [
        'name' => config('app.name'),

        'auth' => [
            'user' => $request->user(),
        ],

        'flash' => [
            'success' => session('success'),
            'error'   => session('error'),
        ],

        'setting' => function () {
            return SettingApp::first();
        },

        'menus' => $menus,
    ]);
}

}
