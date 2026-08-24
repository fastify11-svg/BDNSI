import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import StaffLayout from '../../Layouts/StaffLayout';
import { getUrl } from '../../utils/urlHelper';

export default function Dashboard({ staff, metrics, recentStudents, topCourses, monthlyTrends }) {
    const [copied, setCopied] = useState(false);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showSessionModal, setShowSessionModal] = useState(false);

    // Fast Quick Course Form
    const { data: courseData, setData: setCourseData, post: postCourse, processing: courseProcessing, reset: resetCourse, errors: courseErrors } = useForm({
        name: '',
        code: '',
        duration: '6 Months',
        rate: '500',
        education_qualification: 'SSC / Equivalent',
        type: '0',
    });

    // Fast Quick Session Form
    const { data: sessionData, setData: setSessionData, post: postSession, processing: sessionProcessing, reset: resetSession, errors: sessionErrors } = useForm({
        name: '',
        duration: 6,
        exam_date: '',
        result_published_date: '',
    });

    const handleCreateCourse = (e) => {
        e.preventDefault();
        postCourse(getUrl('/staff/courses'), {
            onSuccess: () => {
                setShowCourseModal(false);
                resetCourse();
            }
        });
    };

    const handleCreateSession = (e) => {
        e.preventDefault();
        postSession(getUrl('/staff/sessions'), {
            onSuccess: () => {
                setShowSessionModal(false);
                resetSession();
            }
        });
    };

    const copyReferralLink = () => {
        if (metrics.referral_link) {
            navigator.clipboard.writeText(metrics.referral_link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <StaffLayout title="Staff Operational Dashboard">
            <Head title="Staff Dashboard" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Top Welcome Banner with Smart Referral Engine */}
                <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1528] via-[#14223A] to-[#1E1B4B] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-purple-500/30">
                                <i className="fa-solid fa-bolt text-yellow-400"></i>
                                Authenticated Staff Portal
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                Welcome, {staff.name}!
                            </h1>
                            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                                Manage your customized courses, active academic sessions, enrolled students, and track real-time referral conversions across Bangladesh.
                            </p>
                        </div>

                        {/* Referral Link Quick Widget */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col gap-2.5 min-w-[280px]">
                            <div className="flex items-center justify-between text-[11px] font-bold text-purple-200">
                                <span><i className="fa-solid fa-share-nodes mr-1 text-purple-400"></i> Your Referral Link</span>
                                <span className="bg-purple-500/40 text-white font-mono px-2 py-0.5 rounded text-[10px]">
                                    {metrics.referral_code}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={metrics.referral_link}
                                    className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-xl text-xs font-mono text-purple-100 outline-none select-all"
                                />
                                <button
                                    onClick={copyReferralLink}
                                    type="button"
                                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                                >
                                    <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Today's Enrollments */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-user-clock"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Today's Students</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{metrics.today_students}</h3>
                        </div>
                    </div>

                    {/* Total Students */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-users-gear"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Students</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{metrics.total_students}</h3>
                        </div>
                    </div>

                    {/* My Custom Courses */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-book-bookmark"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">My Courses</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{metrics.total_courses}</h3>
                        </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-calendar-check"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active Sessions</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{metrics.total_sessions}</h3>
                        </div>
                    </div>
                </div>

                {/* Target Performance (Today) */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm mt-6">
                    <h2 className="text-sm font-extrabold text-[#7024A8] uppercase tracking-wide border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-bullseye"></i>
                        <span>Today's Target Performance</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Student Target */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Student Target</p>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        {metrics.today_students} <span className="text-sm font-semibold text-slate-400">/ {metrics.target_students}</span>
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${metrics.today_students >= metrics.target_students && metrics.target_students > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {metrics.target_students > 0 ? Math.min(100, Math.round((metrics.today_students / metrics.target_students) * 100)) : 0}% Achieved
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5">
                                <div className={`h-2.5 rounded-full ${metrics.today_students >= metrics.target_students && metrics.target_students > 0 ? 'bg-emerald-500' : 'bg-[#7024A8]'}`} style={{ width: `${metrics.target_students > 0 ? Math.min(100, Math.round((metrics.today_students / metrics.target_students) * 100)) : 0}%` }}></div>
                            </div>
                        </div>

                        {/* B2B Certificate Target */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">B2B Certificate Target</p>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        0 <span className="text-sm font-semibold text-slate-400">/ {metrics.target_b2b}</span>
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${0 >= metrics.target_b2b && metrics.target_b2b > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {metrics.target_b2b > 0 ? Math.min(100, Math.round((0 / metrics.target_b2b) * 100)) : 0}% Achieved
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5">
                                <div className={`h-2.5 rounded-full ${0 >= metrics.target_b2b && metrics.target_b2b > 0 ? 'bg-emerald-500' : 'bg-[#7024A8]'}`} style={{ width: `${metrics.target_b2b > 0 ? Math.min(100, Math.round((0 / metrics.target_b2b) * 100)) : 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fast Action Quick Tools */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setShowCourseModal(true)}
                        className="px-4 py-2.5 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-2"
                    >
                        <i className="fa-solid fa-plus text-purple-400"></i>
                        <span>+ Add Custom Course</span>
                    </button>
                    <button
                        onClick={() => setShowSessionModal(true)}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-2"
                    >
                        <i className="fa-solid fa-calendar-plus"></i>
                        <span>+ Add Academic Session</span>
                    </button>
                    <Link
                        href={getUrl('/staff/students/create')}
                        className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-2"
                    >
                        <i className="fa-solid fa-user-plus"></i>
                        <span>Enroll Student Under Staff</span>
                    </Link>
                </div>

                {/* Two-Column Breakdown: Recent Registrations & Top Courses */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Recent Students (2 cols) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-900">Recent Student Admissions</h3>
                                <p className="text-[11px] text-slate-400">Your registered & referred students</p>
                            </div>
                            <Link
                                href={getUrl('/staff/students')}
                                className="text-xs font-bold text-purple-600 hover:text-purple-700"
                            >
                                View All ({metrics.total_students}) &rarr;
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100 overflow-x-auto">
                            {recentStudents && recentStudents.length > 0 ? (
                                recentStudents.map((st) => (
                                    <div key={st.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                {st.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 truncate">{st.name}</p>
                                                <p className="text-[10px] text-slate-500 font-mono">
                                                    Roll: {st.roll || 'N/A'} | {st.subject?.name || 'Course'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                st.status === 1 || st.status === 'Approved'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                {st.status === 1 || st.status === 'Approved' ? 'Approved' : 'Pending Review'}
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                {new Date(st.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-xs text-slate-400">
                                    No students admitted under your staff account yet. Click "Enroll Student" to begin.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Top Performing Courses (1 col) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Your Top Courses</h3>
                            <p className="text-[11px] text-slate-400">Ranked by student enrollment</p>
                        </div>
                        <div className="space-y-3">
                            {topCourses && topCourses.length > 0 ? (
                                topCourses.map((c, idx) => (
                                    <div key={c.id} className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                                            <span className="truncate">{idx + 1}. {c.name}</span>
                                            <span className="text-purple-600 font-mono text-[11px] shrink-0">
                                                {c.students_count || 0} students
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, ((c.students_count || 0) / Math.max(1, metrics.total_students)) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-xs text-slate-400">
                                    No custom courses created yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Add Custom Course Modal */}
            {showCourseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-extrabold text-slate-900">Create Custom Staff Course</h3>
                            <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                            <div>
                                <label className="font-bold text-slate-700 block mb-1">Course / Subject Name</label>
                                <input
                                    type="text"
                                    required
                                    value={courseData.name}
                                    onChange={(e) => setCourseData('name', e.target.value)}
                                    placeholder="e.g. Diploma in Graphic Design"
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value={courseData.duration}
                                        onChange={(e) => setCourseData('duration', e.target.value)}
                                        placeholder="e.g. 6 Months"
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Fee Rate (BDT)</label>
                                    <input
                                        type="number"
                                        required
                                        value={courseData.rate}
                                        onChange={(e) => setCourseData('rate', e.target.value)}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-mono"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCourseModal(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={courseProcessing}
                                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow"
                                >
                                    {courseProcessing ? 'Saving...' : 'Save Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Quick Add Custom Session Modal */}
            {showSessionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-extrabold text-slate-900">Create Academic Session</h3>
                            <button onClick={() => setShowSessionModal(false)} className="text-slate-400 hover:text-slate-600">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
                            <div>
                                <label className="font-bold text-slate-700 block mb-1">Session Term Name</label>
                                <input
                                    type="text"
                                    required
                                    value={sessionData.name}
                                    onChange={(e) => setSessionData('name', e.target.value)}
                                    placeholder="e.g. Jan-Jun 2026"
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Duration (Months)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={sessionData.duration}
                                        onChange={(e) => setSessionData('duration', e.target.value)}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Exam Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={sessionData.exam_date}
                                        onChange={(e) => setSessionData('exam_date', e.target.value)}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowSessionModal(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sessionProcessing}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow"
                                >
                                    {sessionProcessing ? 'Saving...' : 'Save Session'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
