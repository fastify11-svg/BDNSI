<?php

use App\Http\Controllers\CenterRequestController;
use App\Http\Controllers\CenterTotalResultController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\GeminiOcrController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PasswordUpdateController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\ProfileUpdateController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentSubmissionController;
use App\Models\WhatappLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Session;

Route::get('/health', function () {
    $exitCode = \Illuminate\Support\Facades\Artisan::call('system:health-check');
    if ($exitCode === 0) {
        return response()->json(['status' => 'OK', 'message' => 'All core services are operational.'], 200);
    }
    return response()->json(['status' => 'ERROR', 'message' => 'Active System Health Check FAILED. The system is degraded.'], 503);
});

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('result', ResultController::class)
    ->middleware(['module:toggle_result_verify', 'throttle:results'])
    ->name('result');

Route::get('/', [HomeController::class, 'index'])->name('welcome');
Route::get('/license-view/{number?}', [HomeController::class, 'license'])->name('license.view');
Route::get('/all-course', [HomeController::class, 'all_course'])->name('all_course');
Route::get('/verify', [\App\Http\Controllers\VerifyController::class, 'index'])->name('verify.index');
Route::post('/verify', [\App\Http\Controllers\VerifyController::class, 'check'])->name('verify.check');
Route::get('/course-details/{id}', [HomeController::class, 'courseDetails'])->name('course.details');
Route::get('/institute-details/{id}', [HomeController::class, 'instituteDetails'])->name('institute.details');
Route::get('/page/{type}', [HomeController::class, 'dynamicPage'])->name('dynamicPage');
Route::get('/all-notice-list', [HomeController::class, 'frontendNoticeList'])
    ->middleware('module:toggle_notice_board')
    ->name('frontendNoticeList');
Route::get('/all-notice-list/{id}', [HomeController::class, 'noticeDetails'])
    ->middleware('module:toggle_notice_board')
    ->name('noticeDetails');
Route::get('/video-gallery', [HomeController::class, 'videoGallery'])
    ->middleware('module:toggle_video_gallery')
    ->name('video.gallery');
Route::get('/success-student', [HomeController::class, 'successStudent'])
    ->middleware('module:toggle_success_students')
    ->name('successStudent');
Route::get('/verified-center', [HomeController::class, 'verifiedCenter'])
    ->middleware('module:toggle_verified_centers')
    ->name('verifiedCenter');
Route::get('/verified-institute', [HomeController::class, 'verifiedCenter'])
    ->middleware('module:toggle_verified_centers')
    ->name('verifiedInstitute');

Route::match(['get', 'post'], '/contact-us', [HomeController::class, 'contactUs'])
    ->middleware(['module:toggle_contact_form', 'throttle:contact'])
    ->name('contactUs');

Route::resource('center-request', CenterRequestController::class)
    ->only(['create', 'store'])
    ->middleware(['module:toggle_center_apply', 'throttle:10,1']);

Route::get('/dashboard', DashboardController::class)->middleware(['auth'])->name('dashboard');

Route::get('success-student-details/{id}', [FrontendController::class, 'successStudentDetails'])->middleware('throttle:30,1')->name('successStudentDetails');
Route::get('student-info/{id}', [FrontendController::class, 'studentInfo'])->middleware(['auth', 'throttle:30,1'])->name('studentInfo');

Route::middleware(['auth'])->group(function () {
    Route::resource('student', StudentController::class)->middleware('throttle:20,1');
    Route::resource('student-submission', StudentSubmissionController::class)->only(['create', 'store'])->middleware('throttle:10,1');
    Route::get('center-student-result', CenterTotalResultController::class)->name('centerStudentResult');
    
    // Financial Center Routes (Phase C)
    Route::get('orders', [\App\Http\Controllers\Center\OrderController::class, 'index'])->name('center.orders.index');
    Route::get('orders/{order}', [\App\Http\Controllers\Center\OrderController::class, 'show'])->name('center.orders.show');
    
    // Center Certificates Hub (Phase D)
    Route::get('certificates', [\App\Http\Controllers\Center\CertificateController::class, 'index'])->name('center.certificates.index');
    Route::get('certificates/{student}', [\App\Http\Controllers\Center\CertificateController::class, 'show'])->name('center.certificates.show');

    Route::resource('password-update', PasswordUpdateController::class)->only(['create', 'store']);
    Route::resource('profile-update', ProfileUpdateController::class)->only(['create', 'store']);
});

Route::get('portal/{user}', PortalController::class)->name('portal');

Route::get('whatapp-link/{phone}', function ($phone) {
    $data = WhatappLink::where('phone', $phone)->first();

    return view('frontend.page.whatapplink', [
        'data' => $data,
    ]);
})->middleware('throttle:10,1')->name('whatapp.link');

Route::get('/lang-change', function (Request $request) {
    $locale = $request->input('locale');
    if (in_array($locale, ['en', 'bn', 'ar'])) {
        Session::put('locale', $locale);
        App::setLocale($locale);
    }

    return redirect()->back();
});

use App\Http\Controllers\PaymentController;

Route::prefix('payment')->name('payment.')->group(function () {
    Route::get('checkout', [PaymentController::class, 'checkout'])->name('checkout');
    Route::post('process', [PaymentController::class, 'process'])->name('process');
    Route::post('callback/{gateway}', [PaymentController::class, 'callback'])->name('callback');
    Route::match(['get', 'post'], 'success', [PaymentController::class, 'success'])->name('success');
    Route::match(['get', 'post'], 'failed', [PaymentController::class, 'failed'])->name('failed');
    Route::match(['get', 'post'], 'cancel', [PaymentController::class, 'cancel'])->name('cancel');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/student.php';
require __DIR__.'/staff.php';

Route::post('/gemini/extract-ocr', [GeminiOcrController::class, 'extractData'])->middleware(['throttle:10,1', 'auth:admin'])->name('gemini.ocr');

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
})->middleware('throttle:health')->name('health');


Route::get('/test-500', function() {
    return app(\App\Http\Controllers\Admin\StudentController::class)->create(request());
});

