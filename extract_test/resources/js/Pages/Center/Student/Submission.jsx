import React from 'react';
import { usePage, Link, useForm } from '@inertiajs/inertia-react';
import CenterLayout from '../../../Layouts/CenterLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Submission({ students = [], sessions = [], subjects = [] }) {
    const { app_url } = usePage().props;
    const studentList = students?.data || students || [];

    const { post, processing } = useForm({
        id: studentList.map(s => s.id)
    });

    const handleSubmitAll = (e) => {
        e.preventDefault();
        post(getUrl('/student-submission'));
    };

    return (
        <CenterLayout title="Student Submission">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Submission</h1>
                        <p className="text-xs text-slate-500">Submit pending student applications to admin for official registration approval.</p>
                    </div>
                </div>

                {/* Filter Form */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                    <form method="GET" action={getUrl('/student-submission/create')} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">Session *</label>
                            <select name="session" required className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500">
                                <option value="">Select Session</option>
                                {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">Course / Subject *</label>
                            <select name="subject" required className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500">
                                <option value="">Select Course</option>
                                {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full py-2.5 bg-[#0A182A] hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-md transition">
                                Load Pending Students
                            </button>
                        </div>
                    </form>
                </div>

                {/* Submission Form Table */}
                <form onSubmit={handleSubmitAll} className="space-y-4">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-slate-500 uppercase bg-[#F8F6F1] border-b border-slate-200 whitespace-nowrap">
                                    <tr>
                                        <th className="px-6 py-4 font-extrabold text-slate-700">#ID</th>
                                        <th className="px-6 py-4 font-extrabold text-slate-700">Student Name</th>
                                        <th className="px-6 py-4 font-extrabold text-slate-700">Roll No</th>
                                        <th className="px-6 py-4 font-extrabold text-slate-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 whitespace-nowrap">
                                    {studentList.length > 0 ? (
                                        studentList.map((st) => (
                                            <tr key={st.id} className="hover:bg-slate-50/60 transition">
                                                <td className="px-6 py-4 font-mono font-bold text-slate-900">#{st.id}</td>
                                                <td className="px-6 py-4 font-bold text-slate-900">{st.name}</td>
                                                <td className="px-6 py-4 font-mono text-xs font-bold text-purple-700">
                                                    {st.roll || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-xs">
                                                        Pending Submission
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-sm">
                                                Select session & course above to view students ready for approval submission.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {studentList.length > 0 && (
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 bg-[#0F5233] hover:bg-[#0b3d26] text-white font-extrabold rounded-xl shadow-lg transition text-xs flex items-center gap-2"
                            >
                                <i className="fa-solid fa-paper-plane"></i>
                                <span>Submit All To Admin</span>
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </CenterLayout>
    );
}
