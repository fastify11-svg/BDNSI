import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import StudentLayout from '../../Layouts/StudentLayout';
import { getUrl } from '../../utils/urlHelper';

export default function Results({ student, result, semesterResults }) {
    return (
        <StudentLayout title="Academic Results & Transcript">
            <Head title="Academic Results & Marksheet" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Action Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-200">
                            <i className="fa-solid fa-graduation-cap"></i>
                            Official Academic Record
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                            Academic Transcript & GPA
                        </h2>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                            {student.name} &bull; Roll: {student.roll || 'N/A'} &bull; Reg: {student.registration || 'N/A'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={getUrl('/students/marksheet')}
                            target="_blank"
                            rel="noreferrer"
                            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                        >
                            <i className="fa-solid fa-print"></i>
                            <span>Print Marksheet</span>
                        </a>
                        <Link
                            href={getUrl('/verify')}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                        >
                            Public Verification &rarr;
                        </Link>
                    </div>
                </div>

                {/* Main GPA / Result Summary */}
                {result ? (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center space-y-1">
                                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">Calculated GPA</span>
                                <div className="text-3xl font-black text-emerald-800 font-mono">{result.gpa || '4.00'}</div>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Total Marks</span>
                                <div className="text-3xl font-black text-slate-900 font-mono">{result.marks || '—'}</div>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Letter Grade</span>
                                <div className="text-3xl font-black text-purple-700 font-mono">{result.grade || 'A+'}</div>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Academic Status</span>
                                <div className="text-base font-black text-emerald-700 mt-2">Passed / Published</div>
                            </div>
                        </div>

                        {/* Semester Breakdown Table (If available) */}
                        {semesterResults && semesterResults.length > 0 && (
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <h3 className="font-extrabold text-sm text-slate-900">Semester Mark Breakdown</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-extrabold text-[10px]">
                                            <tr>
                                                <th className="py-3 px-4">Semester</th>
                                                <th className="py-3 px-4">Marks Obtained</th>
                                                <th className="py-3 px-4">Grade Point</th>
                                                <th className="py-3 px-4">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                            {semesterResults.map((sr, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/80">
                                                    <td className="py-3 px-4 font-bold text-slate-900">{sr.semester_name || `Semester ${idx + 1}`}</td>
                                                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{sr.marks || '—'}</td>
                                                    <td className="py-3 px-4 font-mono text-emerald-600 font-bold">{sr.gpa || '—'}</td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold rounded-md text-[10px]">
                                                            {sr.grade || 'A+'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                            <i className="fa-solid fa-hourglass-half"></i>
                        </div>
                        <div className="space-y-1 max-w-sm mx-auto">
                            <h3 className="font-extrabold text-base text-slate-800">Result Awaiting Publication</h3>
                            <p className="text-xs text-slate-500">
                                Your semester results and marks are being processed by the Board Examination Controller.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
