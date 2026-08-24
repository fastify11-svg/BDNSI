<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Center;
use App\Models\ConfigDictionary;
use App\Models\ContactUs;
use App\Models\Exam;
use App\Models\License;
use App\Models\Notice;
use App\Models\Quation;
use App\Models\Subject;
use App\Models\User;
use App\Models\WhatappLink;
use App\Models\YoutubeVideo;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run()
    {
        // 1. Ensure Admins & Users exist
        Admin::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make('12345678'),
            ]
        );

        Admin::firstOrCreate(
            ['email' => 'fastify11@gmail.com'],
            [
                'name' => 'Naeem Hossain',
                'password' => Hash::make('12345678'),
            ]
        );

        $center = Center::firstOrCreate(
            ['email' => 'center@bdnsi.com'],
            [
                'code' => 'BDNSI001',
                'name' => 'BDNSI Main Training Center',
                'owner_name' => 'Director Admin',
                'director_name' => 'Director Admin',
                'mobile' => '01712345678',
                'status' => 1,
                'division' => 1,
                'district' => 1,
                'upazilla' => 1,
            ]
        );

        User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'Demo User',
                'username' => 'demouser',
                'phone' => '01700000001',
                'center_id' => $center->id,
                'password' => Hash::make('12345678'),
            ]
        );

        // 2. Notices
        $notices = [
            [
                'details' => 'Official Notice: Final Vocational & Technical Examination Schedule 2026. All enrolled candidates are hereby notified that the final examinations for all technical diploma courses will commence from August 15, 2026.',
                'bn_details' => 'জরুরী বিজ্ঞপ্তি: কম্পিউটার ও ড্রাইভিং লাইসেন্স পরীক্ষার সময়সূচী প্রকাশিত হয়েছে। আগামী মাসের প্রথম সপ্তাহে প্রাকটিক্যাল পরীক্ষা অনুষ্ঠিত হবে।',
                'ar_details' => 'إشعار رسمي: جدول الامتحانات المهنية لعام 2026',
            ],
            [
                'details' => 'Special Announcement: Registration Open for New Skill Development Batches in Electrical, Mechanical, Welding, and Computer Application.',
                'bn_details' => 'নতুন কারিগরি দক্ষতায় ভর্তির জন্য আবেদনপত্র গ্রহণ চলছে। ইলেকট্রিক্যাল, মেকানিক্যাল ও কম্পিউটার ট্রেনিং কোর্সে ভর্তি হোন।',
                'ar_details' => 'إعلان خاص: التسجيل مفتوح لدفعة المهارات الجديدة',
            ],
        ];

        foreach ($notices as $n) {
            Notice::create($n);
        }

        // 2.5 Subjects (Courses)
        $subject1 = Subject::firstOrCreate(
            ['code' => 'COA101'],
            [
                'name' => 'Computer Office Application',
                'duration' => '6 Months',
                'rate' => 5000,
                'education_qualification' => 'SSC',
                'course_details' => 'Learn Microsoft Office, Excel, PowerPoint and Internet Browsing.',
                'type' => 1,
            ]
        );

        $subject2 = Subject::firstOrCreate(
            ['code' => 'DRV202'],
            [
                'name' => 'Professional Driving & Auto Mechanics',
                'duration' => '3 Months',
                'rate' => 8000,
                'education_qualification' => 'JSC',
                'course_details' => 'Comprehensive driving training with traffic rules and vehicle maintenance.',
                'type' => 1,
            ]
        );

        // 3. Exams & Questions
        $exam1 = Exam::firstOrCreate(
            ['name' => 'Professional Driving & Traffic Regulations Exam 2026'],
            [
                'subject_id' => $subject2->id,
                'per_mcq_mark' => 1,
                'start_time' => Carbon::now(),
                'end_time' => Carbon::now()->addDays(30),
                'status' => 1,
            ]
        );

        $exam2 = Exam::firstOrCreate(
            ['name' => 'Computer Office Application & IT Basics Assessment'],
            [
                'subject_id' => $subject1->id,
                'per_mcq_mark' => 1,
                'start_time' => Carbon::now(),
                'end_time' => Carbon::now()->addDays(30),
                'status' => 1,
            ]
        );

        $questionsExam1 = [
            [
                'exam_id' => $exam1->id,
                'body' => 'ট্রাফিক সিগন্যালে লাল বাতি জ্বেলে থাকার অর্থ কী?',
                'option_1' => 'গাড়ি থামান',
                'option_2' => 'ধীরে চলুন',
                'option_3' => 'গাড়ি চালান',
                'option_4' => 'ডান দিকে ঘুরুন',
                'answer' => 'option_1',
            ],
            [
                'exam_id' => $exam1->id,
                'body' => 'মোটরসাইকেল চালানোর সময় হেলমেট পরিধান করা বাধ্যতামূলক কেন?',
                'option_1' => 'পুলিশের জরিমানা থেকে বাঁচতে',
                'option_2' => 'মাথার সুরক্ষার জন্য',
                'option_3' => 'বাতাস থেকে চোখ রক্ষা করতে',
                'option_4' => 'সৌন্দর্য বৃদ্ধির জন্য',
                'answer' => 'option_2',
            ],
            [
                'exam_id' => $exam1->id,
                'body' => 'রাস্তায় দুই দিকে হলুদ দাগের অর্থ কী?',
                'option_1' => 'ওভারটেকিং সম্পূর্ণ নিষেধ',
                'option_2' => 'ওভারটেক করা যাবে',
                'option_3' => 'পার্কিং করার অনুমতি আছে',
                'option_4' => 'গতি বাড়ানো যাবে',
                'answer' => 'option_1',
            ],
        ];

        foreach ($questionsExam1 as $q) {
            Quation::firstOrCreate(['body' => $q['body']], $q);
        }

        $questionsExam2 = [
            [
                'exam_id' => $exam2->id,
                'body' => 'What is the shortcut key for copying text in MS Word?',
                'option_1' => 'Ctrl + V',
                'option_2' => 'Ctrl + X',
                'option_3' => 'Ctrl + C',
                'option_4' => 'Ctrl + Z',
                'answer' => 'option_3',
            ],
            [
                'exam_id' => $exam2->id,
                'body' => 'Which component is known as the brain of a computer?',
                'option_1' => 'RAM',
                'option_2' => 'Hard Disk',
                'option_3' => 'Central Processing Unit (CPU)',
                'option_4' => 'Power Supply',
                'answer' => 'option_3',
            ],
        ];

        foreach ($questionsExam2 as $q) {
            Quation::firstOrCreate(['body' => $q['body']], $q);
        }

        // 4. Licenses (Driving & Technical Licenses)
        \App\Models\License::create([
            'license_number' => 'BDNSI-DL-2026-001',
            'cnic' => '1995874210364',
            'name' => 'Mohammad Rahim Uddin',
            'father_name' => 'Abdul Jabbar',
            'city' => 'Dhaka',
            'state' => 'Dhaka Division',
            'issue_date' => now(),
            'valid_from' => now(),
            'valid_to' => now()->addYears(5),
            'credential_type' => json_encode(['Motorcycle', 'Light Motor Vehicle (LMV)']),
            'status' => 1
        ]);

        \App\Models\License::create([
            'license_number' => 'BDNSI-DL-2026-002',
            'cnic' => '1992541258741',
            'name' => 'Kamal Hossain',
            'father_name' => 'Jamal Hossain',
            'city' => 'Chattogram',
            'state' => 'Chattogram Division',
            'issue_date' => now(),
            'valid_from' => now(),
            'valid_to' => now()->addYears(3),
            'credential_type' => json_encode(['Heavy Motor Vehicle (HMV)', 'Public Transport']),
            'status' => 1
        ]);

        // 5. YouTube Videos
        $videos = [
            [
                'title' => 'BDNSI Institute Overview & Technical Course Facilities',
                'video_id' => 'dQw4w9WgXcQ',
                'link' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'status' => 1,
            ],
            [
                'title' => 'Practical Driving & Mechanical Workshop Training',
                'video_id' => '3JZ_D3ELwOQ',
                'link' => 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
                'status' => 1,
            ],
        ];

        foreach ($videos as $v) {
            YoutubeVideo::firstOrCreate(['video_id' => $v['video_id']], $v);
        }

        // 6. WhatsApp Links
        WhatappLink::firstOrCreate(
            ['phone' => '+8801700000000'],
            [
                'name' => 'Student Helpdesk WhatsApp Support',
                'description' => 'Official BDNSI WhatsApp Support Desk',
                'status' => 1,
            ]
        );

        // 7. Contact Us Messages
        ContactUs::firstOrCreate(
            ['email' => 'student.inquiry@example.com'],
            [
                'name' => 'Tanvir Hasan',
                'phone' => '01812345678',
                'message' => 'I would like to inquire about the upcoming computer graphics and driving training batch schedules.',
                'is_seen' => 0,
            ]
        );

        // 8. Config Dictionaries
        ConfigDictionary::set('notice', 'বাংলাদেশ জাতীয় দক্ষতা উন্নয়ন ইনস্টিটিউটে আপনাকে স্বাগতম। নতুন ব্যাচের ভর্তি চলছে!');
        ConfigDictionary::set('main_about_us', 'বাংলাদেশ জাতীয় দক্ষতা উন্নয়ন ইনস্টিটিউট (BDNSI) গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত একটি শীর্ষস্থানীয় কারিগরি ও বৃত্তিমূলক প্রশিক্ষণ কেন্দ্র। আমাদের লক্ষ্য হলো তরুণেরা যেন আধুনিক কারিগরি দক্ষতা অর্জন করে দেশে ও বিদেশে সফল ক্যারিয়ার গড়তে পারে।');

        $this->command->info('Demo data populated successfully!');
    }
}
