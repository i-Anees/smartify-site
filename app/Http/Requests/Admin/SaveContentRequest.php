<?php

namespace App\Http\Requests\Admin;

use App\Rules\ContentImage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $item = $this->route('item');
        abort_if($item && $item->collection !== $this->route('collection'), 404);

        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        $collection = $this->route('collection');
        $fields = config('site-content.collections.'.$collection.'.fields');
        abort_unless(is_array($fields), 404);
        $rules = ['published' => ['required', 'boolean'], 'sort_order' => ['required', 'integer', 'min:0', 'max:100000'], 'data' => ['required', 'array:'.implode(',', array_keys($fields))]];
        foreach ($fields as $key => $field) {
            $required = $field['required'] || ($collection === 'team' && $key === 'portrait' && $this->boolean('published'));
            $validation = [$required ? 'required' : 'nullable'];
            $validation = [...$validation, ...match ($field['type']) {
                'number' => ['integer', 'min:0', 'max:10000'],
                'checkbox' => ['boolean'],
                'list' => ['array', 'min:1', 'max:30'],
                'url' => ['url:http,https', 'max:500'],
                'image' => ['string', new ContentImage],
                'select' => [Rule::in($field['options'])],
                'textarea' => ['string', 'max:5000'],
                default => ['string', 'max:255'],
            }];
            $rules['data.'.$key] = $validation;
            if ($field['type'] === 'list') {
                $rules['data.'.$key.'.*'] = ['required', 'string', 'max:250'];
            }
        }
        if (isset($fields['slug'])) {
            $rules['data.slug'] = ['required', 'string', 'max:160', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('content_items', 'slug')->where('collection', $collection)->ignore($this->route('item')?->id)];
        }
        if ($collection === 'team') {
            $rules['data.portraitFocus'] = ['nullable', 'integer', 'between:0,100'];
        }

        return $rules;
    }
}
