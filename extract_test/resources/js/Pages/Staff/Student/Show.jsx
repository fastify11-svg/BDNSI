import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import StaffLayout from '../../../Layouts/StaffLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Show({ student }) {
    return (
        <StaffLayout title={`Student: ${student.name}`}>
            <Head title={`Student Profile - ${student.name}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">{student.name}</h2>
                        <p className="text-xs text-slate-500 font-mono">
                            Roll: {student.roll || 'N/A'} | Registration: {student.registration || 'N/A'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={getUrl('/staff/documents')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-print"></i>
                            <span>Print Documents</span>
                        </Link>
                        <Link
                            href={getUrl('/staff/students')}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                        >
                            &larr; Back
                        </Link>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Avatar & Key Badges */}
                    <div className="flex flex-col items-center justify-center text-center space-y-3 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0">
                        <img
                            src={student.picture ? getUrl(student.picture) : getUrl('/images/avatar.png')}
                            alt={student.name}
                            className="w-32 h-32 rounded-2xl object-cover border-4 border-slate-100 shadow"
                        />
                        <div>
                            <h3 className="font-extrabold text-slate-900 text-base">{student.name}</h3>
                            <p className="text-xs text-slate-400 font-mono">{student.phone}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            student.status === 1 || student.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                            {student.status === 1 || student.status === 'Approved' ? 'Approved Student' : 'Pending Review'}
                        </span>
                    </div>

                    {/* Right: Academic & Personal Details */}
                    <div className="md:col-span-2 space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                            <div>
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Enrolled Course</p>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">{student.subject?.name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Session Term</p>
                                <p className="text-sm font-bold text-slate-900 mt-0.5">{student.session?.name || '—'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                            <div>
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Father's Name</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.fathers_name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Mother's Name</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.mothers_name || '—'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-100">
                            <div>
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Gender</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.gender || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Religion</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.religion || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Date of Birth</p>
                                <p className="font-semibold text-slate-800 mt-0.5">{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : '—'}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Address</p>
                            <p className="font-semibold text-slate-800 mt-0.5">{student.present_address || 'Dhaka, Bangladesh'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
