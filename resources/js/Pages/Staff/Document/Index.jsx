import React, { useState } from 'react';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import StaffLayout from '../../../Layouts/StaffLayout';
import PdfLayoutModal from '../../../Components/Document/PdfLayoutModal';
import BulkProgressModal from '../../../Components/Document/BulkProgressModal';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ templates, students }) {
    const [selectedTemplate, setSelectedTemplate] = useState(templates && templates.length > 0 ? templates[0].id : '');
    const [selectedStudents, setSelectedStudents] = useState([]);
    
    // Modals
    const [layoutModalOpen, setLayoutModalOpen] = useState(false);
    const [activeStudentId, setActiveStudentId] = useState(null);
    const [bulkProgressOpen, setBulkProgressOpen] = useState(false);
    const [currentJobId, setCurrentJobId] = useState(null);

    const handleSelectAll = (e) => {
        if (e.target.checked && students?.data) {
            setSelectedStudents(students.data.map(s => s.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (id) => {
        setSelectedStudents(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleOpenSinglePrint = (studentId) => {
        if (!selectedTemplate) {
            alert('Please select a document template first.');
            return;
        }
        setActiveStudentId(studentId);
        setLayoutModalOpen(true);
    };

    const handleConfirmSinglePrint = ({ format, landscape, scale }) => {
        setLayoutModalOpen(false);
        const url = getUrl(`/admin/documents/render-pdf/${selectedTemplate}/${activeStudentId}?format=${format}&landscape=${landscape}&scale=${scale}`);
        window.open(url, '_blank');
    };

    const handleStartBulkGenerate = async () => {
        if (!selectedTemplate) {
            alert('Please select a document template first.');
            return;
        }
        if (selectedStudents.length === 0) {
            alert('Please select at least one student for bulk generation.');
            return;
        }

        try {
            const res = await axios.post(getUrl('/admin/documents/bulk-generate'), {
                template_id: selectedTemplate,
                student_ids: selectedStudents,
                format: 'A4',
                landscape: false,
            });

            if (res.data.job_id) {
                setCurrentJobId(res.data.job_id);
                setBulkProgressOpen(true);
            }
        } catch (err) {
            alert('Failed to start bulk PDF generation: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <StaffLayout title="Enterprise PDF Document Processing">
            <Head title="Staff Document Processing" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-purple-200">
                            <i className="fa-solid fa-file-pdf text-rose-500"></i>
                            Headless Chromium Vector Engine
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                            High-Fidelity Document & Certificate Center
                        </h2>
                        <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                            Generate pixel-perfect, anti-forgery verified ID Cards, Marksheets, and Certificates with automated dynamic QR codes and asynchronous batch packaging.
                        </p>
                    </div>

                    {/* Template Selector Box */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-2 min-w-[280px]">
                        <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                            Choose Document Template:
                        </label>
                        <select
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-purple-500 shadow-xs"
                        >
                            {templates && templates.length > 0 ? (
                                templates.map((tpl) => (
                                    <option key={tpl.id} value={tpl.id}>
                                        {tpl.name} ({tpl.document_type || 'Template'})
                                    </option>
                                ))
                            ) : (
                                <option value="">No templates published by Admin</option>
                            )}
                        </select>
                    </div>
                </div>

                {/* Bulk Actions Control Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-slate-700">
                            Selected: <span className="text-purple-600 font-mono">{selectedStudents.length}</span> students
                        </span>
                        {selectedStudents.length > 0 && (
                            <button
                                onClick={() => setSelectedStudents([])}
                                className="text-[11px] text-slate-400 hover:text-slate-600 underline font-semibold"
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleStartBulkGenerate}
                        disabled={selectedStudents.length === 0}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
                    >
                        <i className="fa-solid fa-file-zipper"></i>
                        <span>Bulk Generate Batch Archive (.ZIP)</span>
                    </button>
                </div>

                {/* Student Document Generation Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-slate-900">Enrolled Students Ready for PDF Generation</h3>
                        <p className="text-xs text-slate-400">Total: {students?.total || 0} students</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-extrabold text-[10px] tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 w-10">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={students?.data?.length > 0 && selectedStudents.length === students.data.length}
                                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                        />
                                    </th>
                                    <th className="py-3.5 px-4">Student</th>
                                    <th className="py-3.5 px-4">Roll / Reg</th>
                                    <th className="py-3.5 px-4">Course & Session</th>
                                    <th className="py-3.5 px-4">Result Grade</th>
                                    <th className="py-3.5 px-4 text-right">Chromium Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {students?.data?.length > 0 ? (
                                    students.data.map((st) => {
                                        const isSelected = selectedStudents.includes(st.id);
                                        return (
                                            <tr key={st.id} className={`hover:bg-slate-50/80 transition ${isSelected ? 'bg-purple-50/40' : ''}`}>
                                                <td className="py-3.5 px-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleSelectStudent(st.id)}
                                                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                </td>
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
                                                <td className="py-3.5 px-4">
                                                    {st.result ? (
                                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[10px] border border-emerald-200">
                                                            GPA: {st.result.gpa || 'Published'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-[11px]">Pending Result</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleOpenSinglePrint(st.id)}
                                                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow transition inline-flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                        <i className="fa-solid fa-file-pdf"></i>
                                                        <span>Vector PDF</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-400">
                                            No enrolled students available for document printing.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Layout Configuration Modal */}
            <PdfLayoutModal
                isOpen={layoutModalOpen}
                onClose={() => setLayoutModalOpen(false)}
                onConfirm={handleConfirmSinglePrint}
            />

            {/* Bulk Progress & ZIP Download Modal */}
            <BulkProgressModal
                isOpen={bulkProgressOpen}
                jobId={currentJobId}
                onClose={() => setBulkProgressOpen(false)}
            />
        </StaffLayout>
    );
}
