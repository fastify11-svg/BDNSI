import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';
import { getUrl } from '../utils/urlHelper';

export default function NoticeList({ notices }) {
    const { app_url } = usePage().props;
    const noticeItems = notices?.data || notices || [];

    return (
        <FrontendLayout>
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-[#7024A8] to-[#581C87] text-white py-10 sm:py-12 px-4 rounded-xl shadow-sm mb-6">
                <div className="max-w-4xl mx-auto text-center space-y-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-sm">
                        Official Notices & Announcements
                    </h1>
                    <p className="text-purple-200 text-xs sm:text-sm font-medium">
                        Stay updated with official news, exam schedules, and academic notices from BDNSI board.
                    </p>
                </div>
            </div>

            {/* Notice List Section */}
            <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                    {noticeItems.length > 0 ? (
                        noticeItems.map((notice) => (
                            <div
                                key={notice.id}
                                className="p-4 sm:p-6 hover:bg-purple-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                            >
                                <div className="space-y-1.5 flex-1 pr-0 sm:pr-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-[#7024A8] bg-purple-100 px-2.5 py-0.5 rounded-full inline-block font-mono">
                                            <i className="fa-regular fa-calendar-check mr-1 text-[10px]"></i>
                                            {notice.created_at ? new Date(notice.created_at).toLocaleDateString() : 'Official'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-[#7024A8] transition-colors leading-snug">
                                        {notice.title || 'Official Notice'}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                        {notice.details ? notice.details.replace(/<[^>]*>?/gm, '') : ''}
                                    </p>
                                </div>
                                <Link
                                    href={getUrl(`/all-notice-list/${notice.id}`)}
                                    className="self-start sm:self-center px-4 py-2 bg-purple-50 text-[#7024A8] font-bold text-xs rounded-xl hover:bg-[#7024A8] hover:text-white transition-all shrink-0 border border-purple-100 shadow-2xs flex items-center gap-1.5"
                                >
                                    <span>Read Notice</span>
                                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-slate-400 text-xs sm:text-sm font-semibold space-y-2">
                            <i className="fa-regular fa-folder-open text-2xl text-slate-300"></i>
                            <p>No notices available at present.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Links */}
                {notices?.links && notices.links.length > 3 && (
                    <div className="mt-6 p-4 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
                        <span className="text-slate-500 font-medium font-mono">
                            Showing {notices.from || 0} to {notices.to || 0} of {notices.total || 0} notices
                        </span>
                        <div className="flex items-center gap-1 flex-wrap">
                            {notices.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url ? getUrl(link.url) : '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                                        link.active
                                            ? 'bg-[#7024A8] text-white shadow-xs'
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
        </FrontendLayout>
    );
}
