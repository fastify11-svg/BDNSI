import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function DiplomaIndex({ students, filters = {} }) {
    const { flash, errors } = usePage().props;
    const studentItems = students?.data || [];

    const [search, setSearch] = useState(filters.search || '');
    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [diplomaSerial, setDiplomaSerial] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get(getUrl('/admin/diplomas'), { search }, { preserveState: true });
    };

    const openIssueModal = (student) => {
        setSelectedStudent(student);
        setDiplomaSerial(student.result?.certificate || '');
        setIssueModalOpen(true);
    };

    const closeIssueModal = () => {
        setIssueModalOpen(false);
        setSelectedStudent(null);
        setDiplomaSerial('');
    };

    const handleIssueSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        Inertia.post(getUrl(`/admin/diplomas/${selectedStudent.id}/issue`), { diploma_serial: diplomaSerial }, {
            onSuccess: () => {
                setProcessing(false);
                closeIssueModal();
            },
            onError: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <AdminLayout title="Issue Skill-Based Diplomas">
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7024A8]">ACADEMIC CREDENTIALS</span>
                        <h2 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight mt-0.5">Skill-Based Diplomas</h2>
                        <p className="text-xs text-slate-500 mt-1">Issue and manage official diplomas for students completing Diploma level courses.</p>
                    </div>
                </div>

                {/* Filter / Search */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by Registration, Roll or Name..."
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                            />
                        </div>
                        <button type="submit" className="bg-[#7024A8] hover:bg-purple-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition">
                            Search
                        </button>
                    </form>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-xs text-left text-slate-600">
                            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-extrabold tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Student Info</th>
                                    <th className="px-5 py-3.5">Roll & Reg</th>
                                    <th className="px-5 py-3.5">Training Center</th>
                                    <th className="px-5 py-3.5">Result Grade</th>
                                    <th className="px-5 py-3.5">Diploma Status</th>
                                    <th className="px-5 py-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {studentItems.length > 0 ? (
                                    studentItems.map((student) => (
                                        <tr key={student.id} className="hover:bg-purple-50/20 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="font-extrabold text-slate-900 text-xs">{student.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{student.subject?.name}</p>
                                            </td>
                                            <td className="px-5 py-4 font-mono text-xs space-y-0.5">
                                                <p><span className="text-slate-400">Roll:</span> {student.roll}</p>
                                                <p><span className="text-slate-400">Reg:</span> {student.registration}</p>
                                            </td>
                                            <td className="px-5 py-4 max-w-[200px]">
                                                <p className="font-bold text-slate-800 text-[11px] truncate">{student.center?.name}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-md text-[11px]">
                                                    Passed
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {student.result?.certificate ? (
                                                    <div>
                                                        <span className="bg-purple-100 text-[#7024A8] font-bold px-2 py-1 rounded-md text-[10px] uppercase tracking-wider block w-max mb-1">Issued</span>
                                                        <span className="text-[10px] font-mono font-semibold">ID: {student.result.certificate}</span>
                                                    </div>
                                                ) : (
                                                    <span className="bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-md text-[10px] uppercase tracking-wider">Pending Issuance</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => openIssueModal(student)}
                                                    className="bg-purple-50 text-[#7024A8] hover:bg-[#7024A8] hover:text-white border border-purple-200 transition font-bold px-3 py-1.5 rounded-lg text-[11px] shadow-sm flex items-center gap-1.5 ml-auto"
                                                >
                                                    <i className="fa-solid fa-award"></i>
                                                    {student.result?.certificate ? 'Update Diploma' : 'Issue Diploma'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10 text-slate-400 text-sm font-semibold">
                                            No eligible diploma students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Issue Modal */}
            {issueModalOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-black text-slate-900">Issue Diploma</h3>
                                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Assign a serial number for {selectedStudent.name}</p>
                            </div>
                            <button onClick={closeIssueModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition">
                                <i className="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>
                        <form onSubmit={handleIssueSubmit} className="p-5 space-y-4">
                            {errors?.diploma_serial && (
                                <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
                                    <i className="fa-solid fa-triangle-exclamation mr-1"></i> {errors.diploma_serial}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Diploma Serial / Certificate ID <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={diplomaSerial}
                                    onChange={(e) => setDiplomaSerial(e.target.value)}
                                    placeholder="e.g. DIP-2026-001"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-[#7024A8] hover:bg-[#581C87] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2"
                            >
                                {processing ? 'Processing...' : 'Confirm Issuance'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
