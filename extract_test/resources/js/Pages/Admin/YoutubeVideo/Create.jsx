import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Create() {
    const { app_url } = usePage().props;

    const getUrl = (path) => {
        if (!path) return '/admin/youtube-video';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        let clean = path.replace(/^\/?BDNSI\//i, '/');
        if (!clean.startsWith('/')) clean = '/' + clean;
        return clean;
    };

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        link: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(getUrl('/admin/youtube-video'));
    };

    return (
        <AdminLayout title="Add YouTube Video">
            <div className="space-y-6 max-w-3xl mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add YouTube Video</h1>
                        <p className="text-xs text-slate-500">Embed promotional or educational YouTube videos on the public website.</p>
                    </div>

                    <Link
                        href={getUrl('/admin/youtube-video')}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs shadow-xs border border-slate-200 transition"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200/80 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                Video Title *
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                placeholder="e.g. BDNSI Annual Cultural Program & Prize Giving 2026"
                                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            />
                            {errors.title && <p className="text-rose-600 mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                YouTube Video Link or Video ID *
                            </label>
                            <input
                                type="text"
                                value={data.link}
                                onChange={(e) => setData('link', e.target.value)}
                                required
                                placeholder="Paste https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ"
                                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            />
                            {errors.link && <p className="text-rose-600 mt-1">{errors.link}</p>}
                            <p className="text-[10px] text-slate-400 mt-1">Smart parser extracts YouTube Video ID automatically.</p>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                Video Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                placeholder="Brief overview of what this video demonstrates..."
                                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            ></textarea>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                            <Link
                                href={getUrl('/admin/youtube-video')}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2"
                            >
                                <i className="fa-brands fa-youtube text-red-500"></i>
                                <span>Save Video</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
