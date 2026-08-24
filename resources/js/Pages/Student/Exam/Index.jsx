import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import StudentLayout from '../../../Layouts/StudentLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ alldata }) {
    return (
        <StudentLayout title="Online Examination">
            <Head title="Online Exam" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                    <h1 className="text-2xl font-black text-slate-900">Academic Examination System</h1>
                    <p className="text-slate-500 mt-2">Access your course exams and assessments here.</p>
                </div>

                {alldata ? (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{alldata.title || alldata.name || 'Current Exam'}</h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Duration: {alldata.duration || 60} Minutes
                                </p>
                            </div>
                            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                Pending
                            </span>
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                className="px-6 py-2.5 bg-[#7024A8] hover:bg-purple-800 text-white font-extrabold text-sm rounded-xl shadow transition"
                            >
                                Start Exam
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                            <i className="fa-solid fa-calendar-xmark"></i>
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No Exam Scheduled</h3>
                        <p className="text-slate-500 mt-2 max-w-md mx-auto">
                            There are currently no active exams scheduled for your enrolled course. Check back later or contact your center administrator.
                        </p>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
