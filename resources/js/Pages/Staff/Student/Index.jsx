import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import StaffLayout from '../../../Layouts/StaffLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ students, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');

    const { delete: destroy } = useForm();

    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = getUrl(`/staff/students?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this student registration?')) {
            destroy(getUrl(`/staff/students/${id}`));
        }
    };

    return (
        <StaffLayout title="Student Admissions Directory">
            <Head title="Staff Student Admissions" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">Admitted Students</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage student profiles, verify documents, and generate digital certificates.
                        </p>
                    </div>
                    <Link
                        href={getUrl('/staff/students/create')}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-user-plus"></i>
                        <span>Enroll New Student</span>
                    </Link>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by student name, roll, reg, or mobile number..."
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-purple-500"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-bold text-slate-700 focus:border-purple-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="1">Approved</option>
                            <option value="0">Pending Review</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition shadow"
                        >
                            Filter
                        </button>
                    </form>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4">Student</th>
                                    <th className="py-3.5 px-4">Roll / Reg</th>
                                    <th className="py-3.5 px-4">Course & Session</th>
                                    <th className="py-3.5 px-4">Mobile</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {students?.data?.length > 0 ? (
                                    students.data.map((st) => (
                                        <tr key={st.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={st.picture ? getUrl(st.picture) : getUrl('/images/avatar.png')}
                                                        alt={st.name}
                                                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-slate-900">{st.name}</p>
                                                        <p className="text-[10px] text-slate-400">F: {st.fathers_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                                                <div>Roll: {st.roll || '—'}</div>
                                                <div className="text-[10px] text-slate-400 font-normal">Reg: {st.registration || '—'}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <p className="font-bold text-slate-800">{st.subject?.name || '—'}</p>
                                                <p className="text-[10px] text-slate-400">{st.session?.name || '—'}</p>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-slate-600">
                                                {st.phone || '—'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    st.status === 1 || st.status === 'Approved'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {st.status === 1 || st.status === 'Approved' ? 'Approved' : 'Pending Review'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right space-x-2">
                                                <Link
                                                    href={getUrl(`/staff/students/${st.id}`)}
                                                    className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg transition inline-flex items-center gap-1"
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                    <span>View</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(st.id)}
                                                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg transition"
                                                >
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-400">
                                            No students found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
