import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';

export default function NoticeDetails({ notice }) {
    if (!notice) {
        return (
            <FrontendLayout>
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-xl font-bold text-rose-600">Notice Not Found</h2>
                    <Link href="/all-notice-list" className="mt-4 inline-block bg-[#7024A8] text-white px-6 py-2 rounded-lg text-sm font-bold">
                        Back to Notices
                    </Link>
                </div>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout>
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-10 px-4">
                <div className="max-w-4xl mx-auto space-y-2">
                    <Link href="/all-notice-list" className="text-xs text-purple-200 hover:underline flex items-center gap-1">
                        <i className="fa-solid fa-arrow-left"></i> Back to Notices
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-extrabold">{notice.title || 'Official Notice'}</h1>
                    <p className="text-xs text-purple-300">
                        Published: {notice.created_at ? new Date(notice.created_at).toLocaleDateString() : 'Official'}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                    {notice.file_url && (
                        <div className="p-4 bg-purple-50 rounded-xl flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#7024A8]">Attachment Document</span>
                            <a
                                href={notice.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 bg-[#7024A8] text-white font-bold text-xs rounded-lg hover:bg-purple-800 transition flex items-center gap-2"
                            >
                                <i className="fa-solid fa-download"></i>
                                View/Download
                            </a>
                        </div>
                    )}
                    <div
                        className="text-gray-700 text-sm leading-relaxed space-y-4 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: notice.details || '' }}
                    />
                </div>
            </div>
        </FrontendLayout>
    );
}
