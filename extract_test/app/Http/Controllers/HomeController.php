<?php

namespace App\Http\Controllers;

use App\Enums\CenterStatus;
use App\Enums\StudentStatus;
use App\Models\Center;
use App\Models\ContactUs;
use App\Models\License;
use App\Models\Notice;
use App\Models\SiteConfig;
use App\Models\Student;
use App\Models\Subject;
use App\Models\YoutubeVideo;
use App\Services\FrontendDataService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(FrontendDataService $frontendDataService)
    {
        return Inertia::render('Welcome', $frontendDataService->getHomepageData());
    }

    public function verifiedCenter(Request $request)
    {
        $query = Center::where('status', CenterStatus::Approved);
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'LIKE', '%'.$request->search.'%')
                    ->orWhere('code', 'LIKE', '%'.$request->search.'%');
            });
        }
        $centers = $query->latest()->paginate(18);

        if ($centers->isEmpty() && ! $request->search) {
            $centers = Center::latest()->paginate(18);
        }

        return Inertia::render('VerifiedCenter', [
            'centers' => $centers,
            'filters' => $request->only(['search']),
        ]);
    }

    public function successStudent(Request $request)
    {
        $query = Student::where('status', StudentStatus::Approved);
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'LIKE', '%'.$request->search.'%')
                    ->orWhere('roll', 'LIKE', '%'.$request->search.'%');
            });
        }
        $students = $query->latest()->paginate(24);

        if ($students->isEmpty() && ! $request->search) {
            $students = Student::latest()->paginate(24);
        }

        return Inertia::render('SuccessStudent', [
            'students' => $students,
            'filters' => $request->only(['search']),
        ]);
    }

    public function all_course(Request $request)
    {
        $courses = Subject::when($request->course_name, function ($q) use ($request) {
            return $q->where(function ($sub) use ($request) {
                $sub->where('name', 'LIKE', '%'.$request->course_name.'%')
                    ->orWhere('code', 'LIKE', '%'.$request->course_name.'%')
                    ->orWhere('education_qualification', 'LIKE', '%'.$request->course_name.'%');
            });
        })->latest()->paginate(40)->withQueryString();

        return Inertia::render('AllCourse', compact('courses'));
    }

    public function contactUs(Request $request)
    {
        if ($request->isMethod('post')) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:50',
                'subject' => 'nullable|string|max:255',
                'message' => 'required|string',
            ]);

            ContactUs::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'message' => ($validated['subject'] ? '[Subject: '.$validated['subject'].'] ' : '').$validated['message'],
            ]);

            return redirect()->back()->with('success', 'Thank you! Your message has been sent successfully. We will get back to you soon.');
        }

        return Inertia::render('ContactUs');
    }

    public function dynamicPage(Request $request, $type = null)
    {
        $content = '';
        $title = '';

        if ($type === 'terms') {
            $title = 'Terms & Conditions';
            $content = SiteConfig::firstCached()->terms_conditions ?? '';
        } elseif ($type === 'privacy') {
            $title = 'Privacy Policy';
            $content = SiteConfig::firstCached()->privacy_policy ?? '';
        } elseif ($type === 'about') {
            $title = 'About Us';
            $content = SiteConfig::firstCached()->about_full ?? '';
        } else {
            abort(404);
        }

        return Inertia::render('DynamicPage', [
            'title' => $title,
            'content' => $content,
        ]);
    }

    public function frontendNoticeList()
    {
        $notices = Notice::latest()->paginate(15);

        return Inertia::render('NoticeList', compact('notices'));
    }

    public function courseDetails($id)
    {
        $course = Subject::findOrFail($id);
        $related_courses = Subject::where('id', '!=', $id)->latest()->limit(20)->get()->shuffle()->take(4);

        return Inertia::render('CourseDetails', compact('course', 'related_courses'));
    }

    public function instituteDetails($id)
    {
        $institute = Center::findOrFail($id);

        return Inertia::render('InstituteDetails', compact('institute'));
    }

    public function noticeDetails($id)
    {
        $notice = Notice::findOrFail($id);

        return Inertia::render('NoticeDetails', compact('notice'));
    }

    public function license($number = null)
    {
        $data = License::where('license_number', $number)->first();

        return Inertia::render('LicenseView', ['data' => $data]);
    }

    public function videoGallery()
    {
        $videos = YoutubeVideo::where('status', 1)->latest()->paginate(12);

        return Inertia::render('VideoGallery', compact('videos'));
    }
}
