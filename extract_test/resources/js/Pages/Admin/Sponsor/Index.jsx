import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, useForm, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ sponsors }) {
    const { app_url } = usePage().props;
    const sponsorList = sponsors?.data || sponsors || [];

    const [deleteModal, setDeleteModal] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, reset, errors, processing: formProcessing, clearErrors } = useForm({
        title: '',
        photo: null,
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post(getUrl('/admin/sponsor'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setImagePreview(null);
                clearErrors();
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleConfirmDelete = () => {
        if (!deleteModal) return;
        setProcessing(true);
        Inertia.delete(getUrl(`/admin/sponsor/${deleteModal.id}`), {
            onFinish: () => {
                setProcessing(false);
                setDeleteModal(null);
            }
        });
    };

    return (
        <AdminLayout title="Sponsors & Partners Management">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sponsors & Affiliations</h1>
                        <p className="text-xs text-slate-500">Manage affiliation partner logos and sponsor badges.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Data Table */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">PARTNER DIRECTORY</p>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Active Sponsors</h2>
                                </div>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs text-slate-500 uppercase bg-[#F8FAFC] border-b border-slate-200/80 whitespace-nowrap">
                                        <tr>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Logo & Organization</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {sponsorList.length > 0 ? (
                                            sponsorList.map((sponsor) => (
                                                <tr key={sponsor.id} className="hover:bg-slate-50/70 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 group flex items-center justify-center p-2">
                                                                <img
                                                                    src={sponsor.photo || getUrl('/images/student/logo.png')}
                                                                    alt={sponsor.title}
                                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                                                    onError={(e) => { e.target.src = getUrl('/images/student/logo.png'); }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm max-w-[250px] truncate">{sponsor.title || 'Affiliated Partner'}</p>
                                                                <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1 inline-block">
                                                                    Published
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                                        <button
                                                            onClick={() => setDeleteModal(sponsor)}
                                                            title="Delete Sponsor"
                                                            className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold inline-flex items-center border border-rose-200 transition"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                                                    No sponsor records found. Add a partner logo from the right panel.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {sponsors?.links && sponsors.links.length > 3 && (
                            <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">
                                    Showing {sponsors.from || 0} to {sponsors.to || 0} of {sponsors.total || 0} entries
                                </span>
                                <div className="flex items-center gap-1">
                                    {sponsors.links.map((link, idx) => (
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

                    {/* Smart Add Sidebar */}
                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 space-y-6 h-fit sticky top-6">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">SMART ADD</p>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 mt-1">
                                <i className="fa-solid fa-handshake text-amber-500"></i>
                                <span>Add Partner Logo</span>
                            </h3>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Organization / Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. BDNSI Trust"
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Upload Logo *
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition group relative overflow-hidden bg-white">
                                    {imagePreview ? (
                                        <div className="absolute inset-0 w-full h-full p-2 bg-white">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                                <p className="text-white text-xs font-bold flex items-center gap-2">
                                                    <i className="fa-solid fa-camera"></i> Change Logo
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-center">
                                            <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 group-hover:text-indigo-500 transition"></i>
                                            <div className="flex text-xs text-slate-600 justify-center">
                                                <span className="relative cursor-pointer rounded-md font-bold text-indigo-600 hover:text-indigo-500">
                                                    <span>Upload a file</span>
                                                </span>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-[10px] text-slate-500">PNG, JPG with transparent background</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                </div>
                                {errors.photo && <p className="text-xs text-rose-600 mt-1">{errors.photo}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={formProcessing}
                                className="w-full py-3 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-upload"></i>
                                <span>Publish Sponsor</span>
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
                            <h3 className="text-lg font-black text-slate-900">Remove Partner?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to remove <strong className="text-slate-800">{deleteModal.title || 'this sponsor'}</strong> from the affiliation carousel?
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
