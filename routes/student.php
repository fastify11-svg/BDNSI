<?php

use App\Http\Controllers\Student\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Student\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Student\Auth\NewPasswordController;
use App\Http\Controllers\Student\Auth\PasswordResetLinkController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\DocumentController;
use App\Http\Controllers\Student\ExamController;
use Illuminate\Support\Facades\Route;

Route::prefix('students')->name('student.')->middleware(['portal.student'])->group(function () {

    // Guest Student Routes
    Route::middleware('guest:student')->group(function () {
        Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.post');

        Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
        Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
            ->middleware('throttle:password-reset')
            ->name('password.email');

        Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
        Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.update');
    });

    // Authenticated Student Routes
    Route::middleware('auth:student')->group(function () {
        Route::get('/', [DashboardController::class, 'index']);
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Academic Results & Transcript Hub
        Route::get('/results', [DocumentController::class, 'results'])->name('results');

        // Document Print & Verification Hub
        Route::get('/documents', [DocumentController::class, 'index'])->name('documents');
        Route::get('/id-card', [DocumentController::class, 'idCard'])->name('idCard');
        Route::get('/admit-card', [DocumentController::class, 'admitCard'])->name('admitCard');
        Route::get('/registration-card', [DocumentController::class, 'registrationCard'])->name('registrationCard');
        Route::get('/marksheet', [DocumentController::class, 'marksheet'])->name('marksheet');

        Route::get('/confirm-password', [ConfirmablePasswordController::class, 'show'])->name('password.confirm');
        Route::post('/confirm-password', [ConfirmablePasswordController::class, 'store']);

        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
        Route::get('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout.fallback');

        // Online Examination Resource
        Route::resource('exam', ExamController::class);
    });
});
