<?php

namespace App\Console\Commands;

use App\Models\User;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateAdministrator extends Command
{
    protected $signature = 'admin:create {email?} {--name= : Administrator name}';

    protected $description = 'Create an administrator or securely reset an existing administrator account';

    public function handle(): int
    {
        $email = strtolower(trim($this->argument('email') ?? $this->ask('Email address') ?? ''));
        $name = $this->option('name') ?: $this->ask('Full name');
        $user = User::query()->where('email', $email)->first();
        if ($user && ! $this->confirm('This account exists. Grant admin access and replace its password?')) {
            return self::FAILURE;
        }
        $password = $this->secret('Password (at least 12 characters)');
        $confirmation = $this->secret('Confirm password');
        $validator = Validator::make(['email' => $email, 'name' => $name, 'password' => $password, 'password_confirmation' => $confirmation], ['email' => ['required', 'email', 'max:254'], 'name' => ['required', 'string', 'max:255'], 'password' => ['required', 'string', 'min:12', 'confirmed']]);
        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $this->error($message);
            }

            return self::FAILURE;
        }
        $user ??= new User;
        $user->name = $name;
        $user->email = $email;
        $user->password = $password;
        $user->is_admin = true;
        $user->save();
        app(SiteContentSeeder::class)->run();
        $this->info('Administrator ready. Sign in at /admin/login.');

        return self::SUCCESS;
    }
}
