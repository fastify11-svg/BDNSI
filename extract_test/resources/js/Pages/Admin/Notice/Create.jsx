import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Create() {
    const { app_url } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        details: '',
        bn_details: '',
        ar_details: '',
        image: null,
        file_path: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(getUrl('/admin/notice'));
    };

    return (
        <AdminLayout title="Create Notice">
            <div className="space-y-6 max-w-3xl mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create New Notice</h1>
                        <p className="text-xs text-slate-500">Publish a new notice or announcement for all centers and students.</p>
                    </div>

                    <Link
                        href={getUrl('/admin/notice')}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs shadow-xs border border-slate-200 transition"
                    >
                        Notice List
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200/80 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                Notice Title *
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                placeholder="e.g. Exam Schedule 2024"
                                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            />
                            {errors.title && <p className="text-rose-600 mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                Details / Content *
                            </label>
                            <textarea
                                value={data.details}
                                onChange={(e) => setData('details', e.target.value)}
                                required
                                rows={4}
                                placeholder="Enter notice details in English..."
                                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            ></textarea>
                            {errors.details && <p className="text-rose-600 mt-1">{errors.details}</p>}
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                File Attachment (Optional PDF/Image)
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setData('file_path', e.target.files[0])}
                                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            />
                            {errors.file_path && <p className="text-rose-600 mt-1">{errors.file_path}</p>}
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                Bangla Details (বাংলা বিবরণ)
                            </label>
                            <textarea
                                value={data.bn_details}
                                onChange={(e) => setData('bn_details', e.target.value)}
                                rows={3}
                                placeholder="বাংলায় নোটিশ বিবরণ..."
                                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                Arabic Details (التفاصيل باللغة العربية)
                            </label>
                            <textarea
                                value={data.ar_details}
                                onChange={(e) => setData('ar_details', e.target.value)}
                                rows={2}
                                placeholder="تفاصيل الإشعار باللغة العربية..."
                                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            ></textarea>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                            <Link
                                href={getUrl('/admin/notice')}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                            >
                                Publish Notice
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
