import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ exams }) {
    const { app_url } = usePage().props;
    const examList = exams?.data || exams || [];

    return (
        <AdminLayout title="Exam Management">
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Exam Schedules & Tests</h2>
                        <p className="text-xs text-slate-500">Manage online exam schedules and course tests.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">#ID</th>
                                    <th className="px-6 py-3">Exam Name</th>
                                    <th className="px-6 py-3">Course / Subject</th>
                                    <th className="px-6 py-3">Per MCQ Mark</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {examList.length > 0 ? (
                                    examList.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4 font-semibold text-slate-900">#{exam.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{exam.name}</td>
                                            <td className="px-6 py-4 font-medium text-purple-700">{exam.subject?.name || 'General Course'}</td>
                                            <td className="px-6 py-4 text-slate-600">{exam.per_mcq_mark || 1} Marks</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs border border-emerald-200">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400 text-sm">
                                            No exam records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
