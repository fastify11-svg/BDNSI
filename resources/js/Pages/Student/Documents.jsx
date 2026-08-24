import React from 'react';
import { Head } from '@inertiajs/inertia-react';
import StudentLayout from '../../Layouts/StudentLayout';
import { getUrl } from '../../utils/urlHelper';

export default function Documents({ student }) {
    const documents = [
        {
            title: 'Student Digital ID Card',
            desc: 'Official identification badge with student photograph, roll number, registration ID, and center code.',
            icon: 'fa-id-card',
            color: 'from-emerald-500 to-teal-600',
            bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            url: '/students/id-card',
            actionText: 'Print Digital ID Card',
        },
        {
            title: 'Examination Admit Card',
            desc: 'Official hall ticket required for entering the term-end and final board examinations with cryptographic QR verification.',
            icon: 'fa-ticket',
            color: 'from-indigo-500 to-blue-600',
            bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            url: '/students/admit-card',
            actionText: 'Generate Admit Card',
        },
        {
            title: 'Student Registration Card',
            desc: 'Permanent board registration record specifying course title, duration, center affiliation, and personal biodata.',
            icon: 'fa-address-card',
            color: 'from-purple-500 to-indigo-600',
            bgLight: 'bg-purple-50 text-purple-700 border-purple-200',
            url: '/students/registration-card',
            actionText: 'Print Registration Slip',
        },
        {
            title: 'Academic Marksheet & Transcript',
            desc: 'Complete academic transcript detailing subject marks, GPA, overall grading, and official controller verification.',
            icon: 'fa-file-lines',
            color: 'from-amber-500 to-orange-600',
            bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
            url: '/students/marksheet',
            actionText: 'Download Marksheet',
        },
    ];

    return (
        <StudentLayout title="Digital Document Center">
            <Head title="Student Document Center" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Banner */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-200">
                            <i className="fa-solid fa-stamp"></i>
                            Official Self-Service Documents
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                            Digital Credentials & Printable Cards
                        </h2>
                        <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                            Generate and print your authorized student identification, exam entry admit cards, registration slips, and academic transcripts in high resolution.
                        </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono shrink-0">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Student Credentials</p>
                        <p className="text-slate-900 font-bold mt-1">{student.name}</p>
                        <p className="text-slate-500 text-[11px]">Roll: {student.roll} &bull; Reg: {student.registration}</p>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {documents.map((doc, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-all"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${doc.color} text-white flex items-center justify-center text-xl shadow-md`}>
                                        <i className={`fa-solid ${doc.icon}`}></i>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${doc.bgLight}`}>
                                        Verified
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900">{doc.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{doc.desc}</p>
                                </div>
                            </div>

                            <a
                                href={getUrl(doc.url)}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-3 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <i className="fa-solid fa-print"></i>
                                <span>{doc.actionText}</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </StudentLayout>
    );
}
