<?php

use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\SessionController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\ServiceController;
use App\Http\Middleware\EnsureAdministrator;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Home')->name('home');
Route::inertia('/about', 'About')->name('about');
Route::inertia('/services', 'Services')->name('services');
Route::inertia('/projects', 'Projects')->name('projects');
Route::inertia('/process', 'Process')->name('process');
Route::inertia('/testimonials', 'Testimonials')->name('testimonials');
Route::inertia('/contact', 'Contact')->name('contact');

Route::get('/services/{service}', [ServiceController::class, 'show'])->name('services.show');

Route::prefix('admin')->group(function (): void {
    Route::middleware('guest')->group(function (): void {
        Route::get('/login', [SessionController::class, 'create'])->name('login');
        Route::post('/login', [SessionController::class, 'store'])->middleware('throttle:10,1')->name('admin.session.store');
    });
    Route::middleware(['auth', EnsureAdministrator::class])->name('admin.')->group(function (): void {
        Route::get('/', [ContentController::class, 'index'])->name('index');
        Route::post('/logout', [SessionController::class, 'destroy'])->name('session.destroy');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');
        Route::post('/media', [MediaController::class, 'store'])->middleware('throttle:30,1')->name('media.store');
        Route::post('/content/{collection}', [ContentController::class, 'store'])->whereIn('collection', array_keys(config('site-content.collections')))->name('content.store');
        Route::put('/content/{collection}/{item}', [ContentController::class, 'update'])->whereIn('collection', array_keys(config('site-content.collections')))->name('content.update');
        Route::delete('/content/{collection}/{item}', [ContentController::class, 'destroy'])->whereIn('collection', array_keys(config('site-content.collections')))->name('content.destroy');
    });
});
