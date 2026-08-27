import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import { getUrl } from '../../utils/urlHelper';

const VideoThumbnail = ({ video, vidId }) => {
    const [imgSrc, setImgSrc] = React.useState(`https://img.youtube.com/vi/${vidId}/hqdefault.jpg`);
    const fallbackImage = getUrl('/images/about.jpg');

    return (
        <img
            src={imgSrc}
            alt={video.title || 'Video'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => {
                if (imgSrc.includes('hqdefault.jpg')) {
                    setImgSrc(`https://img.youtube.com/vi/${vidId}/mqdefault.jpg`);
                } else if (imgSrc.includes('mqdefault.jpg')) {
                    setImgSrc(fallbackImage);
                }
            }}
        />
    );
};


export default function VideoGallery({ youtube_videos }) {
    const videoList = youtube_videos && youtube_videos.length > 0 ? youtube_videos : [];

    if (videoList.length === 0) {
        return (
            <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm p-8 text-center">
                <i className="fa-brands fa-youtube text-4xl text-slate-300 mb-3"></i>
                <h2 className="text-lg font-bold text-slate-400">No video content available.</h2>
            </div>
        );
    }

    const groupInPairs = (arr) => {
        const pairs = [];
        for (let i = 0; i < arr.length; i += 2) {
            pairs.push(arr.slice(i, i + 2));
        }
        return pairs;
    };

    const videoPairs = groupInPairs(videoList);

        const getYouTubeID = (url) => {
            if (!url) return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        };

        return (
            <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-[#7024A8] text-white px-4 py-2.5 text-xs font-bold flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                        <i className="fa-brands fa-youtube text-red-500 bg-white rounded p-[3px] text-[11px]"></i>
                        <span className="uppercase tracking-wider font-extrabold text-white">VIDEO GALLERY</span>
                    </div>
                    <Link href={getUrl('/video-gallery')} className="bg-[#581C87] text-white hover:bg-purple-900 px-3 py-1 rounded text-[10px] uppercase font-black tracking-wider shadow-sm transition">
                        VIEW ALL
                    </Link>
                </div>

                {/* Desktop View: Grid (Clickable Thumbnails Redirecting to Video Gallery) */}
                <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {videoList.map((video, idx) => {
                        const vidId = video.video_id || getYouTubeID(video.link) || 'dQw4w9WgXcQ';
                        return (
                        <Link
                            key={`video-desk-${vidId}-${idx}`}
                            href={getUrl('/video-gallery')}
                            className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm flex flex-col group cursor-pointer hover:shadow-md transition"
                        >
                            <div className="aspect-video w-full bg-slate-950 relative overflow-hidden">
                                <VideoThumbnail video={video} vidId={vidId} />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-rose-600 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-play ml-1 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
                            <h4 className="font-extrabold text-slate-900 text-[13px] group-hover:text-[#7024A8] transition-colors truncate">
                                {video.title}
                            </h4>
                            <i className="fa-solid fa-arrow-right text-[11px] text-slate-400 group-hover:text-[#7024A8] transition-colors ml-2 shrink-0"></i>
                        </div>
                    </Link>
                    );
                })}
            </div>

            {/* Mobile View: 2-Row Horizontal Continuous Auto-Slider (Clickable Thumbnails Redirecting) */}
            <div className="block sm:hidden p-4 overflow-hidden relative">
                <div className="animate-video-marquee">
                    <div className="flex gap-4 pr-4 shrink-0">
                        {videoPairs.map((pair, pIdx) => (
                            <div key={`video-pair-a-${pIdx}`} className="w-[280px] shrink-0 space-y-4">
                                {pair.map((video, idx) => {
                                    const vidId = video.video_id || getYouTubeID(video.link) || 'dQw4w9WgXcQ';
                                    return (
                                    <Link
                                        key={`video-mob-a-${vidId}-${idx}`}
                                        href={getUrl('/video-gallery')}
                                        className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm flex flex-col group cursor-pointer"
                                    >
                                        <div className="aspect-video w-full bg-slate-950 relative overflow-hidden">
                                            <VideoThumbnail video={video} vidId={vidId} />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                                                    <i className="fa-solid fa-play ml-1 text-lg"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
                                            <h4 className="font-extrabold text-slate-900 text-[13px] truncate">
                                                {video.title}
                                            </h4>
                                            <i className="fa-solid fa-arrow-right text-[11px] text-slate-400 ml-2 shrink-0"></i>
                                        </div>
                                    </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4 pr-4 shrink-0" aria-hidden="true">
                        {videoPairs.map((pair, pIdx) => (
                            <div key={`video-pair-b-${pIdx}`} className="w-[280px] shrink-0 space-y-4">
                                {pair.map((video, idx) => {
                                    const vidId = video.video_id || getYouTubeID(video.link) || 'dQw4w9WgXcQ';
                                    return (
                                    <Link
                                        key={`video-mob-b-${vidId}-${idx}`}
                                        href={getUrl('/video-gallery')}
                                        className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm flex flex-col group cursor-pointer"
                                    >
                                        <div className="aspect-video w-full bg-slate-950 relative overflow-hidden">
                                            <VideoThumbnail video={video} vidId={vidId} />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                                                    <i className="fa-solid fa-play ml-1 text-lg"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
                                            <h4 className="font-extrabold text-slate-900 text-[13px] truncate">
                                                {video.title}
                                            </h4>
                                            <i className="fa-solid fa-arrow-right text-[11px] text-slate-400 ml-2 shrink-0"></i>
                                        </div>
                                    </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
