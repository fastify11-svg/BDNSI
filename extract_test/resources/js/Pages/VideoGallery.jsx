import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';

export default function VideoGallery({ videos = {} }) {
    const { app_url } = usePage().props;
    const videoList = videos?.data || videos || [];

    const getUrl = (path) => {
        if (!path) return app_url || '/';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const cleanBase = (app_url || '').replace(/\/$/, '');
        const cleanPath = path.replace(/^\//, '');
        return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
    };

    const getYouTubeID = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <FrontendLayout>
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white py-14 px-4 shadow-inner">
                <div className="max-w-7xl mx-auto text-center space-y-3">
                    <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-white/10 text-amber-300 border border-white/10 backdrop-blur-sm">
                        MEDIA & MULTIMEDIA
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Official Video Gallery</h1>
                    <p className="text-xs sm:text-sm text-purple-200 max-w-2xl mx-auto">
                        Explore technical training orientation, institute activities, cultural highlights, and practical demonstrations from BDNSI.
                    </p>
                </div>
            </div>

            {/* Main Video Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {videoList.length > 0 ? (
                        videoList.map((video, idx) => {
                            const vidId = video.video_id || getYouTubeID(video.link) || 'dQw4w9WgXcQ';
                            return (
                            <div
                                key={video.id || idx}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 flex flex-col justify-between group"
                            >
                                {/* Responsive 16:9 Aspect Video Container */}
                                <div className="aspect-video w-full bg-slate-950 relative overflow-hidden">
                                    <iframe
                                        className="w-full h-full border-0"
                                        src={`https://www.youtube.com/embed/${vidId}?autoplay=0&rel=0`}
                                        title={video.title || `BDNSI Video ${idx}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>

                                {/* Video Info Footer */}
                                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
                                        {video.description && (
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                {video.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                                        <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
                                            <i className="fa-brands fa-youtube text-red-600 text-sm"></i>
                                            <span>BDNSI Official</span>
                                        </span>
                                        <a
                                            href={`https://www.youtube.com/watch?v=${video.video_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-400 hover:text-indigo-600 transition flex items-center gap-1 text-[11px]"
                                        >
                                            <span>YouTube</span>
                                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl">
                                <i className="fa-solid fa-film"></i>
                            </div>
                            <h3 className="text-base font-extrabold text-slate-800">No Videos Published Yet</h3>
                            <p className="text-xs text-slate-500">Check back soon for new video updates and course demonstrations.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {videos.links && videos.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 pt-6">
                        {videos.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url ? getUrl(link.url) : '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                                    link.active
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : link.url
                                        ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-xs'
                                        : 'text-slate-300 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </FrontendLayout>
    );
}
