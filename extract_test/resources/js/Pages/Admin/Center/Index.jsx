import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function CenterIndex({ centers = {}, filters = {} }) {
    const { app_url } = usePage().props;
    const centerList = centers?.data || centers || [];

    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [activeModal, setActiveModal] = useState(null); // { type: 'approve' | 'suspend' | 'delete', center: object }
    const [processing, setProcessing] = useState(false);

    // Calculate Analytics Metrics
    const totalCount = centers.total || centerList.length;
    const approvedCount = centerList.filter(c => Number(c.status) === 1 || c.status === 'Approved').length;
    const pendingCount = centerList.filter(c => Number(c.status) === 0 || c.status === 'Pending').length;
    const totalStudentsSum = centerList.reduce((acc, c) => acc + (c.all_students_count ?? c.students_count ?? 0), 0);

    // Debounced real-time filter trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '') || statusFilter !== (filters.status || 'all')) {
                Inertia.get(
                    getUrl('/admin/center'),
                    { search: search, status: statusFilter },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    const handleConfirmStatusChange = (newStatus) => {
        if (!activeModal?.center) return;
        setProcessing(true);
        Inertia.patch(
            getUrl(`/admin/center/${activeModal.center.id}/status`),
            { status: newStatus },
            {
                onFinish: () => {
                    setProcessing(false);
                    setActiveModal(null);
                }
            }
        );
    };

    const handleConfirmDelete = () => {
        if (!activeModal?.center) return;
        setProcessing(true);
        Inertia.delete(getUrl(`/admin/center/${activeModal.center.id}`), {
            onFinish: () => {
                setProcessing(false);
                setActiveModal(null);
            }
        });
    };

    const renderStatusBadge = (status) => {
        const statusNum = Number(status);
        if (statusNum === 1 || status === 'Approved') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Approved</span>
                </span>
            );
        } else if (statusNum === 2 || status === 'Suspended') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200/80 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span>Suspended</span>
                </span>
            );
        }
        return (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                <span>Pending Approval</span>
            </span>
        );
    };

    return (
        <AdminLayout title="Center Management">
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Title & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">CENTRAL NETWORK MANAGEMENT</span>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">Advanced Center & Branch Directory</h1>
                        <p className="text-xs text-slate-500 mt-1">Manage technical training centers, view student metrics, and approve affiliate applications.</p>
                    </div>

                    <Link
                        href={getUrl('/admin/center/create')}
                        className="bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2 shrink-0"
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Add New Center</span>
                    </Link>
                </div>

                {/* KPI Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-lg shrink-0">
                            <i className="fa-solid fa-building-columns"></i>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Centers</span>
                            <p className="text-xl font-black text-slate-900">{totalCount}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-lg shrink-0">
                            <i className="fa-solid fa-[#0B1528] fa-circle-check"></i>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved Centers</span>
                            <p className="text-xl font-black text-emerald-700">{approvedCount}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-lg shrink-0">
                            <i className="fa-solid fa-clock"></i>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Approvals</span>
                            <p className="text-xl font-black text-amber-700">{pendingCount}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-lg shrink-0">
                            <i className="fa-solid fa-[#0B1528] fa-users"></i>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled Students</span>
                            <p className="text-xl font-black text-purple-700">{totalStudentsSum}</p>
                        </div>
                    </div>
                </div>

                {/* Real-time Filter & Search Control Bar */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-400 text-xs"></i>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by center name, code, owner, email..."
                            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            >
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        )}
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                        {[
                            { label: 'All Centers', value: 'all' },
                            { label: 'Approved', value: 'approved' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Suspended', value: 'suspended' },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setStatusFilter(tab.value)}
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
                                    statusFilter === tab.value
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Table Card */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-xs text-left text-slate-600 min-w-[1000px]">
                            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-extrabold tracking-wider whitespace-nowrap">
                                <tr>
                                    <th className="px-5 py-3.5">Code & Center Name</th>
                                    <th className="px-5 py-3.5">Director / Owner</th>
                                    <th className="px-5 py-3.5">Contact Details</th>
                                    <th className="px-5 py-3.5">Registered Students</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Quick Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {centerList.length > 0 ? (
                                    centerList.map((center) => (
                                        <tr key={center.id} className="hover:bg-indigo-50/20 transition-colors">
                                            {/* Code & Center Name */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                                                        #{center.code || center.id}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={getUrl(`/admin/center/${center.id}`)}
                                                            className="font-extrabold text-slate-900 text-xs hover:text-indigo-600 transition-colors block"
                                                        >
                                                            {center.name}
                                                        </Link>
                                                        <p className="text-[11px] text-slate-400 truncate max-w-[220px]" title={center.address}>
                                                            {center.address || 'Location N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Director */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <p className="font-bold text-slate-800">{center.owner_name || center.director_name || 'N/A'}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">Father: {center.fathers_name || 'N/A'}</p>
                                            </td>

                                            {/* Contact */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <p className="font-bold text-slate-800 font-mono">{center.mobile || center.phone || 'N/A'}</p>
                                                <p className="text-[11px] text-slate-400">{center.email}</p>
                                            </td>

                                            {/* Metrics: Registered Students */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <Link
                                                    href={getUrl(`/admin/student?center_id=${center.id}`)}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 transition"
                                                    title="View Students under this center"
                                                >
                                                    <i className="fa-solid fa-users text-indigo-600"></i>
                                                    <span>{center.all_students_count ?? center.students_count ?? 0} Students</span>
                                                </Link>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                {renderStatusBadge(center.status)}
                                            </td>

                                            {/* Quick Action Buttons & Modals */}
                                            <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                                                {/* Approve Action */}
                                                {Number(center.status) !== 1 && (
                                                    <button
                                                        onClick={() => setActiveModal({ type: 'approve', center })}
                                                        title="Approve Center"
                                                        className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold border border-emerald-200 transition inline-flex items-center gap-1"
                                                    >
                                                        <i className="fa-solid fa-check"></i>
                                                        <span>Approve</span>
                                                    </button>
                                                )}

                                                {/* Suspend Action */}
                                                {Number(center.status) === 1 && (
                                                    <button
                                                        onClick={() => setActiveModal({ type: 'suspend', center })}
                                                        title="Suspend Center"
                                                        className="px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white rounded-xl text-xs font-bold border border-amber-200 transition inline-flex items-center gap-1"
                                                    >
                                                        <i className="fa-solid fa-ban"></i>
                                                        <span>Suspend</span>
                                                    </button>
                                                )}

                                                {/* View Profile */}
                                                <Link
                                                    href={getUrl(`/admin/center/${center.id}`)}
                                                    title="View Center Profile"
                                                    className="p-2 bg-purple-50 text-[#7024A8] hover:bg-purple-100 rounded-xl text-xs font-bold inline-flex items-center border border-purple-200 transition"
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </Link>

                                                {/* Edit */}
                                                <Link
                                                    href={getUrl(`/admin/center/${center.id}/edit`)}
                                                    title="Edit Center Details"
                                                    className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold inline-flex items-center border border-slate-200 transition"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </Link>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => setActiveModal({ type: 'delete', center })}
                                                    title="Delete Center"
                                                    className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold inline-flex items-center border border-rose-200 transition"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                                            <i className="fa-regular fa-folder-open text-2xl text-slate-300 mb-2 block"></i>
                                            No center records found matching filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {centers.links && centers.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <span className="text-slate-500 font-medium">
                                Showing {centers.from || 0} to {centers.to || 0} of {centers.total || 0} centers
                            </span>
                            <div className="flex items-center gap-1 flex-wrap">
                                {centers.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url ? getUrl(link.url) : '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-xl font-bold transition ${
                                            link.active
                                                ? 'bg-indigo-600 text-white shadow-xs'
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

            {/* Quick Action Modals */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        onClick={() => setActiveModal(null)}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                    ></div>

                    {/* Modal Window */}
                    <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
                        {activeModal.type === 'approve' && (
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xl shadow-xs">
                                    <i className="fa-solid fa-circle-check"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Approve Center Affiliate?</h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Are you sure you want to approve <strong className="text-slate-800">{activeModal.center.name}</strong>? This will auto-generate their institute portal login credentials.
                                    </p>
                                </div>
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleConfirmStatusChange(1)}
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                                    >
                                        Confirm Approval
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeModal.type === 'suspend' && (
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-xl shadow-xs">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Suspend Center?</h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Are you sure you want to suspend <strong className="text-slate-800">{activeModal.center.name}</strong>? This will temporarily restrict their center portal access.
                                    </p>
                                </div>
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleConfirmStatusChange(2)}
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                                    >
                                        Confirm Suspension
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeModal.type === 'delete' && (
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-xl shadow-xs">
                                    <i className="fa-solid fa-trash-can"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">Delete Center Record?</h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Are you sure you want to delete <strong className="text-slate-800">{activeModal.center.name}</strong>? This action will remove the center and associated student records.
                                    </p>
                                </div>
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setActiveModal(null)}
                                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                                    >
                                        Delete Center
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
