import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, useForm, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ videos = {}, filters = {} }) {
    const { app_url } = usePage().props;
    const videoList = videos?.data || videos || [];

    const [search, setSearch] = useState(filters.search || '');
    const [deleteModal, setDeleteModal] = useState(null);
    const [processing, setProcessing] = useState(false);

    const { data, setData, post, reset, errors, processing: formProcessing } = useForm({
        title: '',
        link: '',
        description: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                Inertia.get(
                    getUrl('/admin/youtube-video'),
                    { search: search },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleCreateVideo = (e) => {
        e.preventDefault();
        post(getUrl('/admin/youtube-video'), {
            onSuccess: () => reset()
        });
    };

    const handleConfirmDelete = () => {
        if (!deleteModal) return;
        setProcessing(true);
        Inertia.delete(getUrl(`/admin/youtube-video/${deleteModal.id}`), {
            onFinish: () => {
                setProcessing(false);
                setDeleteModal(null);
            }
        });
    };

    return (
        <AdminLayout title="YouTube Video Gallery Management">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">YouTube Video Gallery</h1>
                        <p className="text-xs text-slate-500">Manage promotional and tutorial video embeds displayed on the public website.</p>
                    </div>

                    <Link
                        href={getUrl('/admin/youtube-video/create')}
                        className="bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Add New Video</span>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 text-xs"></i>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search video title or YouTube ID..."
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
                        Total Videos: {videos.total || videoList.length}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">GALLERY CONTENT</p>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Active YouTube Videos</h2>
                                </div>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs text-slate-500 uppercase bg-[#F8FAFC] border-b border-slate-200/80 whitespace-nowrap">
                                        <tr>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Preview & Video Title</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">YouTube ID</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Status</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 whitespace-nowrap">
                                        {videoList.length > 0 ? (
                                            videoList.map((video) => (
                                                <tr key={video.id} className="hover:bg-slate-50/70 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-20 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 group">
                                                                <img
                                                                    src={video.image || `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                                                                    alt={video.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                                    onError={(e) => {
                                                                        if (e.target.src.includes('maxresdefault.jpg')) {
                                                                            e.target.src = `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`;
                                                                        } else {
                                                                            e.target.onerror = null;
                                                                            e.target.src = getUrl('/images/about.jpg');
                                                                        }
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                                    <i className="fa-solid fa-play text-white text-xs drop-shadow"></i>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-xs max-w-xs truncate">{video.title}</p>
                                                                <p className="text-[10px] text-slate-400 max-w-xs truncate">{video.description || 'No description'}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                                                            {video.video_id}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                            <span>Published</span>
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-right space-x-1.5">
                                                        <a
                                                            href={`https://www.youtube.com/watch?v=${video.video_id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Watch on YouTube"
                                                            className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold inline-flex items-center border border-slate-200 transition"
                                                        >
                                                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                                        </a>
                                                        <Link
                                                            href={getUrl(`/admin/youtube-video/${video.id}/edit`)}
                                                            title="Edit Video Details"
                                                            className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold inline-flex items-center border border-slate-200 transition"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => setDeleteModal(video)}
                                                            title="Delete Video"
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
                                                    No YouTube videos found matching search criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {videos.links && videos.links.length > 3 && (
                            <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">
                                    Showing {videos.from || 0} to {videos.to || 0} of {videos.total || 0} videos
                                </span>
                                <div className="flex items-center gap-1">
                                    {videos.links.map((link, idx) => (
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

                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 space-y-6">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">SMART ADD</p>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <i className="fa-brands fa-youtube text-red-600"></i>
                                <span>Add YouTube Video</span>
                            </h3>
                        </div>

                        <form onSubmit={handleCreateVideo} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Video Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    placeholder="e.g. BDNSI Vocational Orientation 2026"
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    YouTube Video URL / Link *
                                </label>
                                <input
                                    type="text"
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                    required
                                    placeholder="Paste https://www.youtube.com/watch?v=XXXXX"
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.link && <p className="text-xs text-rose-600 mt-1">{errors.link}</p>}
                                <p className="text-[10px] text-slate-400 mt-1">Smart parser extracts YouTube Video ID automatically.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={2}
                                    placeholder="Brief video description..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={formProcessing}
                                className="w-full py-3 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <i className="fa-brands fa-youtube text-red-500"></i>
                                <span>Publish to Gallery</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

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
                            <h3 className="text-lg font-black text-slate-900">Delete Video Entry?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to remove <strong className="text-slate-800">{deleteModal.title}</strong> from the public gallery?
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
