<?php

use App\Http\Controllers\Admin\AdminListController;
use App\Http\Controllers\Admin\ApiSettingController;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Admin\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Admin\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Admin\Auth\NewPasswordController;
use App\Http\Controllers\Admin\Auth\PasswordResetLinkController;
use App\Http\Controllers\Admin\Auth\RegisteredUserController;
use App\Http\Controllers\Admin\Auth\VerifyEmailController;
use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\CenterController;
use App\Http\Controllers\Admin\ConfigDictionaryController;
use App\Http\Controllers\Admin\ContactUsController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DocumentGenerationController;
use App\Http\Controllers\Admin\DocumentTemplateController;
use App\Http\Controllers\Admin\ExamController;
use App\Http\Controllers\Admin\FooterLinkController;
use App\Http\Controllers\Admin\FooterPartnerLogoController;
use App\Http\Controllers\Admin\LicenseController;
use App\Http\Controllers\Admin\NoticeController;
use App\Http\Controllers\Admin\PasswordUpdateController;
use App\Http\Controllers\Admin\ProfileUpdateController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\ResultController;
use App\Http\Controllers\Admin\SessionController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\SponsorController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\SubadminController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\TranslationController;
use App\Http\Controllers\Admin\UpazilaStoreController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WhatappLinkController;
use App\Http\Controllers\Admin\YoutubeVideoController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])
        ->middleware('auth:admin');

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('auth:admin')
        ->name('dashboard');

    /*    Route::get('/slider', [SliderController::class, 'index'])
            ->middleware('auth:admin')
            ->name('slide.index');

        Route::get('/slider/create', [SliderController::class, 'create'])
            ->middleware('auth:admin')
            ->name('slide.create');*/

    //    Route::get('/register', [RegisteredUserController::class, 'create'])
    //        ->middleware('guest:admin')
    //        ->name('register');

    //    Route::post('/register', [RegisteredUserController::class, 'store'])
    //        ->middleware('guest:admin');

    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
        ->middleware('guest:admin')
        ->name('login');

    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware(['guest:admin', 'throttle:admin-login']);

    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
        ->middleware('guest:admin')
        ->name('password.request');

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware('guest:admin')
        ->name('password.email');

    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
        ->middleware('guest:admin')
        ->name('password.reset');

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->middleware('guest:admin')
        ->name('password.update');

    Route::get('/verify-email', [EmailVerificationPromptController::class, '__invoke'])
        ->middleware('auth:admin')
        ->name('verification.notice');

    Route::get('/verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
        ->middleware(['auth:admin', 'signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware(['auth:admin', 'throttle:6,1'])
        ->name('verification.send');

    Route::get('/confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->middleware('auth:admin')
        ->name('password.confirm');

    Route::post('/confirm-password', [ConfirmablePasswordController::class, 'store'])
        ->middleware('auth:admin');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->middleware('auth:admin')
        ->name('logout');

    Route::post('/userCreate', [DashboardController::class, 'userCreate'])
        ->middleware('auth:admin')
        ->name('userCreate');

    Route::middleware('auth:admin')->group(function () {
        // Common Routes (Admin + Sub-admin)
        Route::middleware(['role:admin|sub_admin'])->group(function () {
            Route::resource('password-update', PasswordUpdateController::class)->only(['create', 'store']);
            Route::resource('profile-update', ProfileUpdateController::class)->only(['create', 'store']);
            
            Route::get('student/export', [StudentController::class, 'exportCsv'])->name('student.export');
            Route::post('student/import', [StudentController::class, 'importCsv'])->name('student.import');
            Route::resource('student', StudentController::class);
            Route::get('admit-card/{id}', [StudentController::class, 'admit'])->name('student.admit');
            Route::get('certificate/{id}', [StudentController::class, 'certificate'])->name('certificateStudent');
            Route::get('without-backgroundcertificate/{id}', [StudentController::class, 'certificateWithoutBackground'])->name('certificateWithoutBackground');
            Route::get('student-registration-form/{id}', [StudentController::class, 'registrationForm'])->name('registrationForm');

            Route::resource('result', ResultController::class)->only(['index', 'create', 'store', 'show']);
        });

        // Super Admin Only Routes
        Route::middleware(['role:admin'])->group(function () {
            Route::resource('user', UserController::class);
            Route::post('subject/ai-suggest', [SubjectController::class, 'aiSuggest'])->name('subject.aiSuggest');
            Route::resource('subject', SubjectController::class)->except(['show']);

            Route::patch('session/{session}/toggle-status', [SessionController::class, 'toggleStatus'])->name('session.toggleStatus');
            Route::resource('session', SessionController::class)->except(['show']);

            Route::resource('exam', ExamController::class);
            Route::resource('question', QuestionController::class);

            Route::resource('document-templates', DocumentTemplateController::class)->except(['show']);
            Route::patch('document-templates/{template}/toggle-status', [DocumentTemplateController::class, 'toggleStatus'])->name('document-templates.toggleStatus');
            Route::post('document-templates/upload-asset', [DocumentTemplateController::class, 'uploadAsset'])->name('document-templates.upload-asset');
            Route::get('document-templates/{id}/preview', [DocumentTemplateController::class, 'preview'])->name('document-templates.preview');
            
            // Registration Review and Diploma Routing
            Route::get('/registration-review', [App\Http\Controllers\Admin\RegistrationReviewController::class, 'index'])->name('registration-review.index');
            Route::post('/registration-review/approve', [App\Http\Controllers\Admin\RegistrationReviewController::class, 'approve'])->name('registration-review.approve');

            Route::resource('/diplomas', App\Http\Controllers\Admin\DiplomaController::class)->only(['index', 'update']);

            // Financial Tracking
            Route::get('/financial', [App\Http\Controllers\Admin\FinancialController::class, 'index'])->name('financial.index');
            Route::post('/financial', [App\Http\Controllers\Admin\FinancialController::class, 'store'])->name('financial.store');
            Route::put('/financial/{payment}', [App\Http\Controllers\Admin\FinancialController::class, 'update'])->name('financial.update');

            // Dynamic Grading Rules
            Route::get('/grade-scales', [App\Http\Controllers\Admin\GradeScaleController::class, 'index'])->name('grade-scales.index');
            Route::put('/grade-scales/{gradeScale}', [App\Http\Controllers\Admin\GradeScaleController::class, 'update'])->name('grade-scales.update');

            Route::get('document-templates/{template_id}/generate/{student_id}', [DocumentGenerationController::class, 'generate'])->name('document-templates.generate');
            Route::post('document-templates/bulk-generate', [DocumentGenerationController::class, 'bulkGenerate'])->name('document-templates.bulk-generate');
            
            // Enterprise Backend PDF Engine Routes
            Route::post('documents/bulk-generate', [App\Http\Controllers\Admin\BulkDocumentController::class, 'bulkGenerate'])->name('documents.bulk-generate');
            Route::get('documents/bulk-status/{jobId}', [App\Http\Controllers\Admin\BulkDocumentController::class, 'bulkProgress'])->name('documents.bulk-status');
            Route::get('documents/bulk-download/{filename}', [App\Http\Controllers\Admin\BulkDocumentController::class, 'bulkDownload'])->name('documents.bulk-download');
            Route::get('documents/render-pdf/{template}/{student}', [App\Http\Controllers\Admin\BulkDocumentController::class, 'renderSingle'])->name('documents.render-pdf');

            // Phase G - Document Verification Routing
            Route::get('student-documents', [App\Http\Controllers\Admin\StudentDocumentController::class, 'index'])->name('student-documents.index');
            Route::post('student-documents/{document}/approve', [App\Http\Controllers\Admin\StudentDocumentController::class, 'approve'])->name('student-documents.approve');
            Route::post('student-documents/{document}/reject', [App\Http\Controllers\Admin\StudentDocumentController::class, 'reject'])->name('student-documents.reject');
            Route::get('student-documents/{document}/view', [App\Http\Controllers\Admin\StudentDocumentController::class, 'view'])->name('student-documents.view');
            
            // Phase G - Advanced Reporting
            Route::get('reports', [App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');
            Route::get('center-risk', [App\Http\Controllers\Admin\CenterRiskController::class, 'index'])->name('center-risk.index');

            Route::resource('slider', SliderController::class);
            Route::get('user/portal/{user}', [UserController::class, 'portal'])->name('user.portal');

            Route::resource('center', CenterController::class);
            Route::patch('center/{center}/status', [CenterController::class, 'updateStatus'])->name('center.updateStatus');
            Route::resource('notice', NoticeController::class);
            Route::resource('adminList', AdminListController::class)->only(['edit', 'update']);
            Route::resource('configDictionary', ConfigDictionaryController::class)->only(['create', 'store']);
            Route::resource('team', TeamController::class);
            Route::get('team-performance', [App\Http\Controllers\Admin\TeamPerformanceController::class, 'index'])->name('team-performance.index');
            Route::post('team-performance/targets', [App\Http\Controllers\Admin\TeamPerformanceController::class, 'store'])->name('team-performance.store');
            Route::resource('sub-admin', SubadminController::class);
            Route::resource('upazila-store', UpazilaStoreController::class);

            Route::get('contactUs', [ContactUsController::class, 'index'])->name('contactUs');
            Route::patch('contactUs/{id}/mark-read', [ContactUsController::class, 'markAsRead'])->name('contactUs.markAsRead');
            Route::post('contactUs/{id}/ai-analyze', [ContactUsController::class, 'aiAnalyze'])->name('contactUs.aiAnalyze');
            Route::delete('contactUs/{id}', [ContactUsController::class, 'destroy'])->name('contactUs.destroy');
            Route::resource('translation', TranslationController::class);
            Route::resource('sponsor', SponsorController::class);
            Route::resource('backup', BackupController::class)->only(['index', 'update']);
            Route::resource('whatapp-link', WhatappLinkController::class);
            Route::resource('youtube-video', YoutubeVideoController::class);
            Route::resource('license', LicenseController::class);
            Route::resource('api-settings', ApiSettingController::class)->only(['index', 'store']);
            Route::resource('payment-gateway', App\Http\Controllers\Admin\PaymentGatewayController::class)->only(['index', 'update']);
            Route::resource('sms-gateway', App\Http\Controllers\Admin\SmsGatewayController::class)->only(['index', 'update']);
            Route::resource('footer-link', FooterLinkController::class);
            Route::resource('footer-logo', FooterPartnerLogoController::class);
        });
    });
});
