import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUrl } from '../../utils/urlHelper';

export default function BulkProgressModal({ isOpen, jobId, onClose, title = 'Bulk PDF Generation Engine' }) {
    const [progress, setProgress] = useState({
        status: 'processing',
        total: 0,
        completed: 0,
        percentage: 0,
        zip_url: null,
        message: null,
    });

    useEffect(() => {
        if (!isOpen || !jobId) return;

        const eventSource = new EventSource(getUrl(`/admin/documents/bulk-status/${jobId}`));

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setProgress(data);

                if (data.status === 'completed' || data.status === 'failed') {
                    eventSource.close();
                }
            } catch (err) {
                console.error('Error parsing SSE data:', err);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [isOpen, jobId]);

    if (!isOpen) return null;

    const isCompleted = progress.status === 'completed';
    const isFailed = progress.status === 'failed';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"></div>

            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 z-10 animate-fadeIn text-xs text-center">
                <div className="flex justify-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                        isCompleted
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 animate-bounce'
                            : (isFailed ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-purple-50 text-purple-600 border border-purple-200')
                    }`}>
                        {isCompleted ? (
                            <i className="fa-solid fa-file-zipper"></i>
                        ) : (
                            isFailed ? <i className="fa-solid fa-triangle-exclamation"></i> : <i className="fa-solid fa-gear fa-spin"></i>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
                    <p className="text-slate-500 text-xs">
                        {isCompleted
                            ? 'All PDF documents were successfully generated and bundled into a compressed ZIP package.'
                            : (isFailed
                                ? (progress.message || 'Generation failed.')
                                : `Processing batch items asynchronously with Chromium engine...`)}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${
                                isCompleted
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                            }`}
                            style={{ width: `${progress.percentage || 0}%` }}
                        ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Progress: {progress.percentage || 0}%</span>
                        <span>{progress.completed || 0} of {progress.total || 0} Files</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                    {isCompleted && progress.zip_url && (
                        <a
                            href={progress.zip_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-download"></i>
                            <span>Download Batch Archive (.ZIP)</span>
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                    >
                        {isCompleted ? 'Close Window' : 'Run in Background (Dismiss)'}
                    </button>
                </div>
            </div>
        </div>
    );
}
