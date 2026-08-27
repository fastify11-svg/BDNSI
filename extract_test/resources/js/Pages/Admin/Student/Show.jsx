import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Show({ student }) {

    const rollVal = student.roll || student.roll_no;
    const regVal = student.registration || student.reg_no;
    const { errors, flash } = usePage().props;

    const daysSinceRegistration = Math.floor((new Date() - new Date(student.created_at)) / (1000 * 60 * 60 * 24));
    const isPendingResultAlert = !student.result_publised && daysSinceRegistration >= 30;

    const getStatusBadge = (st) => {
        if (st === 2 || st === 'Approved') {
            return <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Approved</span>;
        }
        if (st === 1 || st === 'Requested') {
            return <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">Requested</span>;
        }
        if (st === 0 || st === 'Pending') {
            return <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">Pending</span>;
        }
        return <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>;
    };

    return (
        <AdminLayout title={`Student Details - ${student.name}`}>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <img
                            src={student.picture || student.photo ? getUrl(student.picture || student.photo) : getUrl('/images/avatar.png')}
                            alt={student.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-purple-100 shadow-md shrink-0"
                            onError={(e) => { e.target.src = getUrl('/images/avatar.png'); }}
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-slate-900">{student.name}</h1>
                                {getStatusBadge(student.status)}
                            </div>
                            <p className="text-xs font-mono text-slate-500 mt-1">
                                Roll: <span className="font-bold text-[#7024A8]">{rollVal || 'N/A'}</span> | Reg: <span className="font-bold text-slate-700">{regVal || 'N/A'}</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Mobile: {student.phone || 'No Phone Number'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={getUrl(`/admin/student/${student.id}/edit`)}
                            className="px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-extrabold rounded-xl text-xs transition flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                            <span>Edit Student</span>
                        </Link>
                        <Link
                            href={getUrl('/admin/student')}
                            className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-extrabold rounded-xl text-xs transition"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>

                {/* Document Downloads Panel */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-3">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Document Actions & Downloads</h3>
                    <div className="flex flex-wrap gap-2">
                        {/* Admit Card */}
                        <a
                            href={getUrl(`/admin/admit-card/${student.id}`)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-id-badge"></i>
                            <span>Admit Card</span>
                        </a>

                        {/* Reg Card */}
                        <a
                            href={getUrl(`/admin/student/${student.id}?registration=registration`)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-600 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-id-card"></i>
                            <span>Registration Card</span>
                        </a>

                        {/* Transcript */}
                        <a
                            href={getUrl(`/admin/student/${student.id}?transcript=transcript`)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-file-invoice"></i>
                            <span>Transcript</span>
                        </a>

                        {/* Certificate */}
                        <a
                            href={getUrl(`/admin/certificate/${student.id}?certificate=certificate`)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-600 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-award"></i>
                            <span>Certificate</span>
                        </a>

                        {/* Original Certificate */}
                        <a
                            href={getUrl(`/admin/certificate/${student.id}?original=original`)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-[#7024A8]/10 text-[#7024A8] border border-[#7024A8]/20 hover:bg-[#7024A8] hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-certificate"></i>
                            <span>Original Certificate</span>
                        </a>

                        {/* OrginalC-Pdf */}
                        <a
                            href={getUrl(`/admin/student/${student.id}?orginalcpdf=orginalcpdf`)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-file-pdf"></i>
                            <span>Original C-Pdf</span>
                        </a>

                        {/* C-Pdf */}
                        <a
                            href={getUrl(`/admin/student/${student.id}?cpdf=cpdf`)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-file-pdf"></i>
                            <span>Certificate PDF</span>
                        </a>

                        {/* Id Card */}
                        <a
                            href={getUrl(`/admin/student/${student.id}?idcard=idcard`)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold px-3 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-600 hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-address-card"></i>
                            <span>ID Card</span>
                        </a>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Academic & Center Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2 text-[#7024A8] pb-2 border-b border-slate-100">
                            <i className="fa-solid fa-school text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">Institute & Course Info</h3>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Institute / Center:</span>
                                <span className="font-bold text-slate-900 text-right">{student.center?.name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Center Code:</span>
                                <span className="font-mono font-bold text-purple-700">CODE: {student.center?.code || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Course Name:</span>
                                <span className="font-bold text-slate-900">{student.subject?.name || student.course_name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Academic Session:</span>
                                <span className="font-bold text-slate-800">{student.session?.name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Course Duration:</span>
                                <span className="font-bold text-slate-800">{student.course_duration || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Qualification:</span>
                                <span className="font-bold text-slate-800">{student.qualification || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Personal Details */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2 text-[#7024A8] pb-2 border-b border-slate-100">
                            <i className="fa-solid fa-user-shield text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">Personal Credentials</h3>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Father's Name:</span>
                                <span className="font-bold text-slate-900">{student.fathers_name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Mother's Name:</span>
                                <span className="font-bold text-slate-900">{student.mothers_name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Date of Birth:</span>
                                <span className="font-mono font-bold text-slate-800">{student.date_of_birth || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">District:</span>
                                <span className="font-bold text-slate-800">{student.present_address || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Upazila:</span>
                                <span className="font-bold text-slate-800">{student.permanent_address || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Passport Number:</span>
                                <span className="font-mono font-bold text-slate-800">{student.passport || 'N/A'}</span>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Financial Data</p>
                                <div className="flex gap-2">
                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                        <span className="text-[10px] text-slate-500 font-semibold block">Paid Amount</span>
                                        <span className="text-emerald-600 font-bold">৳{student.paid_amount || 0}</span>
                                    </div>
                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                        <span className="text-[10px] text-slate-500 font-semibold block">Due Amount</span>
                                        <span className="text-rose-600 font-bold">৳{student.due_amount || 0}</span>
                                    </div>
                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                        <span className="text-[10px] text-slate-500 font-semibold block">Payment Status</span>
                                        <span className={`font-bold ${student.payment_status == 1 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {student.payment_status == 1 ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Timeline Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
                    <div className="flex items-center gap-2 text-[#7024A8] pb-4 border-b border-slate-100 mb-6">
                        <i className="fa-solid fa-timeline text-lg"></i>
                        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">Student Activity Timeline</h3>
                    </div>

                    <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                        
                        {/* Admission Date */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-blue-100 text-blue-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-4 md:ml-0">
                                <i className="fa-solid fa-user-plus text-[10px]"></i>
                            </div>
                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm ml-4 md:ml-0 hover:shadow-md transition">
                                <div className="flex items-center justify-between space-x-2 mb-1">
                                    <div className="font-bold text-slate-900 text-xs">Admission Registered</div>
                                    <time className="font-mono text-[9px] text-slate-400 font-semibold">{new Date(student.created_at).toLocaleDateString()}</time>
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium">Student profile created in the system.</div>
                            </div>
                        </div>

                        {/* Exam Date */}
                        {student.exam_date && (
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-amber-100 text-amber-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-4 md:ml-0">
                                    <i className="fa-regular fa-calendar-check text-[10px]"></i>
                                </div>
                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm ml-4 md:ml-0 hover:shadow-md transition">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-slate-900 text-xs">Exam Scheduled</div>
                                        <time className="font-mono text-[9px] text-slate-400 font-semibold">{new Date(student.exam_date).toLocaleDateString()}</time>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium">Exam date assigned for the course.</div>
                                </div>
                            </div>
                        )}

                        {/* Result Record Added */}
                        {student.result && (
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-purple-100 text-[#7024A8] shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-4 md:ml-0">
                                    <i className="fa-solid fa-file-signature text-[10px]"></i>
                                </div>
                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm ml-4 md:ml-0 hover:shadow-md transition">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-slate-900 text-xs">Result Evaluated</div>
                                        <time className="font-mono text-[9px] text-slate-400 font-semibold">{new Date(student.result.created_at).toLocaleDateString()}</time>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium">Marks were entered into the system.</div>
                                </div>
                            </div>
                        )}

                        {/* Result Published */}
                        {student.result_publised && (
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-emerald-100 text-emerald-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-4 md:ml-0">
                                    <i className="fa-solid fa-square-poll-vertical text-[10px]"></i>
                                </div>
                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm ml-4 md:ml-0 hover:shadow-md transition">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-slate-900 text-xs">Result Published</div>
                                        <time className="font-mono text-[9px] text-slate-400 font-semibold">{new Date(student.result_publised).toLocaleDateString()}</time>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium">Result made visible to the student publicly.</div>
                                </div>
                            </div>
                        )}

                        {/* Overdue Warning */}
                        {isPendingResultAlert && (
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-rose-100 text-rose-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -ml-4 md:ml-0">
                                    <i className="fa-solid fa-triangle-exclamation text-[10px] animate-pulse"></i>
                                </div>
                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-rose-50 p-4 rounded-xl border border-rose-200 shadow-sm ml-4 md:ml-0 hover:shadow-md transition">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-rose-700 text-xs">Result Overdue Warning</div>
                                        <div className="px-2 py-0.5 bg-rose-600 text-white rounded-full font-bold text-[8px] animate-pulse">URGENT</div>
                                    </div>
                                    <div className="text-[10px] text-rose-600 font-medium leading-relaxed">
                                        Registration is {daysSinceRegistration} days old but result is not published yet. 
                                        If it exceeds 45 days, this student record will be auto-deleted by the system.
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
