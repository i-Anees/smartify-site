<?php

namespace App\Http\Requests\Admin;

use App\Rules\ContentImage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SaveSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            $values = $this->input('values');
            if (is_array($values) && array_diff(array_keys($values), array_keys(config('site-content.copy')))) {
                $validator->errors()->add('values', 'Only supported website fields can be saved.');
            }
        }];
    }

    public function rules(): array
    {
        $fields = config('site-content.copy');
        $rules = ['values' => ['required', 'array']];
        foreach ($fields as $key => $field) {
            $rules['values.'.str_replace('.', '\\.', $key)] = [
                'sometimes', $field['required'] ? 'required' : 'nullable', 'string', $field['type'] === 'textarea' ? 'max:5000' : 'max:500',
                ...match ($field['type']) {
                    'email' => ['email', 'max:254'], 'url' => ['url:http,https', 'max:500'], 'image' => [new ContentImage], default => [],
                },
            ];
        }

        return $rules;
    }
}
