import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';
import { calculateGPA } from '../../../utils/gradeHelper';

export default function Index({ students = [], centers = [], sessions = [], subjects = [] }) {
    const { app_url, auth } = usePage().props;
    const studentList = students?.data || students || [];
    
    // Parse query params for default filters
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const [filter, setFilter] = useState({
        center: searchParams.get('center') || '',
        session: searchParams.get('session') || '',
        subject: searchParams.get('subject') || ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get(getUrl('/admin/result'), filter, { preserveState: true });
    };

    return (
        <AdminLayout title="Student Examination Results Management">
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Result</h2>
                        <p className="text-xs text-slate-500">View and manage student exam results.</p>
                    </div>
                    <div>
                        <a
                            href={getUrl('/admin/result/create')}
                            className="bg-slate-700 hover:bg-slate-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Create Result</span>
                        </a>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <form onSubmit={handleSearch} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Center <span className="text-rose-500">*</span></label>
                                <select 
                                    required 
                                    name="center" 
                                    value={filter.center}
                                    onChange={e => setFilter({ ...filter, center: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-slate-500"
                                >
                                    <option value="">Select Center</option>
                                    {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Session <span className="text-rose-500">*</span></label>
                                <select 
                                    required 
                                    name="session" 
                                    value={filter.session}
                                    onChange={e => setFilter({ ...filter, session: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-slate-500"
                                >
                                    <option value="">Select Session</option>
                                    {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Subject <span className="text-rose-500">*</span></label>
                                <select 
                                    required 
                                    name="subject" 
                                    value={filter.subject}
                                    onChange={e => setFilter({ ...filter, subject: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-slate-500"
                                >
                                    <option value="">Select Course</option>
                                    {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" 
                                className="bg-slate-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-slate-900 transition shadow-sm text-sm"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200 font-bold">
                                <tr>
                                    <th className="px-4 py-3 border-r border-slate-100">Student</th>
                                    <th className="px-4 py-3 border-r border-slate-100">Roll</th>
                                    <th className="px-4 py-3 border-r border-slate-100">Registration</th>
                                    <th className="px-4 py-3 border-r border-slate-100 text-center">Written</th>
                                    <th className="px-4 py-3 border-r border-slate-100 text-center">Practical</th>
                                    <th className="px-4 py-3 border-r border-slate-100 text-center">Viva</th>
                                    <th className="px-4 py-3 border-r border-slate-100 text-center">C GPA</th>
                                    <th className="px-4 py-3 text-center">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {studentList.length > 0 ? (
                                    studentList.map((st) => {
                                        const w = parseInt(st.result?.written) || 0;
                                        const p = parseInt(st.result?.practical) || 0;
                                        const v = parseInt(st.result?.viva) || 0;
                                        const totalMark = w + p + v;

                                        return (
                                            <tr key={st.id} className="hover:bg-slate-50 transition text-slate-700">
                                                <td className="px-4 py-3 border-r border-slate-100 font-medium">{st.name}</td>
                                                <td className="px-4 py-3 border-r border-slate-100">{st.roll}</td>
                                                <td className="px-4 py-3 border-r border-slate-100">{st.registration}</td>
                                                <td className="px-4 py-3 border-r border-slate-100 w-24 text-center">{w}</td>
                                                <td className="px-4 py-3 border-r border-slate-100 w-24 text-center">{p}</td>
                                                <td className="px-4 py-3 border-r border-slate-100 w-24 text-center">{v}</td>
                                                <td className="px-4 py-3 border-r border-slate-100 text-center font-bold text-slate-900">
                                                    {calculateGPA(totalMark, st.course_type)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {st.result && (
                                                        <a 
                                                            href={getUrl(`/admin/result/${st.result.id}`)} 
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                                            title="View Result"
                                                        >
                                                            <i className="fa-solid fa-eye text-xs"></i>
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center text-slate-400 text-sm italic">
                                            No student records found. Select filter parameters and search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
