<?php

namespace App\Providers;

use App\Models\Menu;
use App\Models\User;
use App\Models\SettingApp;
use Spatie\Permission\Models\Role;
use App\Observers\GlobalActivityLogger;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // observers
        User::observe(GlobalActivityLogger::class);
        Role::observe(GlobalActivityLogger::class);
        Permission::observe(GlobalActivityLogger::class);
        Menu::observe(GlobalActivityLogger::class);
        SettingApp::observe(GlobalActivityLogger::class);

        // âœ… SHARE MENUS GLOBAL (nested + permission-safe)
        Inertia::share('menus', function () {
            $user = auth()->user();
            if (!$user) return [];

            return Menu::root()
                ->forUser($user)
                ->with(['children' => function ($q) use ($user) {
                    $q->forUser($user)
                      ->orderBy('order')
                      ->with(['children' => function ($qq) use ($user) {
                          $qq->forUser($user)->orderBy('order');
                      }]);
                }])
                ->orderBy('order')
                ->get();
        });

        // (opsional) share setting app juga kalau kamu butuh global
        Inertia::share('setting', function () {
            return SettingApp::first();
        });
    }
}
