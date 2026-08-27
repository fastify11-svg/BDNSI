import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function StudentIndex({ students, centers = [], subjects = [], sessions = [], filters = {}, analytics = {} }) {
    const { app_url, errors } = usePage().props;
    const studentItems = students?.data || students || [];

    const [search, setSearch] = useState(filters.search || '');
    const [centerId, setCenterId] = useState(filters.center_id || '');
    const [subjectId, setSubjectId] = useState(filters.subject_id || '');
    const [sessionId, setSessionId] = useState(filters.session_id || '');
    const [status, setStatus] = useState(filters.status !== undefined ? filters.status : '');
    const [courseType, setCourseType] = useState(filters.course_type !== undefined ? filters.course_type : '');

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
            const queryParams = {};
            if (search) queryParams.search = search;
            if (centerId) queryParams.center_id = centerId;
            if (subjectId) queryParams.subject_id = subjectId;
            if (sessionId) queryParams.session_id = sessionId;
            if (status !== '') queryParams.status = status;
            if (courseType !== '') queryParams.course_type = courseType;

            const isChanged =
                search !== (filters.search || '') ||
                centerId !== (filters.center_id || '') ||
                subjectId !== (filters.subject_id || '') ||
                sessionId !== (filters.session_id || '') ||
                String(status) !== String(filters.status !== undefined ? filters.status : '') ||
                String(courseType) !== String(filters.course_type !== undefined ? filters.course_type : '');

            if (isChanged) {
                Inertia.get(getUrl('/admin/student'), queryParams, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search, centerId, subjectId, sessionId, status, courseType]);

    const resetFilters = () => {
        setSearch('');
        setCenterId('');
        setSubjectId('');
        setSessionId('');
        setStatus('');
        setCourseType('');
        Inertia.get(getUrl('/admin/student'), {}, { preserveState: true, preserveScroll: true });
    };

    const handleCopy = (text, key) => {
        if (!text || text === 'N/A') return;
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => {
            setCopiedKey('');
        }, 2000);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this student record?')) {
            Inertia.delete(getUrl(`/admin/student/${id}`));
        }
    };

    const getCourseTypeName = (type) => {
        if (type === 0 || type === '0') return 'Regular';
        if (type === 1 || type === '1') return 'Short Course';
        if (type === 2 || type === '2') return 'Diploma';
        return 'Regular';
    };

    const getStatusBadge = (st) => {
        if (st === 2 || st === 'Approved') {
            return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">Approved</span>;
        }
        if (st === 1 || st === 'Requested') {
            return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">Requested</span>;
        }
        if (st === 0 || st === 'Pending') {
            return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">Pending</span>;
        }
        if (st === 3 || st === 'Hide') {
            return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">Hide</span>;
        }
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>;
    };

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importCenterId, setImportCenterId] = useState('');
    const [importSessionId, setImportSessionId] = useState('');
    const [importSubjectId, setImportSubjectId] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    const handleImportSubmit = (e) => {
        e.preventDefault();
        if (!importFile || !importCenterId || !importSessionId || !importSubjectId) {
            alert('Please fill all required fields and select a CSV file.');
            return;
        }
        
        setIsImporting(true);
        const formData = new FormData();
        formData.append('file', importFile);
        formData.append('center_id', importCenterId);
        formData.append('session_id', importSessionId);
        formData.append('subject_id', importSubjectId);

        Inertia.post(getUrl('/admin/student/import'), formData, {
            onSuccess: () => {
                setIsImporting(false);
                setIsImportModalOpen(false);
                setImportFile(null);
                setImportCenterId('');
                setImportSessionId('');
                setImportSubjectId('');
                alert('Students imported successfully!');
            },
            onError: () => {
                setIsImporting(false);
                alert('An error occurred during import.');
            }
        });
    };

    const handleExport = () => {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (centerId) queryParams.append('center_id', centerId);
        if (subjectId) queryParams.append('subject_id', subjectId);
        if (sessionId) queryParams.append('session_id', sessionId);
        if (status !== '') queryParams.append('status', status);
        if (courseType !== '') queryParams.append('course_type', courseType);

        window.location.href = getUrl(`/admin/student/export?${queryParams.toString()}`);
    };

    return (
        <AdminLayout title="Student Management">
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Top Header Card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7024A8]">ADMINISTRATION PORTAL</span>
                        <h2 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight mt-0.5">Advanced Student Directory</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Search, filter, view transcripts, certificates, admit cards, registration cards, and manage student records.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={handleExport}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center gap-2 shrink-0"
                        >
                            <i className="fa-solid fa-file-csv"></i>
                            <span>Export CSV</span>
                        </button>
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center gap-2 shrink-0"
                        >
                            <i className="fa-solid fa-upload"></i>
                            <span>Import CSV</span>
                        </button>
                        <Link
                            href={getUrl('/admin/student/create')}
                            className="bg-[#7024A8] hover:bg-purple-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2 shrink-0"
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Add New Student</span>
                        </Link>
                    </div>
                </div>

                {/* Analytics Dashboard Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Total Students */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 bg-[#7024A8]/5 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Total Students</p>
                                <h3 className="text-3xl font-black text-slate-900 mt-1">{analytics.total?.toLocaleString() || 0}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7024A8] flex items-center justify-center text-lg">
                                <i className="fa-solid fa-users"></i>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit border border-emerald-100">
                            <i className="fa-solid fa-check-circle"></i> {analytics.active?.toLocaleString() || 0} Active
                        </div>
                    </div>

                    {/* Card 2: Gender Distribution */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                        <div className="flex justify-between items-start mb-3">
                            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Gender Split</p>
                            <i className="fa-solid fa-venus-mars text-slate-300"></i>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-blue-600">Male</span>
                                    <span className="text-slate-700">{analytics.male || 0}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(analytics.male / (analytics.total || 1)) * 100}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-pink-500">Female</span>
                                    <span className="text-slate-700">{analytics.female || 0}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                    <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${(analytics.female / (analytics.total || 1)) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Course Types */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                        <div className="flex justify-between items-start mb-3">
                            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Course Types</p>
                            <i className="fa-solid fa-book-open text-slate-300"></i>
                        </div>
                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="font-semibold text-slate-700">Regular</span>
                                </div>
                                <span className="font-black text-slate-900">{analytics.regular || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="font-semibold text-slate-700">Short Course</span>
                                </div>
                                <span className="font-black text-slate-900">{analytics.short || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    <span className="font-semibold text-slate-700">Diploma</span>
                                </div>
                                <span className="font-black text-slate-900">{analytics.diploma || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Financials */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 bg-rose-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Total Fees Due</p>
                                <h3 className="text-2xl font-black text-rose-600 mt-1">৳ {analytics.due?.toLocaleString() || 0}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg">
                                <i className="fa-solid fa-money-bill-wave"></i>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded w-fit border border-slate-100">
                            Total Paid: ৳ {analytics.paid?.toLocaleString() || 0}
                        </div>
                    </div>
                </div>

                {/* Filter & Search Toolbar */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {/* Search Input */}
                        <div className="relative col-span-1 sm:col-span-2">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search Name, Roll, Reg, Phone..."
                                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <i className="fa-solid fa-xmark text-xs"></i>
                                </button>
                            )}
                        </div>

                        {/* Center Filter */}
                        <div>
                            <select
                                value={centerId}
                                onChange={(e) => setCenterId(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                            >
                                <option value="">All Centers</option>
                                {centers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        [{c.code}] {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subject Filter */}
                        <div>
                            <select
                                value={subjectId}
                                onChange={(e) => setSubjectId(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                            >
                                <option value="">All Subjects</option>
                                {subjects.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                            >
                                <option value="">All Statuses</option>
                                <option value="2">Approved</option>
                                <option value="0">Pending</option>
                                <option value="1">Requested</option>
                                <option value="3">Hide</option>
                            </select>
                        </div>

                        {/* Course Type Filter */}
                        <div>
                            <select
                                value={courseType}
                                onChange={(e) => setCourseType(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                            >
                                <option value="">Course Type</option>
                                <option value="0">Regular</option>
                                <option value="1">Short Course</option>
                                <option value="2">Diploma</option>
                            </select>
                        </div>
                    </div>

                    {(search || centerId || subjectId || sessionId || status !== '' || courseType !== '') && (
                        <div className="flex justify-end pt-1">
                            <button
                                onClick={resetFilters}
                                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 transition"
                            >
                                <i className="fa-solid fa-rotate-left"></i>
                                <span>Reset All Filters</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Data Table Card */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-xs text-left text-slate-600 min-w-[1000px]">
                            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-extrabold tracking-wider whitespace-nowrap">
                                <tr>
                                    <th className="px-5 py-3.5">#ID</th>
                                    <th className="px-5 py-3.5">Student Info</th>
                                    <th className="px-5 py-3.5">Center</th>
                                    <th className="px-5 py-3.5">Roll & Reg</th>
                                    <th className="px-5 py-3.5">Course / Subject</th>
                                    <th className="px-5 py-3.5">Result</th>
                                    <th className="px-5 py-3.5">Documents</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {studentItems.length > 0 ? (
                                    studentItems.map((student) => {
                                        const rollVal = student.roll || student.roll_no;
                                        const regVal = student.registration || student.reg_no;
                                        const hasResult = student.result || (student.result_count && student.result_count > 0);

                                        const daysSinceRegistration = Math.floor((new Date() - new Date(student.created_at)) / (1000 * 60 * 60 * 24));
                                        const isPendingResultAlert = !student.result_publised && daysSinceRegistration >= 30;

                                        return (
                                            <tr key={student.id} className="hover:bg-purple-50/20 transition-colors">
                                                {/* ID */}
                                                <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                                                    #{student.id}
                                                </td>

                                                {/* Student Info */}
                                                <td className="px-5 py-4 flex items-center gap-3 min-w-[200px]">
                                                    <img
                                                        src={student.picture || student.photo ? getUrl(student.picture || student.photo) : getUrl('/images/avatar.png')}
                                                        alt={student.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                                                        onError={(e) => { e.target.src = getUrl('/images/avatar.png'); }}
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-1.5 leading-snug">
                                                            <p className="font-extrabold text-slate-900 text-xs">{student.name}</p>
                                                            {isPendingResultAlert && (
                                                                <span title={`Result overdue! Registered ${daysSinceRegistration} days ago.`} className="bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] animate-pulse">
                                                                    <i className="fa-solid fa-exclamation"></i>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] text-slate-400 font-mono">{student.phone || 'No Phone'}</span>
                                                            <span className="bg-slate-100 text-slate-600 font-bold text-[9px] px-1.5 py-0.2 rounded border border-slate-200">
                                                                {getCourseTypeName(student.course_type)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Center */}
                                                <td className="px-5 py-4 max-w-[180px]">
                                                    {student.center ? (
                                                        <div className="space-y-0.5">
                                                            <span className="bg-purple-100 text-[#7024A8] font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                                                CODE: {student.center.code}
                                                            </span>
                                                            <p className="font-bold text-slate-800 text-[11px] truncate" title={student.center.name}>
                                                                {student.center.name}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 text-[11px]">N/A</span>
                                                    )}
                                                </td>

                                                {/* Roll & Reg Column with Copy Buttons */}
                                                <td className="px-5 py-4 whitespace-nowrap space-y-1 font-mono text-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-extrabold text-[#7024A8]">Roll: {rollVal || 'N/A'}</span>
                                                        {rollVal && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(rollVal, `roll-${student.id}`)}
                                                                className="text-slate-400 hover:text-[#7024A8] transition-colors p-1 rounded hover:bg-purple-50"
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
                                                        <span className="font-semibold text-slate-600">Reg: {regVal || 'N/A'}</span>
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

                                                {/* Course / Subject */}
                                                <td className="px-5 py-4 text-xs font-bold text-slate-800 max-w-[160px] truncate" title={student.subject?.name || student.course_name}>
                                                    {student.subject?.name || student.course_name || 'N/A'}
                                                </td>

                                                {/* Result */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    {hasResult || rollVal ? (
                                                        <a
                                                            href={getUrl(`/admin/result?roll=${rollVal || ''}`)}
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

                                                {/* Documents Dropdown Menu Column */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => toggleDocMenu(e, student.id)}
                                                        className="bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                                                    >
                                                        <span>Documents</span>
                                                        <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${activeDocMenuId === student.id ? 'rotate-180' : ''}`}></i>
                                                    </button>
                                                </td>

                                                {/* Status */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    {getStatusBadge(student.status)}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                                                    <Link
                                                        href={getUrl(`/admin/student/${student.id}`)}
                                                        className="p-2 bg-purple-50 text-[#7024A8] hover:bg-purple-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border border-purple-200 transition"
                                                        title="View Full Profile"
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </Link>
                                                    <Link
                                                        href={getUrl(`/admin/student/${student.id}/edit`)}
                                                        className="p-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border border-amber-200 transition"
                                                        title="Edit Student"
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(student.id)}
                                                        className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border border-rose-200 transition"
                                                        title="Delete Student"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-12 text-center text-slate-400 text-sm font-semibold">
                                            <i className="fa-regular fa-folder-open text-2xl text-slate-300 mb-2 block"></i>
                                            No student records found matching the search or filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {students.links && students.links.length > 3 && (
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
                                                ? 'bg-[#7024A8] text-white shadow-xs'
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

            {/* CSV Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-black text-slate-900">Import Students via CSV</h3>
                                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Upload a CSV file to bulk insert records.</p>
                            </div>
                            <button onClick={() => setIsImportModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition">
                                <i className="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>
                        <form onSubmit={handleImportSubmit} className="p-5 space-y-4">
                            
                            {errors?.error && (
                                <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
                                    <i className="fa-solid fa-triangle-exclamation mr-1"></i> {errors.error}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Select Center <span className="text-rose-500">*</span></label>
                                <select
                                    required
                                    value={importCenterId}
                                    onChange={(e) => setImportCenterId(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                >
                                    <option value="">Choose Center...</option>
                                    {centers.map((c) => (
                                        <option key={c.id} value={c.id}>[{c.code}] {c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Select Session <span className="text-rose-500">*</span></label>
                                    <select
                                        required
                                        value={importSessionId}
                                        onChange={(e) => setImportSessionId(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    >
                                        <option value="">Choose Session...</option>
                                        {sessions.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Select Subject <span className="text-rose-500">*</span></label>
                                    <select
                                        required
                                        value={importSubjectId}
                                        onChange={(e) => setImportSubjectId(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    >
                                        <option value="">Choose Subject...</option>
                                        {subjects.map((sub) => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">CSV File <span className="text-rose-500">*</span></label>
                                <input
                                    required
                                    type="file"
                                    accept=".csv, .txt"
                                    onChange={(e) => setImportFile(e.target.files[0])}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-[#7024A8] hover:file:bg-purple-100 cursor-pointer border border-slate-200 rounded-xl"
                                />
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-medium text-blue-800 space-y-1">
                                    <p className="font-bold text-blue-900"><i className="fa-solid fa-circle-info mr-1"></i> CSV Format Requirements:</p>
                                    <p>Column 1: Name (Required)</p>
                                    <p>Column 2: Father's Name</p>
                                    <p>Column 3: Mother's Name</p>
                                    <p>Column 4: Phone</p>
                                    <p>Column 5: Gender (Male/Female)</p>
                                    <p>Column 6: Date of Birth</p>
                                    <p>Column 7: Roll (Optional - Auto Gen)</p>
                                    <p>Column 8: Reg (Optional - Auto Gen)</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isImporting}
                                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs text-white shadow-md transition-all ${isImporting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#7024A8] hover:bg-purple-800 active:scale-[0.98]'}`}
                                >
                                    {isImporting ? (
                                        <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Importing...</>
                                    ) : (
                                        <><i className="fa-solid fa-upload mr-2"></i> Upload & Import Students</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {activeDocMenuId !== null && (() => {
                const activeStudent = studentItems.find((s) => s.id === activeDocMenuId);
                if (!activeStudent) return null;
                return createPortal(
                    <div
                        ref={menuRef}
                        style={{ position: 'fixed', top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
                        className="z-[99999] w-48 bg-white rounded-md shadow-xl border border-slate-100 flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100"
                    >
                        <a
                            href={getUrl(`/admin/admit-card/${activeStudent.id}`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-id-badge text-rose-500 w-4 text-center"></i>
                            <span>Admit Card</span>
                        </a>
                        <a
                            href={getUrl(`/admin/student/${activeStudent.id}?registration=registration`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-file-lines text-teal-500 w-4 text-center"></i>
                            <span>Reg Card</span>
                        </a>
                        <a
                            href={getUrl(`/admin/student/${activeStudent.id}?transcript=transcript`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-file-invoice text-blue-500 w-4 text-center"></i>
                            <span>Transcript</span>
                        </a>
                        <a
                            href={getUrl(`/admin/certificate/${activeStudent.id}?certificate=certificate`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-certificate text-purple-500 w-4 text-center"></i>
                            <span>Certificate</span>
                        </a>
                        <a
                            href={getUrl(`/admin/certificate/${activeStudent.id}?original=original`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-award text-emerald-600 w-4 text-center"></i>
                            <span>Original Certificate</span>
                        </a>
                        <a
                            href={getUrl(`/admin/student/${activeStudent.id}?orginalcpdf=orginalcpdf`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-file-pdf text-indigo-500 w-4 text-center"></i>
                            <span>Original C-Pdf</span>
                        </a>
                        <a
                            href={getUrl(`/admin/student/${activeStudent.id}?cpdf=cpdf`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-700 text-left transition-colors flex items-center gap-2"
                        >
                            <i className="fa-regular fa-file-pdf text-emerald-500 w-4 text-center"></i>
                            <span>C-Pdf</span>
                        </a>
                        <a
                            href={getUrl(`/admin/student/${activeStudent.id}?idcard=idcard`)}
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
        </AdminLayout>
    );
}
