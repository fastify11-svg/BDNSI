import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, useForm, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function NoticeIndex({ notices = {}, filters = {} }) {
    const { app_url } = usePage().props;
    const noticeList = notices?.data || notices || [];

    const [search, setSearch] = useState(filters.search || '');
    const [deleteModal, setDeleteModal] = useState(null); // notice object
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, reset, errors, processing: formProcessing } = useForm({
        title: '',
        details: '',
        bn_details: '',
        ar_details: '',
        file_path: null,
    });

    // Real-time search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                Inertia.get(
                    getUrl('/admin/notice'),
                    { search: search },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleCreateNotice = (e) => {
        e.preventDefault();
        post(getUrl('/admin/notice'), {
            onSuccess: () => reset()
        });
    };

    const handleConfirmDelete = () => {
        if (!deleteModal) return;
        setProcessing(true);
        Inertia.delete(getUrl(`/admin/notice/${deleteModal.id}`), {
            onFinish: () => {
                setProcessing(false);
                setDeleteModal(null);
            }
        });
    };

    return (
        <AdminLayout title="Notice Board Management">
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Top Header Title & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notice Board Management</h1>
                        <p className="text-xs text-slate-500">Publish announcements, manage exam schedules, and update center notifications.</p>
                    </div>

                    <Link
                        href={getUrl('/admin/notice/create')}
                        className="bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Create New Notice</span>
                    </Link>
                </div>

                {/* Real-time Search Control Bar */}
                <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 text-xs"></i>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search notices by title or keywords..."
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                            >
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        )}
                    </div>
                    <span className="text-xs text-slate-500 font-bold hidden sm:inline-block">
                        Total Published: {notices.total || noticeList.length} Notices
                    </span>
                </div>

                {/* Main Content Layout (Side-by-side desktop, stacked mobile) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Notice Table / List */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">ANNOUNCEMENTS</p>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Published Notices List</h2>
                                </div>
                            </div>

                            {/* Responsive Table Wrapper */}
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs text-slate-500 uppercase bg-[#F8FAFC] border-b border-slate-200/80 whitespace-nowrap">
                                        <tr>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Publication Date</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Notice Title / Details</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Status</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 whitespace-nowrap">
                                        {noticeList.length > 0 ? (
                                            noticeList.map((notice) => (
                                                <tr key={notice.id} className="hover:bg-slate-50/70 transition">
                                                    {/* Date */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-100">
                                                                <i className="fa-solid fa-calendar-day"></i>
                                                            </div>
                                                            <span className="font-bold text-slate-800 text-xs">
                                                                {notice.formatted_date || 'Recent'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Title */}
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-slate-900 text-sm max-w-xs truncate">
                                                            {notice.title || notice.details || 'Untitled Notice'}
                                                        </p>
                                                        {notice.title && (
                                                            <p className="text-xs text-slate-400 max-w-xs truncate">{notice.details}</p>
                                                        )}
                                                    </td>

                                                    {/* Status Badge */}
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                            <span>Active</span>
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 text-right space-x-1.5">
                                                        <Link
                                                            href={getUrl(`/admin/notice/${notice.id}/edit`)}
                                                            title="Edit Notice"
                                                            className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold inline-flex items-center border border-slate-200 transition"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => setDeleteModal(notice)}
                                                            title="Delete Notice"
                                                            className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold inline-flex items-center border border-rose-200 transition"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                                                    No notices found matching search criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination Links */}
                        {notices.links && notices.links.length > 3 && (
                            <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">
                                    Showing {notices.from || 0} to {notices.to || 0} of {notices.total || 0} notices
                                </span>
                                <div className="flex items-center gap-1">
                                    {notices.links.map((link, idx) => (
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

                    {/* Quick Create Notice Form */}
                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 space-y-6">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">NEW ANNOUNCEMENT</p>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <i className="fa-solid fa-bullhorn text-indigo-600"></i>
                                <span>Create Notice</span>
                            </h3>
                        </div>

                        <form onSubmit={handleCreateNotice} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Notice Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    placeholder="e.g. Exam Schedule 2024"
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Details / Content *
                                </label>
                                <textarea
                                    value={data.details}
                                    onChange={(e) => setData('details', e.target.value)}
                                    required
                                    rows={3}
                                    placeholder="Enter notice details in English..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                ></textarea>
                                {errors.details && <p className="text-xs text-rose-600 mt-1">{errors.details}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    File Attachment (Optional PDF/Image)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setData('file_path', e.target.files[0])}
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.file_path && <p className="text-xs text-rose-600 mt-1">{errors.file_path}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={formProcessing}
                                className="w-full py-3 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-paper-plane"></i>
                                <span>Publish Notice</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Styled Delete Confirmation Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setDeleteModal(null)}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                    ></div>

                    <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-slate-200/80 space-y-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Delete Notice?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to delete this notice? This action cannot be undone.
                            </p>
                            <p className="text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl mt-3 border border-slate-200/80">
                                "{deleteModal.details || deleteModal.title}"
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={processing}
                                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
