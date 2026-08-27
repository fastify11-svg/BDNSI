import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';
import { getUrl } from '../utils/urlHelper';

export default function SuccessStudent({ students = {}, filters = {} }) {
    const { app_url } = usePage().props;
    const studentList = students?.data || students || [];

    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                Inertia.get(
                    getUrl('/success-student'),
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
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7024A8]">GRADUATE DIRECTORY</span>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">Success Students & Alumni</h1>
                        <p className="text-xs text-slate-500 mt-1">Verified graduates and certified skilled trainees from BDNSI affiliated technical institutes.</p>
                    </div>

                    <div className="relative w-full sm:w-80 shrink-0">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search student name or roll..."
                            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Students Cards Grid Container */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    {/* Purple Banner Header */}
                    <div className="bg-[#7024A8] text-white px-4 sm:px-6 py-3 text-xs font-bold flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-users"></i>
                            <span className="uppercase tracking-wider font-black text-[11px] sm:text-xs">SUCCESSFUL GRADUATES DIRECTORY</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] bg-[#581C87] px-3 py-1 rounded-full font-mono font-black shrink-0 shadow-inner">
                            Total: {students.total || studentList.length}
                        </span>
                    </div>

                    {/* Cards Grid */}
                    <div className="p-4 sm:p-6">
                        {studentList.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
                                {studentList.map((st, idx) => (
                                    <div key={st.id || idx} className="p-3.5 rounded-xl border border-slate-100 bg-white hover:border-purple-200 hover:bg-purple-50/40 hover:shadow-md transition-all space-y-2.5 group flex flex-col justify-between h-full">
                                        <div className="space-y-2">
                                            <div className="w-20 h-20 rounded-full border-2 border-[#7024A8] overflow-hidden mx-auto bg-slate-100 shadow-xs group-hover:scale-105 transition-transform shrink-0 relative">
                                                <img
                                                    src={st.picture || st.photo ? getUrl(st.picture || st.photo) : getUrl('/images/avatar.png')}
                                                    alt={st.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getUrl('/images/avatar.png');
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 text-xs truncate group-hover:text-[#7024A8] transition-colors leading-snug" title={st.name}>{st.name}</h4>
                                                {st.roll && <p className="text-[10px] text-slate-500 font-mono mt-0.5">Roll: {st.roll}</p>}
                                            </div>
                                        </div>
                                        <Link
                                            href={getUrl(`/result?roll=${st.roll || st.registration || ''}`)}
                                            className="inline-block w-full py-1.5 text-[10px] font-black bg-purple-50 text-[#7024A8] rounded-lg hover:bg-[#7024A8] hover:text-white transition-colors shadow-2xs"
                                        >
                                            Verify Certificate
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                                No success students found matching search criteria.
                            </div>
                        )}
                    </div>

                    {/* Pagination Links */}
                    {students.links && students.links.length > 3 && (
                        <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <span className="text-slate-500 font-medium font-mono">
                                Showing {students.from || 0} to {students.to || 0} of {students.total || 0} graduates
                            </span>
                            <div className="flex items-center gap-1 flex-wrap">
                                {students.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url ? getUrl(link.url) : '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded font-bold transition ${
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
