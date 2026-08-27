import React, { useState, useEffect } from 'react';
import { usePage, useForm, Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ sessions }) {
    const { app_url } = usePage().props;
    const sessionList = sessions?.data || sessions || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        duration: '',
        exam_date: '',
        result_published_date: '',
        status: 1
    });

    // Auto-parse session names
    useEffect(() => {
        if (!editingSession && data.name) {
            parseSessionName(data.name);
        }
    }, [data.name]);

    const parseSessionName = (nameStr) => {
        let name = nameStr.toLowerCase().trim().replace(/ - /g, ' to ').replace(/-/g, ' to ').replace(/\s{2,}/g, ' ');
        
        const months = {
            'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'mar': 3, 'march': 3,
            'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6, 'jul': 7, 'july': 7,
            'aug': 8, 'august': 8, 'sep': 9, 'september': 9, 'oct': 10, 'october': 10,
            'nov': 11, 'november': 11, 'dec': 12, 'december': 12,
        };

        let startMonth = 1, startYear = null, endMonth = 12, endYear = null;

        // Clean up days from the string (e.g. "03 jun 2009" -> "jun 2009")
        name = name.replace(/\b\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/g, '$1');

        let match;
        // Format: 2002 to 2004
        if ((match = name.match(/^(\d{4})\s*to\s*(\d{4})$/))) {
            startYear = parseInt(match[1]); endYear = parseInt(match[2]);
        } 
        // Format: Jan to Jun 2024
        else if ((match = name.match(/^([a-z]+)\s*to\s*([a-z]+)\s*(\d{4})$/))) {
            if (months[match[1]] && months[match[2]]) {
                startMonth = months[match[1]]; endMonth = months[match[2]];
                startYear = parseInt(match[3]); endYear = parseInt(match[3]);
            }
        } 
        // Format: Jan 2024 to Jun 2025 or Jan 2024 Jun 2025
        else if ((match = name.match(/^([a-z]+)\s*(\d{4})(?:\s*to\s*|\s+)([a-z]+)\s*(\d{4})$/))) {
            if (months[match[1]] && months[match[3]]) {
                startMonth = months[match[1]]; startYear = parseInt(match[2]);
                endMonth = months[match[3]]; endYear = parseInt(match[4]);
            }
        } 
        // Format: 2023 Jul to 2026 Jun
        else if ((match = name.match(/^(\d{4})\s*([a-z]+)\s*to\s*(\d{4})\s*([a-z]+)$/))) {
            if (months[match[2]] && months[match[4]]) {
                startYear = parseInt(match[1]); startMonth = months[match[2]];
                endYear = parseInt(match[3]); endMonth = months[match[4]];
            }
        } 
        // Format: Jan 2024 to continuing
        else if ((match = name.match(/^([a-z]+)\s*(\d{4})\s*to\s*continuing$/))) {
            if (months[match[1]]) {
                startMonth = months[match[1]]; startYear = parseInt(match[2]);
                const now = new Date();
                endMonth = now.getMonth() + 1; endYear = now.getFullYear();
            }
        }

        if (startYear !== null && endYear !== null) {
            let duration = ((endYear - startYear) * 12) + (endMonth - startMonth) + 1;
            
            // Adjust to standard durations
            if (duration === 5 || duration === 7) duration = 6;
            if (duration === 11 || duration === 13) duration = 12;
            if (duration === 23 || duration === 25) duration = 24;
            if (duration === 35 || duration === 37) duration = 36;
            if (duration === 47 || duration === 49) duration = 48;

            const examDate = `${endYear}-${String(endMonth).padStart(2, '0')}-20`;
            
            let resMonth = endMonth + 1;
            let resYear = endYear;
            if (resMonth > 12) {
                resMonth = 1;
                resYear += 1;
            }
            const resDate = `${resYear}-${String(resMonth).padStart(2, '0')}-20`;

            setData(prevData => ({
                ...prevData,
                duration: duration,
                exam_date: examDate,
                result_published_date: resDate
            }));
        }
    };

    const handleOpenModal = (session = null) => {
        if (session) {
            setEditingSession(session);
            setData({
                name: session.name || '',
                duration: session.duration || '',
                exam_date: session.exam_date || '',
                result_published_date: session.result_published_date || '',
                status: session.status !== undefined ? session.status : 1
            });
        } else {
            setEditingSession(null);
            reset();
            setData('status', 1);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSession(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingSession) {
            put(getUrl(`/admin/session/${editingSession.id}`), {
                onSuccess: () => handleCloseModal(),
            });
        } else {
            post(getUrl('/admin/session'), {
                onSuccess: () => handleCloseModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
            destroy(getUrl(`/admin/session/${id}`));
        }
    };

    const handleToggleStatus = (id, currentStatus) => {
        // Toggle the status in the backend directly without reloading
        axios.patch(getUrl(`/admin/session/${id}/toggle-status`))
            .then(res => {
                // Update local state for immediate feedback
                if (res.data.message) {
                    const updatedSessions = [...sessions.data];
                    const index = updatedSessions.findIndex(s => s.id === id);
                    if (index !== -1) {
                        updatedSessions[index].status = res.data.status;
                        // For Inertia we shouldn't directly mutate props, but since we are doing a background update, we can force a soft reload
                        Inertia.reload({ only: ['sessions'] });
                    }
                }
            })
            .catch(err => console.error(err));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-GB', options);
    };

    return (
        <AdminLayout title="Academic Session Management">
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Academic Sessions</h2>
                        <p className="text-xs text-slate-500">Manage student academic sessions and year terms.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Add New Session</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">#ID</th>
                                    <th className="px-6 py-3">Session Name</th>
                                    <th className="px-6 py-3">Duration (Months)</th>
                                    <th className="px-6 py-3">Exam Date</th>
                                    <th className="px-6 py-3">Result Published Date</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sessionList.length > 0 ? (
                                    sessionList.map((session) => (
                                        <tr key={session.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4 font-semibold text-slate-900">#{session.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{session.name}</td>
                                            <td className="px-6 py-4">
                                                {session.duration ? (
                                                    <span className="text-slate-700 font-medium">
                                                        <i className="fa-regular fa-clock text-indigo-400 mr-1"></i>
                                                        {session.course_duration_string}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">Not Set</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {session.exam_date ? (
                                                    <span className="text-slate-700">
                                                        <i className="fa-regular fa-calendar-check text-indigo-400 mr-1"></i>
                                                        {formatDate(session.exam_date)}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">Not Set</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {session.result_published_date ? (
                                                    <span className="text-slate-700">
                                                        <i className="fa-regular fa-file-lines text-emerald-400 mr-1"></i>
                                                        {formatDate(session.result_published_date)}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">Not Set</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(session.id, session.status)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                                                        session.status == 1 ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200'
                                                    }`}
                                                    title="Click to Toggle Status"
                                                >
                                                    {session.status == 1 ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(session)}
                                                        className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center border border-indigo-100 shadow-sm"
                                                        title="Edit"
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(session.id)}
                                                        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center border border-rose-100 shadow-sm"
                                                        title="Delete"
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-slate-400 text-sm">
                                            No session records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {sessions?.links && sessions.links.length > 3 && (
                    <div className="flex justify-center mt-6">
                        <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            {sessions.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ? getUrl(link.url) : '#'}
                                    className={`px-4 py-2 text-sm border-r border-slate-200 last:border-r-0 ${
                                        link.active ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInDown">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editingSession ? 'Edit Session' : 'Add New Session'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-rose-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Session Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. 2023-2024 or Jan-Jun 2024"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.name && <p className="text-[11px] text-rose-500 font-semibold">{errors.name}</p>}
                            </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Duration (Months) <span className="text-rose-500">*</span></label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                        placeholder="e.g. 3 or 6"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                    />
                                    {errors.duration && <p className="text-[11px] text-rose-500 font-semibold">{errors.duration}</p>}
                                </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Exam Date</label>
                                    <input
                                        type="date"
                                        value={data.exam_date}
                                        onChange={e => setData('exam_date', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition text-slate-600"
                                    />
                                    {errors.exam_date && <p className="text-[11px] text-rose-500 font-semibold">{errors.exam_date}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Result Published Date</label>
                                    <input
                                        type="date"
                                        value={data.result_published_date}
                                        onChange={e => setData('result_published_date', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition text-slate-600"
                                    />
                                    {errors.result_published_date && <p className="text-[11px] text-rose-500 font-semibold">{errors.result_published_date}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {editingSession && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700">Status <span className="text-rose-500">*</span></label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition text-slate-700"
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                        {errors.status && <p className="text-[11px] text-rose-500 font-semibold">{errors.status}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {processing && <i className="fa-solid fa-circle-notch fa-spin"></i>}
                                    <span>{editingSession ? 'Update Session' : 'Save Session'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
