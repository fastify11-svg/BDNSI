import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/inertia-react';
import StaffLayout from '../../../Layouts/StaffLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ sessions, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        duration: 6,
        exam_date: '',
        result_published_date: '',
        status: 'Active',
    });

    const openCreateModal = () => {
        setEditingSession(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (sess) => {
        setEditingSession(sess);
        setData({
            name: sess.name || '',
            duration: sess.duration || 6,
            exam_date: sess.exam_date ? sess.exam_date.substring(0, 10) : '',
            result_published_date: sess.result_published_date ? sess.result_published_date.substring(0, 10) : '',
            status: sess.status || 'Active',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSession) {
            put(getUrl(`/staff/sessions/${editingSession.id}`), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(getUrl('/staff/sessions'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this academic session?')) {
            destroy(getUrl(`/staff/sessions/${id}`));
        }
    };

    return (
        <StaffLayout title="Academic Sessions">
            <Head title="Staff Academic Sessions" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">Academic Sessions & Terms</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage session schedules, exam dates, and term durations for student admissions.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-calendar-plus"></i>
                        <span>Create New Session</span>
                    </button>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4">#</th>
                                    <th className="py-3.5 px-4">Session Name</th>
                                    <th className="py-3.5 px-4">Duration</th>
                                    <th className="py-3.5 px-4">Exam Date</th>
                                    <th className="py-3.5 px-4">Result Date</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {sessions?.data?.length > 0 ? (
                                    sessions.data.map((sess, idx) => (
                                        <tr key={sess.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3.5 px-4 text-slate-400 font-mono">
                                                {sessions.from ? sessions.from + idx : idx + 1}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-900">
                                                {sess.name}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono">
                                                {sess.duration} Months ({sess.course_duration_string})
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {sess.exam_date ? new Date(sess.exam_date).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {sess.result_published_date ? new Date(sess.result_published_date).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[10px] border border-emerald-200">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(sess)}
                                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sess.id)}
                                                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg transition"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-slate-400">
                                            No sessions found. Click "Create New Session" to add your first term.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Session Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-extrabold text-slate-900">
                                {editingSession ? 'Edit Academic Session' : 'Create Academic Session'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="font-bold text-slate-700 block mb-1">Session Term Name</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. January - June 2026"
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Duration (Months)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Exam Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={data.exam_date}
                                        onChange={(e) => setData('exam_date', e.target.value)}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700 block mb-1">Result Published Date (Optional)</label>
                                <input
                                    type="date"
                                    value={data.result_published_date}
                                    onChange={(e) => setData('result_published_date', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow"
                                >
                                    {processing ? 'Saving...' : editingSession ? 'Update Session' : 'Save Session'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
