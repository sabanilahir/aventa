<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class AssignSuperadmin extends Command
{
    protected $signature = 'assign:superadmin {email=admin@example.com}';
    protected $description = 'Assign superadmin role to user';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User not found: $email");
            return;
        }

        $user->assignRole('superadmin');
        $this->info("Superadmin role assigned to $email");
    }
}
