import React, { useState, useMemo } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function SubjectIndex({ subjects }) {
    const { app_url } = usePage().props;
    const subjectList = subjects?.data || subjects || [];

    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [viewModalCourse, setViewModalCourse] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    // Client-side pagination state for smooth navigation across all 830+ courses
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        code: '',
        rate: '',
        duration: '',
        education_qualification: '',
        course_details: '',
        photo: null,
        type: 0,
        _method: 'POST'
    });

    // Preset options for quick admin input
    const durationPresets = ['3 Months', '6 Months', '1 Year', '2 Years', '4 Years'];
    const qualificationPresets = ['SSC / Equivalent', 'HSC / Equivalent', 'Bachelor Degree', 'Open for All'];

    const handleAiSuggest = async () => {
        if (!data.name || data.name.trim() === '') {
            alert('অনুগ্রহ করে প্রথমে কোর্সের নাম (Course Name) লিখুন!');
            return;
        }

        setAiLoading(true);
        try {
            const response = await fetch(getUrl('/admin/subject/ai-suggest'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ course_name: data.name })
            });

            const result = await response.json();
            if (result.success && result.data) {
                setData(prevData => ({
                    ...prevData,
                    code: result.data.code || prevData.code,
                    duration: result.data.duration || prevData.duration,
                    rate: result.data.rate || prevData.rate,
                    education_qualification: result.data.education_qualification || prevData.education_qualification,
                    course_details: result.data.course_details || prevData.course_details,
                    type: result.data.type !== undefined ? result.data.type : prevData.type
                }));
            } else {
                alert('AI Suggestion ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
            }
        } catch (error) {
            console.error('AI Suggest Error:', error);
            alert('AI সার্ভারে সমস্যা হয়েছে।');
        } finally {
            setAiLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setData('photo', file);
        if (file) {
            setPreviewPhoto(URL.createObjectURL(file));
        } else {
            setPreviewPhoto(null);
        }
    };

    const handleEdit = (subject) => {
        setEditMode(true);
        setEditId(subject.id);
        setData({
            name: subject.name || '',
            code: subject.code || '',
            rate: subject.rate || '',
            duration: subject.duration || '',
            education_qualification: subject.education_qualification || subject.qualification || '',
            course_details: subject.course_details || '',
            photo: null,
            type: subject.type?.value !== undefined ? subject.type.value : (subject.type || 0),
            _method: 'PUT'
        });
        setPreviewPhoto(subject.photo ? getUrl(subject.photo) : null);
        clearErrors();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditMode(false);
        setEditId(null);
        reset();
        setPreviewPhoto(null);
        clearErrors();
        setData('_method', 'POST');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            post(getUrl(`/admin/subject/${editId}`), {
                onSuccess: () => cancelEdit()
            });
        } else {
            post(getUrl('/admin/subject'), {
                onSuccess: () => {
                    reset();
                    setPreviewPhoto(null);
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            Inertia.delete(getUrl(`/admin/subject/${id}`));
        }
    };

    // Filter and search logic across ALL courses
    const filteredSubjects = useMemo(() => {
        return subjectList.filter(sub => {
            const matchesSearch = !searchTerm || 
                sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.code?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const subTypeVal = sub.type?.value !== undefined ? sub.type.value : (sub.type || 0);
            const matchesType = filterType === 'ALL' || 
                (filterType === 'REGULAR' && subTypeVal == 0) ||
                (filterType === 'SHORT' && subTypeVal == 1) ||
                (filterType === 'DIPLOMA' && subTypeVal == 2);

            return matchesSearch && matchesType;
        });
    }, [subjectList, searchTerm, filterType]);

    // Statistics counts across entire database
    const stats = useMemo(() => {
        let reg = 0, short = 0, dip = 0;
        subjectList.forEach(s => {
            const val = s.type?.value !== undefined ? s.type.value : (s.type || 0);
            if (val == 0) reg++;
            else if (val == 1) short++;
            else if (val == 2) dip++;
        });
        return { total: subjectList.length, reg, short, dip };
    }, [subjectList]);

    // Calculate pagination slices
    const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage) || 1;
    const paginatedSubjects = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSubjects.slice(start, start + itemsPerPage);
    }, [filteredSubjects, currentPage, itemsPerPage]);

    // Reset to page 1 whenever filter or search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType, itemsPerPage]);

    const getTypeBadge = (typeVal) => {
        const val = typeVal?.value !== undefined ? typeVal.value : (typeVal || 0);
        if (val == 1) return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-200">Short Course</span>;
        if (val == 2) return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-purple-200">Diploma</span>;
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-200">Regular</span>;
    };

    return (
        <AdminLayout title="Course Management System">
            {/* Top Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-purple-200 uppercase tracking-wider block">Total Courses</span>
                        <h3 className="text-3xl font-black mt-1">{stats.total}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl text-purple-200">
                        <i className="fa-solid fa-graduation-cap"></i>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Regular Courses</span>
                        <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.reg}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-solid fa-book"></i>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Short Courses</span>
                        <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.short}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-solid fa-bolt"></i>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Diploma Programs</span>
                        <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.dip}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
                        <i className="fa-solid fa-certificate"></i>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Course List Section (2 Columns) */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                    {/* Header with Search and Filter */}
                    <div className="p-6 border-b border-slate-100 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                                    <i className="fa-solid fa-list-check text-[#7024A8]"></i> Course Directory
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">Showing all {stats.total} courses across the curriculum</p>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search in all 830+ courses..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#7024A8] transition font-medium"
                                />
                                <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs">
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Tabs & Rows Per Page Selector */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1 border-t border-slate-100/80">
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs w-full sm:w-auto">
                                {[
                                    { id: 'ALL', label: `All (${stats.total})` },
                                    { id: 'REGULAR', label: `Regular (${stats.reg})` },
                                    { id: 'SHORT', label: `Short (${stats.short})` },
                                    { id: 'DIPLOMA', label: `Diploma (${stats.dip})` }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setFilterType(tab.id)}
                                        className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                                            filterType === tab.id
                                                ? 'bg-[#7024A8] text-white shadow-sm'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 self-end sm:self-auto">
                                <span>Show:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#7024A8]"
                                >
                                    <option value={25}>25 / page</option>
                                    <option value={50}>50 / page</option>
                                    <option value={100}>100 / page</option>
                                    <option value={200}>200 / page</option>
                                    <option value={1000}>All Courses ({stats.total})</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/80 border-b border-slate-100 font-extrabold tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5">#</th>
                                    <th className="px-6 py-3.5">Course Information</th>
                                    <th className="px-6 py-3.5">Type</th>
                                    <th className="px-6 py-3.5">Duration</th>
                                    <th className="px-6 py-3.5">Fee Rate</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedSubjects.length > 0 ? (
                                    paginatedSubjects.map((subject, idx) => (
                                        <tr key={subject.id} className="hover:bg-purple-50/30 transition group">
                                            <td className="px-6 py-4 text-xs font-bold text-slate-400">
                                                {(currentPage - 1) * itemsPerPage + idx + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                                                        <img 
                                                            src={subject.photo ? getUrl(subject.photo) : getUrl('/images/no-image.png')} 
                                                            alt={subject.name} 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                                                            onError={(e) => { e.target.src = getUrl('/images/no-image.png'); }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-[#7024A8] transition">
                                                            {subject.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                                                {subject.code || 'NO-CODE'}
                                                            </span>
                                                            {subject.education_qualification && (
                                                                <span className="text-[11px] text-slate-400 truncate max-w-[120px]" title={subject.education_qualification}>
                                                                    • {subject.education_qualification}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getTypeBadge(subject.type)}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-700 text-xs">
                                                {subject.duration ? (
                                                    <span className="flex items-center gap-1.5"><i className="fa-regular fa-clock text-slate-400"></i> {subject.duration}</span>
                                                ) : (
                                                    <span className="text-slate-300">Not Specified</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {subject.rate ? (
                                                    <span className="inline-flex items-center gap-1 font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 text-xs shadow-2xs">
                                                        ৳ {subject.rate}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-medium italic">Contact Fee</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewModalCourse(subject)}
                                                        title="Live Preview"
                                                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs transition"
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(subject)}
                                                        title="Edit Course"
                                                        className="w-8 h-8 rounded-lg bg-purple-50 hover:bg-[#7024A8] hover:text-white text-[#7024A8] flex items-center justify-center text-xs transition font-bold"
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(subject.id)}
                                                        title="Delete Course"
                                                        className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 flex items-center justify-center text-xs transition"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 text-2xl">
                                                <i className="fa-solid fa-folder-open"></i>
                                            </div>
                                            <p className="text-slate-600 font-bold text-base">No Courses Found</p>
                                            <p className="text-slate-400 text-xs mt-1">Try adjusting your search keywords or category filters.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Table Footer with Client-Side Pagination */}
                    <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            Showing <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, filteredSubjects.length)}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredSubjects.length)}</strong> of <strong>{filteredSubjects.length}</strong> filtered courses (Total <strong>{stats.total}</strong> in DB)
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-purple-50 hover:text-[#7024A8] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 transition"
                                    title="First Page"
                                >
                                    <i className="fa-solid fa-angles-left"></i>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-purple-50 hover:text-[#7024A8] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 transition"
                                >
                                    Prev
                                </button>

                                {/* Page indicator */}
                                <span className="px-3 py-1.5 font-bold text-slate-700 bg-slate-100 rounded-lg border border-slate-200">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-purple-50 hover:text-[#7024A8] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 transition"
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-purple-50 hover:text-[#7024A8] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 transition"
                                    title="Last Page"
                                >
                                    <i className="fa-solid fa-angles-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add/Edit Course Form Section (1 Column) */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 md:p-8 space-y-6 self-start relative overflow-hidden">
                    {/* Top Gradient Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${editMode ? 'from-amber-500 to-rose-500' : 'from-[#7024A8] to-indigo-600'}`}></div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md mb-1 inline-block ${editMode ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'}`}>
                                {editMode ? 'Modification Mode' : 'Creation Portal'}
                            </span>
                            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <i className={`fa-solid ${editMode ? 'fa-pen-ruler text-amber-600' : 'fa-circle-plus text-[#7024A8]'}`}></i>
                                <span>{editMode ? 'Update Course Data' : 'Add New Course'}</span>
                            </h2>
                        </div>
                        {editMode && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition flex items-center gap-1"
                            >
                                <i className="fa-solid fa-xmark"></i> Cancel
                            </button>
                        )}
                    </div>

                    {/* Gemini Free AI Auto-Suggest Banner */}
                    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#7024A8] text-white p-5 rounded-2xl shadow-lg border border-purple-400/30 relative overflow-hidden my-4">
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-inner text-xl">
                                    ✨
                                </div>
                                <div>
                                    <h4 className="text-sm font-black tracking-wide flex items-center gap-2">
                                        Gemini Free AI Assistant
                                        <span className="bg-gradient-to-r from-pink-400 to-amber-300 text-slate-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Free Auto-Fill</span>
                                    </h4>
                                    <p className="text-[11px] text-purple-200 mt-0.5">
                                        কোর্সের নাম লিখুন এবং নিচের <strong>"✨ Generate AI Info"</strong> বাটনে ক্লিক করুন। ১-ক্লিকেই সব পূরণ হয়ে যাবে!
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleAiSuggest}
                                disabled={aiLoading}
                                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider w-full cursor-pointer disabled:opacity-50"
                            >
                                {aiLoading ? (
                                    <>
                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                        <span>AI তৈরি করছে (Generating...)...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>✨</span>
                                        <span>Generate AI Info (১-ক্লিকে পূরণ করুন)</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Section 1: Basic Information */}
                        <div className="space-y-4">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">
                                1. Basic Specifications
                            </span>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Course Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    placeholder="e.g. Diploma in Web & Software Engineering"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#7024A8] focus:border-transparent transition"
                                />
                                {errors.name && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                                        Course Code
                                    </label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        placeholder="e.g. WD-101"
                                        onChange={(e) => setData('code', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#7024A8] transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                                        Course Type <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        required
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#7024A8] transition"
                                    >
                                        <option value="0">Regular Course</option>
                                        <option value="1">Short Course</option>
                                        <option value="2">Diploma Program</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Fee and Duration */}
                        <div className="space-y-4 pt-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">
                                2. Fee & Timeframe
                            </span>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={data.duration}
                                        placeholder="e.g. 6 Months"
                                        onChange={(e) => setData('duration', e.target.value)}
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#7024A8] transition mb-2"
                                    />
                                    {/* Quick Preset Buttons */}
                                    <div className="flex flex-wrap gap-1">
                                        {durationPresets.map(d => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => setData('duration', d)}
                                                className="text-[10px] font-bold bg-slate-100 hover:bg-purple-100 hover:text-[#7024A8] text-slate-600 px-2 py-0.5 rounded transition"
                                            >
                                                +{d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                                        Rate / Fee (BDT)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-2 text-slate-400 font-bold text-sm">৳</span>
                                        <input
                                            type="text"
                                            value={data.rate}
                                            placeholder="25000"
                                            onChange={(e) => setData('rate', e.target.value)}
                                            className="w-full pl-8 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-emerald-700 focus:bg-white focus:ring-2 focus:ring-[#7024A8] transition"
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 block">Numeric fee or range (e.g. 25000-35000)</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Education Qualification
                                </label>
                                <input
                                    type="text"
                                    value={data.education_qualification}
                                    placeholder="e.g. HSC / Equivalent or Bachelor Degree"
                                    onChange={(e) => setData('education_qualification', e.target.value)}
                                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#7024A8] transition mb-2"
                                />
                                <div className="flex flex-wrap gap-1">
                                    {qualificationPresets.map(q => (
                                        <button
                                            key={q}
                                            type="button"
                                            onClick={() => setData('education_qualification', q)}
                                            className="text-[10px] font-bold bg-slate-100 hover:bg-purple-100 hover:text-[#7024A8] text-slate-600 px-2 py-0.5 rounded transition"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Syllabus and Media */}
                        <div className="space-y-4 pt-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">
                                3. Syllabus & Thumbnail Media
                            </span>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Course Description & Syllabus
                                </label>
                                <textarea
                                    value={data.course_details}
                                    onChange={(e) => setData('course_details', e.target.value)}
                                    rows={4}
                                    placeholder="Enter complete course details, syllabus topics, and lab training notes..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#7024A8] transition leading-relaxed"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Course Thumbnail / Photo {editMode ? '(Optional)' : '<span class="text-rose-500">*</span>'}
                                </label>

                                {/* Advanced Visual Dropzone */}
                                <div className="border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-purple-50/20 transition relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        required={!editMode && !previewPhoto}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="space-y-2 py-2">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 text-[#7024A8] flex items-center justify-center mx-auto text-lg shadow-inner">
                                            <i className="fa-solid fa-cloud-arrow-up"></i>
                                        </div>
                                        <div className="text-xs font-bold text-slate-700">
                                            <span>Click to browse</span> or drag photo here
                                        </div>
                                        <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB (Recommended: 800x600 px)</p>
                                    </div>
                                </div>
                                {errors.photo && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.photo}</p>}

                                {/* Visual Preview Card */}
                                {previewPhoto && (
                                    <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 relative group">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                                            {editMode && !data.photo ? 'Current Saved Photo' : 'New Photo Selected'}
                                        </span>
                                        <div className="h-40 w-full rounded-xl overflow-hidden bg-slate-200 relative shadow-inner">
                                            <img src={previewPhoto} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                                        </div>
                                        {data.photo && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('photo', null);
                                                    setPreviewPhoto(editMode && editId ? getUrl(subjectList.find(s=>s.id===editId)?.photo) : null);
                                                }}
                                                className="mt-2 text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                                            >
                                                <i className="fa-solid fa-trash-can"></i> Discard selected new photo
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-3.5 font-black text-white rounded-2xl shadow-lg transition duration-200 flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50 ${
                                    editMode 
                                        ? 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 shadow-amber-500/20' 
                                        : 'bg-gradient-to-r from-[#7024A8] to-purple-800 hover:from-purple-800 hover:to-indigo-900 shadow-purple-500/25'
                                }`}
                            >
                                <i className={`fa-solid ${processing ? 'fa-spinner fa-spin' : (editMode ? 'fa-check-double' : 'fa-paper-plane')}`}></i>
                                {processing ? 'Processing...' : (editMode ? 'Update Course Record' : 'Publish New Course')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Quick Live Preview Modal */}
            {viewModalCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 flex justify-between items-center">
                            <div>
                                <span className="bg-white/20 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                                    Live Frontend Preview
                                </span>
                                <h3 className="text-lg font-black mt-1 truncate max-w-[320px]">{viewModalCourse.name}</h3>
                            </div>
                            <button
                                onClick={() => setViewModalCourse(null)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            <div className="h-52 w-full rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
                                <img
                                    src={viewModalCourse.photo ? getUrl(viewModalCourse.photo) : getUrl('/images/no-image.png')}
                                    alt={viewModalCourse.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 bg-[#7024A8] text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md">
                                    ৳ {viewModalCourse.rate || 'Contact Fee'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Course Code</span>
                                    <strong className="text-slate-800 font-mono text-sm">{viewModalCourse.code || 'BDNSI'}</strong>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Duration</span>
                                    <strong className="text-slate-800 text-sm">{viewModalCourse.duration || '3 Months'}</strong>
                                </div>
                                <div className="col-span-2 pt-2 border-t border-slate-200/60">
                                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Eligibility / Qualification</span>
                                    <strong className="text-slate-800">{viewModalCourse.education_qualification || 'HSC / Equivalent'}</strong>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">Description / Syllabus</h4>
                                <p className="text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto bg-slate-50/50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                                    {viewModalCourse.course_details || 'No course syllabus described yet.'}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    const c = viewModalCourse;
                                    setViewModalCourse(null);
                                    handleEdit(c);
                                }}
                                className="px-5 py-2 bg-purple-100 hover:bg-[#7024A8] hover:text-white text-[#7024A8] font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                            >
                                <i className="fa-solid fa-pen-to-square"></i> Edit This Course
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewModalCourse(null)}
                                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
