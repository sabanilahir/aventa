<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class AssignAdminRole extends Command
{
    protected $signature = 'assign:admin-role';
    protected $description = 'Assign admin role to admin user';

    public function handle()
    {
        $admin = User::where('email', 'admin@example.com')->first();
        if ($admin) {
            $admin->assignRole('admin');
            $this->info('Admin role assigned to admin@example.com');
        } else {
            $this->error('Admin user not found');
        }
    }
}
