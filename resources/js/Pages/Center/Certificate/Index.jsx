import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import CenterLayout from '../../../Layouts/CenterLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ students, filters = {} }) {
    const { app_url } = usePage().props;
    const studentList = students?.data || students || [];
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                Inertia.get(
                    getUrl('/certificates'),
                    { search: search },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <CenterLayout title="Certificates">
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Title & Search Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F5233]">CENTER DASHBOARD</span>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">Certificates Hub</h1>
                        <p className="text-xs text-slate-500 mt-1">Download and print certificates for your academically passed and financially cleared students.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, roll, reg..."
                                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F5233] outline-none transition"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <i className="fa-solid fa-xmark text-xs"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Table Card */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-xs text-left text-slate-600 min-w-[900px]">
                            <thead className="text-[11px] text-slate-700 uppercase bg-[#F8F6F1] border-b border-slate-200 font-extrabold whitespace-nowrap tracking-wider">
                                <tr>
                                    <th className="px-5 py-4">#ID</th>
                                    <th className="px-5 py-4">Student Name</th>
                                    <th className="px-5 py-4">Roll & Reg</th>
                                    <th className="px-5 py-4">Course / Session</th>
                                    <th className="px-5 py-4 text-center">Status</th>
                                    <th className="px-5 py-4 text-right">Certificate Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 whitespace-nowrap font-medium">
                                {studentList.length > 0 ? (
                                    studentList.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-5 py-4 font-mono font-bold text-slate-900">#{student.id}</td>
                                            <td className="px-5 py-4 font-extrabold text-slate-900">{student.name}</td>
                                            <td className="px-5 py-4 font-mono text-xs">
                                                <div className="text-purple-700 font-bold">Roll: {student.roll}</div>
                                                <div className="text-slate-500">Reg: {student.registration}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-800">{student.subject?.name || 'N/A'}</div>
                                                <div className="text-slate-500 text-[10px]">{student.session?.name || 'N/A'}</div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                {student.is_cleared ? (
                                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold">
                                                        <i className="fa-solid fa-check-circle mr-1"></i> Cleared
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-[10px] font-bold" title="Payment Due">
                                                        <i className="fa-solid fa-lock mr-1"></i> Locked
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                {student.is_cleared ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <a
                                                            href={getUrl(`/certificates/${student.id}`)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 border border-purple-200"
                                                        >
                                                            <i className="fa-solid fa-certificate"></i> Download
                                                        </a>
                                                        <a
                                                            href={getUrl(`/certificates/${student.id}?original=original`)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 border border-emerald-200"
                                                        >
                                                            <i className="fa-solid fa-award"></i> Original
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <Link
                                                        href={getUrl('/orders')}
                                                        className="bg-slate-100 text-slate-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 px-3 py-1.5 rounded-lg text-[11px] font-bold transition border border-slate-200 inline-flex items-center gap-1.5"
                                                    >
                                                        <span>Pay Invoice</span>
                                                        <i className="fa-solid fa-arrow-right"></i>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-sm">
                                            No eligible students found. Only students with published results appear here.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {students?.links && students.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <span className="text-slate-500 font-medium font-mono">
                                Showing {students.from || 0} to {students.to || 0} of {students.total || 0} records
                            </span>
                            <div className="flex items-center gap-1 flex-wrap">
                                {students.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url ? getUrl(link.url) : '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg font-bold transition ${
                                            link.active
                                                ? 'bg-[#0F5233] text-white shadow-xs'
                                                : link.url
                                                ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                                : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CenterLayout>
    );
}
