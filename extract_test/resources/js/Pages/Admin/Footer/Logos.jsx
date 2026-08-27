import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, useForm, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function FooterLogoIndex({ footerLogos = [] }) {
    const [deleteModal, setDeleteModal] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, reset, errors, processing: formProcessing } = useForm({
        name: '',
        url: '',
        image: null,
        is_active: 1,
    });

    const handleCreateLogo = (e) => {
        e.preventDefault();
        post(getUrl('/admin/footer-logo'), {
            onSuccess: () => {
                reset();
                setPreview(null);
            }
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleConfirmDelete = () => {
        if (!deleteModal) return;
        setProcessing(true);
        Inertia.delete(getUrl(`/admin/footer-logo/${deleteModal.id}`), {
            onFinish: () => {
                setProcessing(false);
                setDeleteModal(null);
            }
        });
    };

    return (
        <AdminLayout title="Footer Partner Logos Management">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Footer Logos</h1>
                        <p className="text-xs text-slate-500">Manage partner and related logos that appear in the footer.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* List */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Existing Logos</h2>
                        </div>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-slate-500 uppercase bg-[#F8FAFC] border-b border-slate-200/80">
                                    <tr>
                                        <th className="px-6 py-4 font-extrabold text-slate-700">Logo</th>
                                        <th className="px-6 py-4 font-extrabold text-slate-700">Name</th>
                                        <th className="px-6 py-4 font-extrabold text-slate-700">URL</th>
                                        <th className="px-6 py-4 font-extrabold text-slate-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {footerLogos.length > 0 ? (
                                        footerLogos.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/70 transition">
                                                <td className="px-6 py-4 font-bold text-slate-800 text-xs">
                                                    {item.image_path ? (
                                                        <img src={getUrl(item.image_path)} alt={item.name} className="h-10 object-contain rounded" />
                                                    ) : (
                                                        <span className="text-slate-400 italic">No Image</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-900 text-sm max-w-xs truncate">
                                                    {item.name}
                                                </td>
                                                <td className="px-6 py-4 text-xs max-w-xs truncate">
                                                    {item.url}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-1.5">
                                                    <button
                                                        onClick={() => setDeleteModal(item)}
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
                                                No logos found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Create Form */}
                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 space-y-6">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">NEW LOGO</p>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <i className="fa-solid fa-plus text-indigo-600"></i>
                                <span>Add Logo</span>
                            </h3>
                        </div>

                        <form onSubmit={handleCreateLogo} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    URL (Link Destination)
                                </label>
                                <input
                                    type="url"
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                                {errors.url && <p className="text-xs text-rose-600 mt-1">{errors.url}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Logo Image *
                                </label>
                                <div className="mt-1 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                                    {preview ? (
                                        <div className="relative mb-2">
                                            <img src={preview} alt="Preview" className="h-20 object-contain rounded-xl" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreview(null);
                                                    setData('image', null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md"
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-400 mb-2"></i>
                                            <span className="block text-xs font-bold text-slate-600 hover:text-indigo-600">Browse Image</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} required />
                                        </label>
                                    )}
                                </div>
                                {errors.image && <p className="text-xs text-rose-600 mt-1">{errors.image}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={formProcessing}
                                className="w-full py-3 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-save"></i>
                                <span>Save Logo</span>
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

                    <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-slate-200/80 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Delete Logo?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to delete this footer logo?
                            </p>
                            <p className="text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl mt-3 border border-slate-200/80">
                                "{deleteModal.name}"
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
