import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function RegistrationReviewIndex({ students, filters = {} }) {
    const { flash } = usePage().props;
    const studentItems = students?.data || [];

    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState([]);
    const [processing, setProcessing] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get(getUrl('/admin/registration-review'), { search }, { preserveState: true });
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(studentItems.map(s => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;
        
        if (confirm(`Are you sure you want to approve ${selectedIds.length} student(s)?`)) {
            setProcessing(true);
            Inertia.post(getUrl('/admin/registration-review/approve'), { student_ids: selectedIds }, {
                onSuccess: () => {
                    setProcessing(false);
                    setSelectedIds([]);
                },
                onError: () => setProcessing(false)
            });
        }
    };

    return (
        <AdminLayout title="Registration Review">
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7024A8]">ONBOARDING & ADMISSION</span>
                        <h2 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight mt-0.5">Registration Review</h2>
                        <p className="text-xs text-slate-500 mt-1">Review and approve new student registrations before they become officially active.</p>
                    </div>
                </div>

                {/* Actions & Filters */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-3">
                        <div className="flex-1 relative min-w-[250px]">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search registrations..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                            />
                        </div>
                        <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition">
                            Search
                        </button>
                    </form>

                    <div className="w-full md:w-auto">
                        <button
                            onClick={handleBulkApprove}
                            disabled={selectedIds.length === 0 || processing}
                            className={`w-full md:w-auto px-6 py-2 rounded-xl text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2 ${
                                selectedIds.length > 0
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                        >
                            <i className="fa-solid fa-check-double"></i>
                            Approve Selected ({selectedIds.length})
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-xs text-left text-slate-600">
                            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-extrabold tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5 w-10 text-center">
                                        <input 
                                            type="checkbox" 
                                            onChange={toggleSelectAll} 
                                            checked={studentItems.length > 0 && selectedIds.length === studentItems.length}
                                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-5 py-3.5">Student Info</th>
                                    <th className="px-5 py-3.5">Registration Info</th>
                                    <th className="px-5 py-3.5">Training Center</th>
                                    <th className="px-5 py-3.5">Session</th>
                                    <th className="px-5 py-3.5 text-right">Review Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {studentItems.length > 0 ? (
                                    studentItems.map((student) => (
                                        <tr key={student.id} className="hover:bg-purple-50/20 transition-colors">
                                            <td className="px-5 py-4 text-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.includes(student.id)}
                                                    onChange={() => toggleSelect(student.id)}
                                                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                                        {student.picture ? (
                                                            <img src={getUrl(student.picture)} className="w-full h-full object-cover" alt="Student" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                <i className="fa-solid fa-user"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-slate-900 text-xs">{student.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{student.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-mono text-xs space-y-0.5">
                                                <p><span className="text-slate-400">Roll:</span> {student.roll}</p>
                                                <p><span className="text-slate-400">Reg:</span> {student.registration}</p>
                                                <p className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 inline-block mt-1 truncate max-w-[150px]">{student.subject?.name}</p>
                                            </td>
                                            <td className="px-5 py-4 max-w-[180px]">
                                                <p className="font-bold text-slate-800 text-[11px] truncate">{student.center?.name}</p>
                                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Code: {student.center?.code}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="font-bold text-slate-700 text-xs">{student.session?.name}</span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="bg-amber-100 text-amber-700 font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider shadow-sm border border-amber-200">
                                                        <i className="fa-solid fa-hourglass-half mr-1"></i> Pending
                                                    </span>
                                                    <Link
                                                        href={getUrl(`/admin/student/${student.id}/edit`)}
                                                        className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold inline-flex items-center justify-center border border-indigo-200 transition shadow-sm"
                                                        title="Edit Student Profile"
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
                                                <i className="fa-solid fa-check-double"></i>
                                            </div>
                                            <p className="text-slate-600 font-bold text-sm">All caught up!</p>
                                            <p className="text-slate-400 text-xs mt-1">No pending registrations found.</p>
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
