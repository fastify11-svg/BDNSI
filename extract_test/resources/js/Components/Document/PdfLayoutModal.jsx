import React, { useState } from 'react';
import { getUrl } from '../../utils/urlHelper';

export default function PdfLayoutModal({ isOpen, onClose, onConfirm, defaultFormat = 'A4', defaultLandscape = false, title = 'PDF Print & Layout Configuration' }) {
    const [format, setFormat] = useState(defaultFormat);
    const [landscape, setLandscape] = useState(defaultLandscape);
    const [scale, setScale] = useState('1.0');

    if (!isOpen) return null;

    const handleApply = () => {
        onConfirm({ format, landscape, scale });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"></div>
            
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 z-10 animate-fadeIn text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-base">
                            <i className="fa-solid fa-sliders"></i>
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
                            <p className="text-[10px] text-slate-400 font-medium">Headless Chromium Vector Engine</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Paper Format */}
                    <div>
                        <label className="font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider text-[10px]">
                            Paper Dimensions / Format:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'A4', label: 'A4 Standard', desc: '210 x 297 mm' },
                                { id: 'CR80', label: 'CR80 (PVC Card)', desc: '85.6 x 53.98 mm' },
                                { id: 'Letter', label: 'US Letter', desc: '8.5 x 11.0 in' },
                                { id: 'Legal', label: 'Legal Size', desc: '8.5 x 14.0 in' },
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setFormat(p.id)}
                                    className={`p-3 rounded-xl border text-left transition ${
                                        format === p.id
                                            ? 'bg-purple-50/80 border-purple-500 text-purple-900 ring-2 ring-purple-500/20'
                                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    <p className="font-bold">{p.label}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{p.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Orientation */}
                    <div>
                        <label className="font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider text-[10px]">
                            Page Orientation:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setLandscape(false)}
                                className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${
                                    !landscape
                                        ? 'bg-purple-50/80 border-purple-500 text-purple-900 font-bold'
                                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <i className="fa-solid fa-file text-base"></i>
                                <span>Portrait (Vertical)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setLandscape(true)}
                                className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${
                                    landscape
                                        ? 'bg-purple-50/80 border-purple-500 text-purple-900 font-bold'
                                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                <i className="fa-solid fa-file rotate-90 text-base"></i>
                                <span>Landscape (Horizontal)</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleApply}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg transition flex items-center gap-1.5"
                    >
                        <i className="fa-solid fa-file-pdf"></i>
                        <span>Generate Vector PDF</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
