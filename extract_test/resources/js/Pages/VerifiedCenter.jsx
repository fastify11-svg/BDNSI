import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';
import { getUrl } from '../utils/urlHelper';

export default function VerifiedCenter({ centers = {}, filters = {} }) {
    const { app_url } = usePage().props;
    const centerList = centers?.data || centers || [];

    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                Inertia.get(
                    getUrl('/verified-center'),
                    { search: search },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <FrontendLayout>
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header & Search Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7024A8]">AFFILIATED NETWORK</span>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">Verified Training Centers</h1>
                        <p className="text-xs text-slate-500 mt-1">Officially accredited technical education and vocational training centers across Bangladesh.</p>
                    </div>

                    <div className="relative w-full sm:w-80 shrink-0">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search center name or code..."
                            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Centers Directory Grid Container */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    {/* Purple Banner Header */}
                    <div className="bg-[#7024A8] text-white px-4 sm:px-6 py-3 text-xs font-bold flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-building-columns"></i>
                            <span className="uppercase tracking-wider font-black text-[11px] sm:text-xs">VERIFIED CENTERS DIRECTORY</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] bg-[#581C87] px-3 py-1 rounded-full font-mono font-black shrink-0 shadow-inner">
                            Total: {centers.total || centerList.length}
                        </span>
                    </div>

                    {/* Cards Grid */}
                    <div className="p-4 sm:p-6">
                        {centerList.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {centerList.map((inst, idx) => (
                                    <div key={inst.id || idx} className="p-4 border border-slate-200 rounded-xl bg-white shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-slate-50 shadow-xs">
                                                <img
                                                    src={inst.logo || inst.photo ? getUrl(inst.logo || inst.photo) : getUrl('/govt.png')}
                                                    alt={inst.name}
                                                    className="w-10 h-10 object-contain"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getUrl('/govt.png');
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1.5 min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="bg-purple-100 text-[#7024A8] font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                                        CODE: {inst.code || `CTR-${inst.id || idx + 100}`}
                                                    </span>
                                                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                                        VERIFIED
                                                    </span>
                                                </div>
                                                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug group-hover:text-[#7024A8] transition-colors line-clamp-2" title={inst.name}>
                                                    {inst.name}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                                            {inst.owner_name && (
                                                <p className="flex items-center gap-2">
                                                    <i className="fa-solid fa-user text-[11px] text-[#7024A8]"></i>
                                                    <span className="font-semibold text-slate-800">{inst.owner_name}</span>
                                                </p>
                                            )}
                                            {inst.address && (
                                                <p className="flex items-start gap-2 text-[11px] text-slate-500">
                                                    <i className="fa-solid fa-location-dot text-[11px] text-rose-500 mt-0.5 shrink-0"></i>
                                                    <span className="line-clamp-1">{inst.address}</span>
                                                </p>
                                            )}
                                            {inst.phone && (
                                                <p className="flex items-center gap-2 text-[11px] font-mono text-slate-700">
                                                    <i className="fa-solid fa-phone text-[11px] text-emerald-600"></i>
                                                    <span>{inst.phone}</span>
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <Link
                                                href={getUrl('/center-request/create')}
                                                className="block text-center w-full py-2 bg-purple-50 text-[#7024A8] font-extrabold text-xs rounded-lg hover:bg-[#7024A8] hover:text-white transition-colors shadow-2xs"
                                            >
                                                Apply Student from Center
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-slate-400 text-xs font-semibold space-y-2">
                                <i className="fa-regular fa-building text-2xl text-slate-300"></i>
                                <p>No verified centers found matching search criteria.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Links */}
                    {centers.links && centers.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <span className="text-slate-500 font-medium font-mono">
                                Showing {centers.from || 0} to {centers.to || 0} of {centers.total || 0} centers
                            </span>
                            <div className="flex items-center gap-1 flex-wrap">
                                {centers.links.map((link, idx) => (
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
            </div>
        </FrontendLayout>
    );
}
