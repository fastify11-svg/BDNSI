import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import CenterLayout from '../../../Layouts/CenterLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ students, filters = {} }) {
    const { app_url } = usePage().props;
    const studentList = students?.data || students || [];

    const [search, setSearch] = useState(filters.search || '');
    const [copiedKey, setCopiedKey] = useState('');

    const [activeDocMenuId, setActiveDocMenuId] = useState(null);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveDocMenuId(null);
            }
        };
        const handleScroll = () => {
            if (activeDocMenuId !== null) {
                setActiveDocMenuId(null);
            }
        };
        if (activeDocMenuId !== null) {
            document.addEventListener('mousedown', handleOutsideClick);
            window.addEventListener('scroll', handleScroll, true);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [activeDocMenuId]);

    const toggleDocMenu = (e, studentId) => {
        e.stopPropagation();
        if (activeDocMenuId === studentId) {
            setActiveDocMenuId(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuPos({
                top: rect.bottom + 4,
                left: Math.min(rect.left, window.innerWidth - 180)
            });
            setActiveDocMenuId(studentId);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                Inertia.get(
                    getUrl('/student'),
                    { search: search },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleCopy = (text, key) => {
        if (!text || text === 'N/A') return;
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => {
            setCopiedKey('');
        }, 2000);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this pending student record?')) {
            Inertia.delete(getUrl(`/student/${id}`));
        }
    };

    return (
        <CenterLayout title="Student List">
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Title & Search Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F5233]">CENTER DASHBOARD</span>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">Registered Student Directory</h1>
                        <p className="text-xs text-slate-500 mt-1">Manage registered trainees, print admit cards, registration cards, transcripts, certificates, and ID cards.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name, roll, reg..."
                                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-[#0F5233] outline-none transition"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <i className="fa-solid fa-xmark text-xs"></i>
                                </button>
                            )}
                        </div>

                        <Link
                            href={getUrl('/student/create')}
                            className="bg-[#0F5233] hover:bg-[#0b3d26] text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 w-full sm:w-auto shrink-0"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Add Registration</span>
                        </Link>
                    </div>
                </div>

                {/* Data Table Card */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-xs text-left text-slate-600 min-w-[1000px]">
                            <thead className="text-[11px] text-slate-700 uppercase bg-[#F8F6F1] border-b border-slate-200 font-extrabold whitespace-nowrap tracking-wider">
                                <tr>
                                    <th className="px-5 py-4">#ID</th>
                                    <th className="px-5 py-4">Student Name</th>
                                    <th className="px-5 py-4">Roll & Reg</th>
                                    <th className="px-5 py-4">Course / Subject</th>
                                    <th className="px-5 py-4">Result</th>
                                    <th className="px-5 py-4">Documents</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 whitespace-nowrap font-medium">
                                {studentList.length > 0 ? (
                                    studentList.map((student) => {
                                        const rollVal = student.roll || student.roll_no;
                                        const regVal = student.registration || student.reg_no;
                                        const hasResult = student.result || (student.result_count && student.result_count > 0);

                                        const daysSinceRegistration = Math.floor((new Date() - new Date(student.created_at)) / (1000 * 60 * 60 * 24));
                                        const isPendingResultAlert = !student.result_publised && daysSinceRegistration >= 30;

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-5 py-4 font-mono font-bold text-slate-900">#{student.id}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-1.5 leading-snug">
                                                        <p className="font-extrabold text-slate-900 text-xs">{student.name}</p>
                                                        {isPendingResultAlert && (
                                                            <span title={`Result overdue! Registered ${daysSinceRegistration} days ago.`} className="bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] animate-pulse shrink-0">
                                                                <i className="fa-solid fa-exclamation"></i>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{student.phone || 'No Phone'}</p>
                                                </td>
                                                <td className="px-5 py-4 font-mono text-xs space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-purple-700">Roll: {rollVal || 'N/A'}</span>
                                                        {rollVal && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(rollVal, `roll-${student.id}`)}
                                                                className="text-slate-400 hover:text-purple-700 transition-colors p-1 rounded hover:bg-purple-50"
                                                                title="Copy Roll Number"
                                                            >
                                                                {copiedKey === `roll-${student.id}` ? (
                                                                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                                                        <i className="fa-solid fa-check"></i>
                                                                        <span>Copied</span>
                                                                    </span>
                                                                ) : (
                                                                    <i className="fa-regular fa-copy text-[11px]"></i>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-slate-600">Reg: {regVal || 'N/A'}</span>
                                                        {regVal && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(regVal, `reg-${student.id}`)}
                                                                className="text-slate-400 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50"
                                                                title="Copy Registration Number"
                                                            >
                                                                {copiedKey === `reg-${student.id}` ? (
                                                                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                                                        <i className="fa-solid fa-check"></i>
                                                                        <span>Copied</span>
                                                                    </span>
                                                                ) : (
                                                                    <i className="fa-regular fa-copy text-[11px]"></i>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-xs font-bold text-slate-800 max-w-[180px] truncate" title={student.subject?.name || student.course_name}>
                                                    {student.subject?.name || student.course_name || 'General Course'}
                                                </td>

                                                {/* Result */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    {hasResult || rollVal ? (
                                                        <a
                                                            href={getUrl(`/result?roll=${rollVal || ''}`)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                                                        >
                                                            <i className="fa-solid fa-square-poll-vertical"></i>
                                                            <span>Result</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-400 text-[11px] font-semibold">N/A</span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    {student.can_access_documents === false ? (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                alert('Documents are locked due to pending payment. Please clear the due amount.');
                                                            }}
                                                            className="bg-slate-100 text-slate-400 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 cursor-not-allowed border border-slate-200"
                                                            title="Documents locked due to pending payment"
                                                        >
                                                            <i className="fa-solid fa-lock text-[10px]"></i>
                                                            <span>Locked</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => toggleDocMenu(e, student.id)}
                                                            className="bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                                                        >
                                                            <span>Documents</span>
                                                            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${activeDocMenuId === student.id ? 'rotate-180' : ''}`}></i>
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 flex flex-col gap-1.5 items-start">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                                                        student.status === 1 || student.status === 'Approved' || student.status?.key === 'Approved'
                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                            : 'bg-amber-100 text-amber-800 border-amber-200'
                                                    }`}>
                                                        {student.status === 1 || student.status?.key === 'Approved' ? 'Approved' : 'Pending'}
                                                    </span>
                                                    {parseFloat(student.due_amount) > 0 ? (
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs" title="Payment Due">
                                                            Due: ৳{student.due_amount}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200 shadow-xs" title="Financially Cleared">
                                                            Cleared
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-right space-x-1.5">
                                                    <button
                                                        onClick={() => handleDelete(student.id)}
                                                        className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold border border-rose-200"
                                                        title="Delete Registration"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-slate-400 text-sm">
                                            No student registrations found for this center.
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
                                Showing {students.from || 0} to {students.to || 0} of {students.total || 0} students
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
            {activeDocMenuId !== null && (() => {
                const activeStudent = studentList.find((s) => s.id === activeDocMenuId);
                if (!activeStudent) return null;
                return createPortal(
                    <div
                        ref={menuRef}
                        style={{ position: 'fixed', top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
                        className="z-[99999] w-48 bg-white rounded-md shadow-xl border border-slate-100 flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100"
                    >
                        <a
                            href={getUrl(`/student/${activeStudent.id}?admit=admit`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-id-badge text-rose-500 w-4 text-center"></i>
                            <span>Admit Card</span>
                        </a>
                        <a
                            href={getUrl(`/student/${activeStudent.id}?registration=registration`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-file-lines text-teal-500 w-4 text-center"></i>
                            <span>Reg Card</span>
                        </a>
                        <a
                            href={getUrl(`/student/${activeStudent.id}?transcript=transcript`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-file-invoice text-blue-500 w-4 text-center"></i>
                            <span>Transcript</span>
                        </a>
                        <a
                            href={getUrl(`/student/${activeStudent.id}?certificate=certificate`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-certificate text-purple-500 w-4 text-center"></i>
                            <span>Certificate</span>
                        </a>
                        <a
                            href={getUrl(`/student/${activeStudent.id}?original=original`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-award text-emerald-600 w-4 text-center"></i>
                            <span>Original Certificate</span>
                        </a>
                        <a
                            href={getUrl(`/student/${activeStudent.id}?orginalcpdf=orginalcpdf`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-file-pdf text-indigo-500 w-4 text-center"></i>
                            <span>Original C-Pdf</span>
                        </a>
                        <a
                            href={getUrl(`/student/${activeStudent.id}?cpdf=cpdf`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-regular fa-file-pdf text-emerald-500 w-4 text-center"></i>
                            <span>C-Pdf</span>
                        </a>
                        <a
                            href={getUrl(`/student/${activeStudent.id}?idcard=idcard`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-address-card text-amber-500 w-4 text-center"></i>
                            <span>Id Card</span>
                        </a>
                    </div>,
                    document.body
                );
            })()}
        </CenterLayout>
    );
}
