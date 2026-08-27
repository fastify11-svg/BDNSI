import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/inertia-react';
import StaffLayout from '../../../Layouts/StaffLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ subjects, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        code: '',
        duration: '6 Months',
        rate: '500',
        education_qualification: 'SSC / Equivalent',
        course_details: '',
        type: '0',
    });

    const openCreateModal = () => {
        setEditingSubject(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (sub) => {
        setEditingSubject(sub);
        setData({
            name: sub.name || '',
            code: sub.code || '',
            duration: sub.duration || '',
            rate: sub.rate || '0',
            education_qualification: sub.education_qualification || '',
            course_details: sub.course_details || '',
            type: sub.type?.value !== undefined ? String(sub.type.value) : '0',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSubject) {
            put(getUrl(`/staff/courses/${editingSubject.id}`), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(getUrl('/staff/courses'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this course?')) {
            destroy(getUrl(`/staff/courses/${id}`));
        }
    };

    return (
        <StaffLayout title="My Custom Courses">
            <Head title="Staff Custom Courses" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">Custom Courses Directory</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Create and manage customized courses with unique rates and durations for your student admissions.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Create New Course</span>
                    </button>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4">#</th>
                                    <th className="py-3.5 px-4">Course Name</th>
                                    <th className="py-3.5 px-4">Code</th>
                                    <th className="py-3.5 px-4">Duration</th>
                                    <th className="py-3.5 px-4">Fee Rate</th>
                                    <th className="py-3.5 px-4">Enrolled Students</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {subjects?.data?.length > 0 ? (
                                    subjects.data.map((sub, idx) => (
                                        <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3.5 px-4 text-slate-400 font-mono">
                                                {subjects.from ? subjects.from + idx : idx + 1}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-900">
                                                {sub.name}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-slate-600">
                                                {sub.code || '—'}
                                            </td>
                                            <td className="py-3.5 px-4">{sub.duration || '—'}</td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                                                BDT {Number(sub.rate).toLocaleString()}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md font-bold text-[11px]">
                                                    {sub.students_count || 0} students
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(sub)}
                                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sub.id)}
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
                                            No custom courses found. Click "Create New Course" to add one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Course Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-extrabold text-slate-900">
                                {editingSubject ? 'Edit Custom Course' : 'Create Custom Course'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="font-bold text-slate-700 block mb-1">Course / Subject Name</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Professional Web Development"
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Course Code</label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="e.g. PWD-101"
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                        placeholder="e.g. 6 Months"
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Fee Rate (BDT)</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.rate}
                                        onChange={(e) => setData('rate', e.target.value)}
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 block mb-1">Minimum Qualification</label>
                                    <input
                                        type="text"
                                        value={data.education_qualification}
                                        onChange={(e) => setData('education_qualification', e.target.value)}
                                        placeholder="e.g. SSC / HSC"
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                    />
                                </div>
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
                                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl shadow"
                                >
                                    {processing ? 'Saving...' : editingSubject ? 'Update Course' : 'Save Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
