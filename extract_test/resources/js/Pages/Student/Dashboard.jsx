import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import StudentLayout from '../../Layouts/StudentLayout';
import { getUrl } from '../../utils/urlHelper';

export default function Dashboard({ student, result, semesterResults, notices }) {
    const isPaid = student.payment_status === 'Paid' || student.due_amount <= 0;

    return (
        <StudentLayout title="Student Academic Workspace">
            <Head title="Student Dashboard" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Top Profile Card Banner */}
                <div className="bg-gradient-to-r from-[#0B1528] via-[#14223A] to-[#064E3B] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                            <img
                                src={student.picture ? getUrl(student.picture) : getUrl('/images/avatar.png')}
                                alt={student.name}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-emerald-500/40 shadow-xl"
                            />
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-500/30">
                                    <i className="fa-solid fa-circle-check text-emerald-400"></i>
                                    {student.status === 1 || student.status === 'Approved' ? 'Approved Student' : 'Pending Verification'}
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{student.name}</h1>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono text-slate-300">
                                    <span className="bg-white/10 px-2.5 py-1 rounded-lg">Roll: {student.roll || 'N/A'}</span>
                                    <span className="bg-white/10 px-2.5 py-1 rounded-lg">Reg: {student.registration || 'N/A'}</span>
                                    <span className="text-emerald-400 font-sans font-bold">Center: {student.center?.name || 'BDNSI'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Document Action Buttons */}
                        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                            <a
                                href={getUrl('/students/id-card')}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-id-card"></i>
                                <span>Print Digital ID Card</span>
                            </a>
                            <a
                                href={getUrl('/students/admit-card')}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 border border-white/20"
                            >
                                <i className="fa-solid fa-ticket"></i>
                                <span>Download Admit Card</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3-Column Key Metric Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Course & Session Tile */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Enrolled Course</span>
                            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
                                <i className="fa-solid fa-book-open"></i>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                                {student.subject?.name || 'General Training'}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono mt-1">
                                Code: {student.subject?.code || 'N/A'} &bull; {student.session?.name || 'Active Session'}
                            </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                            <span>Duration:</span>
                            <span className="font-bold text-slate-900">{student.course_duration || '6 Months'}</span>
                        </div>
                    </div>

                    {/* Financial Clearance Tile */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Payment Clearance</span>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                <i className="fa-solid fa-receipt"></i>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {isPaid ? 'Fees Cleared' : 'Payment Due'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-mono mt-2">
                                Paid: BDT {Number(student.paid_amount || 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                            <span>Due Balance:</span>
                            <span className="font-bold font-mono text-rose-600">BDT {Number(student.due_amount || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Academic Performance / GPA Tile */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Academic Status</span>
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
                                <i className="fa-solid fa-award"></i>
                            </div>
                        </div>
                        <div>
                            {result ? (
                                <div className="space-y-1">
                                    <div className="text-2xl font-black text-emerald-600 font-mono">
                                        GPA {result.gpa || 'Published'}
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Total Marks: <span className="font-bold text-slate-800">{result.marks || '—'}</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-slate-700">Course In Progress</h4>
                                    <p className="text-xs text-slate-400">Exam result pending publication</p>
                                </div>
                            )}
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <Link href={getUrl('/students/results')} className="text-purple-600 hover:text-purple-700 font-bold">
                                View Marksheet &rarr;
                            </Link>
                            <Link href={getUrl('/verify')} className="text-slate-500 hover:text-slate-700 font-medium">
                                Public Verification
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Self-Service Digital Document Hub Grid */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900">Self-Service Document Center</h2>
                            <p className="text-xs text-slate-500">Official digital credentials generated directly from the BDNSI server</p>
                        </div>
                        <Link href={getUrl('/students/documents')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                            Explore All &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* ID Card */}
                        <a
                            href={getUrl('/students/id-card')}
                            target="_blank"
                            rel="noreferrer"
                            className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base group-hover:scale-110 transition">
                                <i className="fa-solid fa-id-card"></i>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-slate-900">Student ID Card</h4>
                                <p className="text-[11px] text-slate-500 mt-1">Official photo identification card with center authorization</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                <span>Print ID Card</span>
                                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </span>
                        </a>

                        {/* Admit Card */}
                        <a
                            href={getUrl('/students/admit-card')}
                            target="_blank"
                            rel="noreferrer"
                            className="p-5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-base group-hover:scale-110 transition">
                                <i className="fa-solid fa-ticket"></i>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-slate-900">Exam Admit Card</h4>
                                <p className="text-[11px] text-slate-500 mt-1">Exam hall entry pass with cryptographic QR code</p>
                            </div>
                            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                                <span>Print Admit Card</span>
                                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </span>
                        </a>

                        {/* Registration Card */}
                        <a
                            href={getUrl('/students/registration-card')}
                            target="_blank"
                            rel="noreferrer"
                            className="p-5 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between space-y-4 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-base group-hover:scale-110 transition">
                                <i className="fa-solid fa-address-card"></i>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-slate-900">Registration Card</h4>
                                <p className="text-[11px] text-slate-500 mt-1">Permanent student registration slip with subject details</p>
                            </div>
                            <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                                <span>Print Registration</span>
                                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </span>
                        </a>

                        {/* Marksheet / Transcript */}
                        <a
                            href={getUrl('/students/marksheet')}
                            target="_blank"
                            rel="noreferrer"
                            className="p-5 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition-all flex flex-col justify-between space-y-4 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-base group-hover:scale-110 transition">
                                <i className="fa-solid fa-file-lines"></i>
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-slate-900">Marksheet Transcript</h4>
                                <p className="text-[11px] text-slate-500 mt-1">Official semester marks transcript and academic breakdown</p>
                            </div>
                            <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                                <span>Print Marksheet</span>
                                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
