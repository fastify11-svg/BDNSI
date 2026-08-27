import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import { getUrl } from '../../utils/urlHelper';

export default function NoticeBoard({ notices }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch {
            return '';
        }
    };

    const formattedNotices = notices && notices.length > 0 ? notices.map(n => ({
        ...n,
        displayTitle: n.title || (n.details ? n.details.replace(/<[^>]*>?/gm, '').trim() : '') || 'No title provided',
        displayDate: formatDate(n.created_at)
    })) : [];

    return (
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-[#7024A8] text-white px-4 py-2.5 text-xs font-bold flex justify-between items-center">
                <div className="flex items-center gap-2 text-white">
                    <i className="fa-solid fa-bell text-white"></i>
                    <span className="uppercase tracking-wider font-extrabold text-white">NOTICE BOARD</span>
                </div>
                <Link href={getUrl('/all-notice-list')} className="bg-[#581C87] hover:bg-purple-900 text-white px-3 py-1 rounded text-[10px] uppercase font-black tracking-wider shadow-sm transition">
                    SHOW ALL
                </Link>
            </div>
            <div className="divide-y divide-slate-100 p-2">
                {formattedNotices.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm">No recent notices available.</div>
                ) : (
                    formattedNotices.map((n, idx) => (
                        <Link key={`notice-${n.id || idx}`} href={getUrl(`/all-notice-list/${n.id}`)} className="p-3 flex items-center gap-3 hover:bg-purple-50/50 transition group">
                            <span className="bg-amber-100 text-amber-900 font-extrabold px-2.5 py-1 rounded text-[10px] shrink-0 font-mono">
                                {n.displayDate}
                            </span>
                            <p className="text-[13px] font-medium text-slate-800 group-hover:text-[#7024A8] transition truncate">
                                {n.displayTitle}
                            </p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
