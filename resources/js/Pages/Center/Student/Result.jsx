import React from 'react';
import { usePage, Link } from '@inertiajs/inertia-react';
import CenterLayout from '../../../Layouts/CenterLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Result({ students = [], sessions = [], subjects = [] }) {
    const { app_url } = usePage().props;
    const studentList = students?.data || students || [];

    return (
        <CenterLayout title="Student Result">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Result</h1>
                        <p className="text-xs text-slate-500">Filter and view student examination marks and certification results.</p>
                    </div>
                </div>

                {/* Filter Form Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                    <form method="GET" action={getUrl('/center-student-result')} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">Session *</label>
                            <select name="session_id" required className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500">
                                <option value="">Select Session</option>
                                {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">Course / Subject *</label>
                            <select name="subject_id" required className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500">
                                <option value="">Select Course</option>
                                {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full py-2.5 bg-[#0A182A] hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-md transition">
                                Filter Results
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-[#F8F6F1] border-b border-slate-200 whitespace-nowrap">
                                <tr>
                                    <th className="px-6 py-4 font-extrabold text-slate-700">#ID</th>
                                    <th className="px-6 py-4 font-extrabold text-slate-700">Student Name</th>
                                    <th className="px-6 py-4 font-extrabold text-slate-700">Roll & Reg</th>
                                    <th className="px-6 py-4 font-extrabold text-slate-700">Marks / Grade</th>
                                    <th className="px-6 py-4 font-extrabold text-slate-700 text-right">Result Link</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 whitespace-nowrap">
                                {studentList.length > 0 ? (
                                    studentList.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50/60 transition">
                                            <td className="px-6 py-4 font-mono font-bold text-slate-900">#{student.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                                            <td className="px-6 py-4 font-mono text-xs text-purple-700 font-bold">
                                                Roll: {student.roll || 'N/A'}
                                            </td>
                                            {student.result_error ? (
                                                <td colSpan="2" className="px-6 py-4">
                                                    <div className="flex items-center justify-between px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-bold">
                                                        <div className="flex items-center gap-2">
                                                            <i className="fa-solid fa-lock"></i>
                                                            <span>Payment Due: Result access is restricted until payment is settled.</span>
                                                        </div>
                                                        <Link href={getUrl('/orders')} className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[10px] shadow-sm transition">
                                                            Pay Invoice
                                                        </Link>
                                                    </div>
                                                </td>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 font-extrabold text-emerald-600">
                                                        {student.result?.gpa || student.result?.grade || 'Passed (A+)'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <a
                                                            href={getUrl(`/result?roll=${student.roll}`)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200 inline-flex items-center gap-1"
                                                        >
                                                            <i className="fa-solid fa-graduation-cap"></i>
                                                            <span>View Result</span>
                                                        </a>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">
                                            Select session and course filter parameters to view student results.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CenterLayout>
    );
}
