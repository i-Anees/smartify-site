<?php

namespace App\Http\Controllers;

use App\Support\SiteContent;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function show(string $service, SiteContent $content): Response
    {
        abort_unless(collect($content->published()['services'])->contains('slug', $service), 404);

        return Inertia::render('ServiceDetail', ['serviceSlug' => $service]);
    }
}
