import React, { useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';
import { getUrl } from '../utils/urlHelper';

export default function CourseDetails({ course, related_courses = [] }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [copied, setCopied] = useState(false);

    const stripHtml = (html) => {
        if (!html) return '';
        return String(html).replace(/<[^>]*>?/gm, '').trim();
    };

    if (!course) {
        return (
            <FrontendLayout>
                <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                    <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Course Not Found</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">The course you are looking for might have been removed, renamed, or is temporarily unavailable.</p>
                    <Link href={getUrl('/all-course')} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7024A8] to-purple-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                        <i className="fa-solid fa-arrow-left"></i> Back to All Courses
                    </Link>
                </div>
            </FrontendLayout>
        );
    }

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const courseDetailsText = course.course_details || course.description || 'This course offers comprehensive, hands-on training designed in alignment with national skill qualification standards. Students will gain practical expertise in modern tools and techniques required by the current job market.';

    return (
        <FrontendLayout>
            {/* Hero Banner Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white py-16 px-4 overflow-hidden border-b border-purple-900/50">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-pink-600/15 blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10 space-y-4">
                    <nav className="flex items-center gap-2 text-xs md:text-sm text-purple-300">
                        <Link href={getUrl('/')} className="hover:text-white transition">Home</Link>
                        <span><i className="fa-solid fa-chevron-right text-[10px] text-purple-400"></i></span>
                        <Link href={getUrl('/all-course')} className="hover:text-white transition">Courses</Link>
                        <span><i className="fa-solid fa-chevron-right text-[10px] text-purple-400"></i></span>
                        <span className="text-white font-medium truncate max-w-[200px] md:max-w-none">{course.name}</span>
                    </nav>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                            <i className="fa-solid fa-circle-check"></i> Govt. Approved / BTEB Verified
                        </span>
                        {course.code && (
                            <span className="bg-purple-800/80 border border-purple-600/50 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full">
                                Code: <strong className="text-white">{course.code}</strong>
                            </span>
                        )}
                        <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                            <i className="fa-solid fa-star text-amber-400"></i> 4.9 (High Student Satisfaction)
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
                        {course.name}
                    </h1>

                    <p className="text-purple-200 text-sm md:text-base max-w-3xl line-clamp-2">
                        {stripHtml(courseDetailsText)}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-purple-200 border-t border-purple-800/60 max-w-3xl">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-800/80 flex items-center justify-center text-purple-300">
                                <i className="fa-solid fa-clock"></i>
                            </div>
                            <div>
                                <span className="block text-[11px] text-purple-300 uppercase font-semibold">Duration</span>
                                <strong className="text-white font-bold">{course.duration || '3 Months'}</strong>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-800/80 flex items-center justify-center text-purple-300">
                                <i className="fa-solid fa-graduation-cap"></i>
                            </div>
                            <div>
                                <span className="block text-[11px] text-purple-300 uppercase font-semibold">Eligibility</span>
                                <strong className="text-white font-bold">{course.education_qualification || 'HSC / Equivalent'}</strong>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-800/80 flex items-center justify-center text-purple-300">
                                <i className="fa-solid fa-laptop-code"></i>
                            </div>
                            <div>
                                <span className="block text-[11px] text-purple-300 uppercase font-semibold">Training Mode</span>
                                <strong className="text-white font-bold">Practical Lab & Campus</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content & Sidebar Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left 2 Columns: Detailed Information */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Course Thumbnail Image */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 group">
                        <div className="relative h-72 md:h-96 w-full overflow-hidden bg-slate-100">
                            <img
                                src={getUrl(course.photo || course.image)}
                                alt={course.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { e.target.src = getUrl('/images/about.jpg'); }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end text-white">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-md mb-2 inline-block shadow">
                                        Professional Skill Course
                                    </span>
                                    <h3 className="text-xl font-bold">{course.name}</h3>
                                </div>
                                <button 
                                    onClick={handleShare}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-white/30 transition shadow-lg"
                                >
                                    <i className={`fa-solid ${copied ? 'fa-check text-emerald-400' : 'fa-share-nodes'}`}></i>
                                    {copied ? 'Copied Link!' : 'Share'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Tab Navigation */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
                        <div className="flex border-b border-gray-200 gap-6 overflow-x-auto pb-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`pb-3 font-bold text-sm md:text-base whitespace-nowrap transition border-b-2 flex items-center gap-2 ${
                                    activeTab === 'overview'
                                        ? 'border-[#7024A8] text-[#7024A8]'
                                        : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                <i className="fa-solid fa-file-lines"></i> Course Overview & Syllabus
                            </button>
                            <button
                                onClick={() => setActiveTab('benefits')}
                                className={`pb-3 font-bold text-sm md:text-base whitespace-nowrap transition border-b-2 flex items-center gap-2 ${
                                    activeTab === 'benefits'
                                        ? 'border-[#7024A8] text-[#7024A8]'
                                        : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                <i className="fa-solid fa-gem"></i> Why Choose This Course?
                            </button>
                            <button
                                onClick={() => setActiveTab('eligibility')}
                                className={`pb-3 font-bold text-sm md:text-base whitespace-nowrap transition border-b-2 flex items-center gap-2 ${
                                    activeTab === 'eligibility'
                                        ? 'border-[#7024A8] text-[#7024A8]'
                                        : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                <i className="fa-solid fa-user-check"></i> Eligibility & Admission
                            </button>
                        </div>

                        {/* Tab 1: Overview */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <i className="fa-solid fa-circle-info text-[#7024A8]"></i> Comprehensive Curriculum
                                    </h3>
                                    {/<[a-z][\s\S]*>/i.test(courseDetailsText) ? (
                                        <div 
                                            className="text-gray-700 text-sm md:text-base leading-relaxed bg-purple-50/40 p-6 rounded-2xl border border-purple-100/60 shadow-sm overflow-hidden"
                                            dangerouslySetInnerHTML={{ __html: courseDetailsText }}
                                        />
                                    ) : (
                                        <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line bg-purple-50/40 p-6 rounded-2xl border border-purple-100/60 shadow-sm">
                                            {courseDetailsText}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7024A8] flex items-center justify-center font-bold text-lg shrink-0">
                                            <i className="fa-solid fa-laptop"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">100% Practical Lab Training</h4>
                                            <p className="text-xs text-gray-500 mt-1">Every student gets an individual computer workstation with modern software tools.</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
                                            <i className="fa-solid fa-certificate"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Govt. Recognized Diploma</h4>
                                            <p className="text-xs text-gray-500 mt-1">Certificate verifiable online through BTEB / Institute result portal for lifetime.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Benefits */}
                        {activeTab === 'benefits' && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Exclusive Benefits You Get:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { title: 'Industry-Standard Syllabus', desc: 'Updated curriculum matching present corporate & freelancing demands.', icon: 'fa-book-open', color: 'text-blue-600 bg-blue-100' },
                                        { title: 'Expert & Certified Trainers', desc: 'Classes conducted by highly experienced professionals.', icon: 'fa-chalkboard-user', color: 'text-purple-600 bg-purple-100' },
                                        { title: 'Special Backup Classes', desc: 'Missed a class? Get backup sessions & video tutorials for revision.', icon: 'fa-video', color: 'text-amber-600 bg-amber-100' },
                                        { title: 'Career & Placement Guidance', desc: 'Special guidance on job preparation and freelancing marketplaces.', icon: 'fa-briefcase', color: 'text-emerald-600 bg-emerald-100' },
                                        { title: 'Modern IT Lab Infrastructure', desc: 'Air-conditioned labs with high-speed internet & power backup.', icon: 'fa-building', color: 'text-rose-600 bg-rose-100' },
                                        { title: 'Lifetime Support Network', desc: 'Get continuous post-training assistance and community guidance.', icon: 'fa-handshake-angle', color: 'text-teal-600 bg-teal-100' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-4 rounded-2xl border border-gray-100 hover:border-purple-200 transition bg-white shadow-sm flex items-start gap-3.5">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                                <i className={`fa-solid ${item.icon}`}></i>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Eligibility */}
                        {activeTab === 'eligibility' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl space-y-3 shadow-md">
                                    <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Required Qualification
                                    </span>
                                    <h4 className="text-2xl font-extrabold">{course.education_qualification || 'HSC / Equivalent or Above'}</h4>
                                    <p className="text-xs md:text-sm text-purple-200">
                                        Anyone passionate about learning modern skills and boosting their career prospects is welcome to apply.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 text-base">Who Should Enroll in this Course?</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                                        {[
                                            { label: 'Students & Freshers', icon: 'fa-user-graduate', bg: 'bg-indigo-50 text-indigo-700' },
                                            { label: 'Job Seekers', icon: 'fa-magnifying-glass-chart', bg: 'bg-emerald-50 text-emerald-700' },
                                            { label: 'Working Professionals', icon: 'fa-user-tie', bg: 'bg-purple-50 text-purple-700' },
                                            { label: 'Freelancers & Entrepreneurs', icon: 'fa-globe', bg: 'bg-amber-50 text-amber-700' }
                                        ].map((aud, i) => (
                                            <div key={i} className={`p-4 rounded-2xl font-bold text-xs ${aud.bg} border border-current/10 flex flex-col items-center justify-center gap-2`}>
                                                <i className={`fa-solid ${aud.icon} text-lg`}></i>
                                                {aud.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <h4 className="font-bold text-gray-900 text-sm mb-3">Required Documents for Admission:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                                        <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-500 font-bold"></i> 2 Copies of Passport Size Photo</li>
                                        <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-500 font-bold"></i> National ID (NID) or Birth Certificate Copy</li>
                                        <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-500 font-bold"></i> Last Academic Certificate / Marksheet Copy</li>
                                        <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-500 font-bold"></i> Completed Admission Form (Available at Campus)</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Sticky Enrollment & Summary Card */}
                <div className="lg:sticky lg:top-8 space-y-6">
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-purple-100 space-y-6 relative overflow-hidden">
                        {/* Top Gradient Border */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#7024A8] via-pink-500 to-indigo-600"></div>

                        {/* Fee Section */}
                        <div className="text-center bg-gradient-to-b from-purple-50/80 to-white p-6 rounded-2xl border border-purple-100/80 shadow-inner">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#7024A8] block mb-1">
                                Course Fee / Training Rate
                            </span>
                            <div className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                {course.rate || course.course_fee ? (
                                    <span className="text-[#7024A8]"><i className="fa-solid fa-bangladeshi-taka-sign"></i> {course.rate || course.course_fee}</span>
                                ) : (
                                    <span className="text-emerald-600 text-2xl">Contact for Fee</span>
                                )}
                            </div>
                            <span className="inline-block mt-2 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                                <i className="fa-solid fa-tags"></i> Installment & Special Subsidy Available
                            </span>
                        </div>

                        {/* Summary List */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
                                Course Specifications
                            </h4>
                            <div className="space-y-3 text-xs md:text-sm">
                                <div className="flex justify-between items-center py-1 border-b border-gray-50">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <i className="fa-solid fa-barcode text-purple-600 w-4"></i> Course Code:
                                    </span>
                                    <span className="font-bold text-gray-900 bg-slate-100 px-2.5 py-0.5 rounded font-mono">
                                        {course.code || 'BDNSI-C'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-gray-50">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <i className="fa-regular fa-clock text-purple-600 w-4"></i> Duration:
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        {course.duration || '3 Months'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-gray-50">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <i className="fa-solid fa-user-graduate text-purple-600 w-4"></i> Qualification:
                                    </span>
                                    <span className="font-bold text-gray-900 truncate max-w-[150px]" title={course.education_qualification || 'HSC / Equivalent'}>
                                        {course.education_qualification || 'HSC / Equivalent'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-gray-50">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <i className="fa-solid fa-shield-halved text-emerald-600 w-4"></i> Approval:
                                    </span>
                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                                        Govt. Verified
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <Link
                                href={getUrl(`/contact-us?course=${encodeURIComponent(course.name)}`)}
                                className="w-full block text-center py-4 bg-gradient-to-r from-[#7024A8] to-purple-800 hover:from-purple-800 hover:to-indigo-900 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-200 text-sm md:text-base flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-paper-plane"></i> Apply / Enroll Now
                            </Link>

                            <Link
                                href={getUrl('/result')}
                                className="w-full block text-center py-3 bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold rounded-2xl transition text-xs md:text-sm flex items-center justify-center gap-2 border border-slate-200"
                            >
                                <i className="fa-solid fa-square-check text-[#7024A8]"></i> Verify Certificate / Result
                            </Link>
                        </div>

                        {/* Help Desk Note */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center space-y-1">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">Need Admission Help?</span>
                            <p className="text-xs text-gray-700 font-medium">
                                Call our Admission Desk or visit campus directly for counseling.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Courses Section */}
            {related_courses && related_courses.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#7024A8] block mb-1">Explore More</span>
                            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">Other Recommended Courses</h3>
                        </div>
                        <Link href={getUrl('/all-course')} className="text-sm font-bold text-[#7024A8] hover:underline flex items-center gap-1">
                            View All Courses <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {related_courses.map((rel, idx) => (
                            <Link 
                                key={idx} 
                                href={getUrl(`/course-details/${rel.id}`)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group hover:-translate-y-1"
                            >
                                <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                                    <img 
                                        src={getUrl(rel.photo || rel.image)} 
                                        alt={rel.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = getUrl('/images/about.jpg'); }}
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-purple-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow backdrop-blur-sm">
                                            {rel.code || 'BDNSI'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base line-clamp-2 group-hover:text-[#7024A8] transition">
                                            {rel.name}
                                        </h4>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                        <span className="text-gray-500 font-medium flex items-center gap-1">
                                            <i className="fa-regular fa-clock text-[#7024A8]"></i> {rel.duration || '3 Months'}
                                        </span>
                                        <span className="font-extrabold text-[#7024A8] text-sm">
                                            {rel.rate ? <><i className="fa-solid fa-bangladeshi-taka-sign"></i> {rel.rate}</> : 'Fee Available'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </FrontendLayout>
    );
}
