import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, useForm, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ whatsappLinks }) {
    const { app_url } = usePage().props;
    const linkList = whatsappLinks?.data || whatsappLinks || [];

    const [deleteModal, setDeleteModal] = useState(null);
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, reset, errors, processing: formProcessing, clearErrors } = useForm({
        name: '',
        phone: '',
        description: '',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post(getUrl('/admin/whatapp-link'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
            }
        });
    };

    const handleConfirmDelete = () => {
        if (!deleteModal) return;
        setProcessing(true);
        Inertia.delete(getUrl(`/admin/whatapp-link/${deleteModal.id}`), {
            onFinish: () => {
                setProcessing(false);
                setDeleteModal(null);
            }
        });
    };

    return (
        <AdminLayout title="WhatsApp Support Desk Management">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">WhatsApp Support Desk</h1>
                        <p className="text-xs text-slate-500">Manage student support phone numbers and helpdesk WhatsApp links.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Data Table */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">SUPPORT DIRECTORY</p>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Active WhatsApp Numbers</h2>
                                </div>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs text-slate-500 uppercase bg-[#F8FAFC] border-b border-slate-200/80 whitespace-nowrap">
                                        <tr>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Support Agent / Title</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">WhatsApp Number</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {linkList.length > 0 ? (
                                            linkList.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shadow-sm border border-emerald-100 shrink-0">
                                                                <i className="fa-brands fa-whatsapp"></i>
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm max-w-[200px] truncate">{item.name || item.title || 'Helpdesk Support'}</p>
                                                                <p className="text-[10px] text-slate-400 max-w-[200px] truncate">{item.description || 'General Inquiry'}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <a href={`https://wa.me/${item.phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200/80 transition group">
                                                            <span className="font-mono">{item.phone || item.number || 'N/A'}</span>
                                                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-50 group-hover:opacity-100"></i>
                                                        </a>
                                                    </td>

                                                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                                        <button
                                                            onClick={() => setDeleteModal(item)}
                                                            title="Delete Support Number"
                                                            className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold inline-flex items-center border border-rose-200 transition"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                                                    No WhatsApp numbers found. Add a support agent from the right panel.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {whatsappLinks?.links && whatsappLinks.links.length > 3 && (
                            <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">
                                    Showing {whatsappLinks.from || 0} to {whatsappLinks.to || 0} of {whatsappLinks.total || 0} entries
                                </span>
                                <div className="flex items-center gap-1">
                                    {whatsappLinks.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url ? getUrl(link.url) : '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1.5 rounded-xl font-bold transition ${
                                                link.active
                                                    ? 'bg-emerald-600 text-white shadow-xs'
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

                    {/* Smart Add Sidebar */}
                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 space-y-6 h-fit sticky top-6">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">SMART ADD</p>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 mt-1">
                                <i className="fa-brands fa-whatsapp text-emerald-500"></i>
                                <span>Add Support Agent</span>
                            </h3>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Support Title / Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Helpdesk / Mr. Rafiq"
                                    required
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                                />
                                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    WhatsApp Number *
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="e.g. +8801XXXXXXXXX"
                                    required
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition font-mono"
                                />
                                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                                <p className="text-[10px] text-slate-400 mt-1">Include country code (e.g. +880).</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Description *
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="e.g. For admission inquiry only..."
                                    required
                                    rows={2}
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                                ></textarea>
                                {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={formProcessing}
                                className="w-full py-3 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-plus"></i>
                                <span>Add WhatsApp Link</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
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
                            <h3 className="text-lg font-black text-slate-900">Remove Support Number?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to remove <strong className="text-slate-800">{deleteModal.name || deleteModal.title} ({deleteModal.phone})</strong> from the website?
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
                                Confirm Removal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
