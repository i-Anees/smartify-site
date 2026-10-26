<?php

namespace Database\Factories;

use App\Models\ContentItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ContentItem> */
class ContentItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'collection' => 'team', 'slug' => fake()->uuid(), 'published' => false, 'sort_order' => 0,
            'data' => ['name' => fake()->name(), 'role' => 'Designer', 'bio' => fake()->sentence(), 'portrait' => '/images/brand/ai-robot-640.webp', 'portraitFocus' => 35],
        ];
    }
}
