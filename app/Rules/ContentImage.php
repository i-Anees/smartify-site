<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Storage;

class ContentImage implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || str_contains($value, '..') || ! preg_match('~^/(images/[a-zA-Z0-9/_-]+\.(?:png|jpe?g|webp|svg)|storage/content/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp))$~', $value)) {
            $fail('Choose an existing site image or upload a JPG, PNG or WebP image.');

            return;
        }
        $exists = str_starts_with($value, '/images/') ? is_file(public_path(ltrim($value, '/'))) : Storage::disk('public')->exists(substr($value, strlen('/storage/')));
        if (! $exists) {
            $fail('This image could not be found. Please upload it again.');
        }
    }
}
