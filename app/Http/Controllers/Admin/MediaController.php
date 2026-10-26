<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadImageRequest;
use Illuminate\Http\JsonResponse;

class MediaController extends Controller
{
    public function store(UploadImageRequest $request): JsonResponse
    {
        $path = $request->file('image')->store('content', 'public');
        abort_if($path === false, 500, 'The image could not be stored. Please try again.');

        return response()->json(['url' => '/storage/'.$path], 201);
    }
}
