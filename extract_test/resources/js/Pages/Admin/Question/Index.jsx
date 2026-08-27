import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ questions }) {
    const { app_url } = usePage().props;
    const questionList = questions?.data || questions || [];

    return (
        <AdminLayout title="MCQ Question Bank Management">
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">MCQ Question Bank</h2>
                        <p className="text-xs text-slate-500">Manage exam questions and multiple choice answers.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">#ID</th>
                                    <th className="px-6 py-3">Question Body</th>
                                    <th className="px-6 py-3">Exam Name</th>
                                    <th className="px-6 py-3">Correct Answer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {questionList.length > 0 ? (
                                    questionList.map((q) => (
                                        <tr key={q.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4 font-semibold text-slate-900">#{q.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800 line-clamp-2">{q.body}</td>
                                            <td className="px-6 py-4 text-purple-700 font-medium">{q.exam?.name || 'General Exam'}</td>
                                            <td className="px-6 py-4 font-extrabold text-emerald-600">Option #{q.answer || 1}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm">
                                            No questions found in question bank.
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
