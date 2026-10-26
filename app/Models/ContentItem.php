<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['collection', 'slug', 'data', 'sort_order', 'published'])]
class ContentItem extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return ['data' => 'array', 'published' => 'boolean', 'sort_order' => 'integer'];
    }
}
