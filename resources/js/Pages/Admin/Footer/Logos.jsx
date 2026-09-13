import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function FooterLogoIndex({ logos = [] }) {
    const [deleteModal, setDeleteModal] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, reset, errors, processing: formProcessing } = useForm({
        title: '',
        url: '',
        sort_order: 0,
        image: null,
        is_active: 1,
    });

    const handleCreateLogo = (e) => {
        e.preventDefault();
        post(getUrl('/admin/footer-logo'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleConfirmDelete = () => {
        if (!deleteModal) return;
        setProcessing(true);
        Inertia.delete(getUrl(`/admin/footer-logo/${deleteModal.id}`), {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setDeleteModal(null);
            },
        });
    };

    return (
        <AdminLayout title="Footer Partner Logos Management">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Footer Logos</h1>
                    <p className="text-xs text-slate-500">Manage partner and related logos that appear in the footer.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
                        <div className="p-6 border-b border-slate-100"><h2 className="text-lg font-black text-slate-900 tracking-tight">Existing Logos</h2></div>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-slate-500 uppercase bg-[#F8FAFC] border-b border-slate-200/80">
                                    <tr><th className="px-6 py-4">Logo</th><th className="px-6 py-4">Title</th><th className="px-6 py-4">URL</th><th className="px-6 py-4 text-right">Actions</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {logos.length > 0 ? logos.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/70 transition">
                                            <td className="px-6 py-4">{item.image_path ? <img src={getUrl(item.image_path)} alt={item.title || 'Partner logo'} className="h-10 object-contain rounded" /> : <span className="text-slate-400 italic">No Image</span>}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">{item.title || 'Untitled'}</td>
                                            <td className="px-6 py-4 text-xs max-w-xs truncate">{item.url || '—'}</td>
                                            <td className="px-6 py-4 text-right"><button onClick={() => setDeleteModal(item)} className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl border border-rose-200" title="Delete logo"><i className="fa-solid fa-trash"></i></button></td>
                                        </tr>
                                    )) : <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">No logos found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 space-y-6">
                        <div><p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">NEW LOGO</p><h3 className="text-lg font-black text-slate-900">Add Logo</h3></div>
                        <form onSubmit={handleCreateLogo} className="space-y-4" encType="multipart/form-data">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Title</label>
                                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">URL (Link Destination)</label>
                                <input type="url" value={data.url} onChange={(e) => setData('url', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                                {errors.url && <p className="text-xs text-rose-600 mt-1">{errors.url}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5" htmlFor="footer-logo-image">Logo Image *</label>
                                <input id="footer-logo-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} required={!data.image} className="block w-full text-xs text-slate-700 border border-slate-300 rounded-xl bg-white file:mr-4 file:py-2.5 file:px-4 file:rounded-l-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-bold hover:file:bg-indigo-100 cursor-pointer" />
                                {preview && <img src={preview} alt="Selected logo preview" className="mt-3 h-20 max-w-full object-contain rounded-xl border border-slate-200 p-2" />}
                                {errors.image && <p className="text-xs text-rose-600 mt-1">{errors.image}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Sort Order</label>
                                <input type="number" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs" />
                            </div>
                            <button type="submit" disabled={formProcessing} className="w-full py-3 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50"><i className="fa-solid fa-save mr-2"></i>{formProcessing ? 'Saving...' : 'Save Logo'}</button>
                        </form>
                    </div>
                </div>
            </div>

            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div onClick={() => setDeleteModal(null)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
                    <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-5">
                        <h3 className="text-lg font-black text-slate-900">Delete Logo?</h3>
                        <p className="text-xs text-slate-500">Delete “{deleteModal.title || 'Untitled'}”?</p>
                        <div className="flex justify-end gap-3"><button onClick={() => setDeleteModal(null)} className="px-5 py-2.5 bg-slate-100 rounded-xl text-xs font-bold">Cancel</button><button onClick={handleConfirmDelete} disabled={processing} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-extrabold">{processing ? 'Deleting...' : 'Confirm Delete'}</button></div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
