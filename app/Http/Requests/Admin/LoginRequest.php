<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['email' => ['required', 'email', 'max:254'], 'password' => ['required', 'string', 'max:255'], 'remember' => ['sometimes', 'boolean']];
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('email'))) {
            $this->merge(['email' => Str::lower(trim($this->input('email')))]);
        }
    }

    public function authenticate(): void
    {
        $key = 'admin-login:'.Str::lower($this->string('email')->toString()).'|'.$this->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages(['email' => 'Too many attempts. Please try again in '.RateLimiter::availableIn($key).' seconds.']);
        }
        if (! Auth::attempt([...$this->only('email', 'password'), 'is_admin' => true], $this->boolean('remember'))) {
            RateLimiter::hit($key, 60);
            throw ValidationException::withMessages(['email' => 'These administrator credentials do not match our records.']);
        }
        RateLimiter::clear($key);
        $this->session()->regenerate();
    }
}
