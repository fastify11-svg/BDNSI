<?php

use App\Http\Controllers\Staff\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Staff\DashboardController;
use App\Http\Controllers\Staff\DocumentController;
use App\Http\Controllers\Staff\SessionController;
use App\Http\Controllers\Staff\StudentController;
use App\Http\Controllers\Staff\SubjectController;
use Illuminate\Support\Facades\Route;

Route::prefix('staff')->name('staff.')->group(function () {
    // Guest Staff Routes
    Route::middleware('guest:staff')->group(function () {
        Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.post');

        Route::get('/forgot-password', [\App\Http\Controllers\Staff\Auth\PasswordResetLinkController::class, 'create'])
                    ->name('password.request');

        Route::post('/forgot-password', [\App\Http\Controllers\Staff\Auth\PasswordResetLinkController::class, 'store'])
            ->middleware('throttle:password-reset')
            ->name('password.email');

        Route::get('/reset-password/{token}', [\App\Http\Controllers\Staff\Auth\NewPasswordController::class, 'create'])
                    ->name('password.reset');

        Route::post('/reset-password', [\App\Http\Controllers\Staff\Auth\NewPasswordController::class, 'store'])
                    ->name('password.update');
    });

    // Authenticated Staff Routes
    Route::middleware('auth:staff')->group(function () {
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

        Route::get('/', [DashboardController::class, 'index']);
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Staff Decentralized Courses (Subjects)
        Route::get('/courses', [SubjectController::class, 'index'])->name('subject.index');
        Route::post('/courses', [SubjectController::class, 'store'])->name('subject.store');
        Route::put('/courses/{id}', [SubjectController::class, 'update'])->name('subject.update');
        Route::delete('/courses/{id}', [SubjectController::class, 'destroy'])->name('subject.destroy');

        // Staff Decentralized Sessions
        Route::get('/sessions', [SessionController::class, 'index'])->name('session.index');
        Route::post('/sessions', [SessionController::class, 'store'])->name('session.store');
        Route::put('/sessions/{id}', [SessionController::class, 'update'])->name('session.update');
        Route::delete('/sessions/{id}', [SessionController::class, 'destroy'])->name('session.destroy');

        // Staff Student Admissions (Scoped to Staff courses & sessions)
        Route::get('/students', [StudentController::class, 'index'])->name('student.index');
        Route::get('/students/create', [StudentController::class, 'create'])->name('student.create');
        Route::post('/students', [StudentController::class, 'store'])->name('student.store');
        Route::get('/students/{student}', [StudentController::class, 'show'])->name('student.show');
        Route::put('/students/{student}', [StudentController::class, 'update'])->name('student.update');
        Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('student.destroy');

        // Staff Document Generation (ID Cards, Marksheets, Certificates using Admin Templates)
        Route::get('/documents', [DocumentController::class, 'index'])->name('document.index');
        Route::get('/documents/generate/{template}/{student}', [DocumentController::class, 'generate'])->name('document.generate');

        // Phase L - Commission
        Route::get('/commissions', [\App\Http\Controllers\Staff\CommissionController::class, 'index'])->name('commission.index');
    });
});
