import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Show({ center, user = null }) {

    const renderStatusBadge = (status) => {
        const statusNum = Number(status?.value ?? status);
        if (statusNum === 1 || status === 'Approved') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Approved Center</span>
                </span>
            );
        } else if (statusNum === 2 || status === 'Suspended') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                    <span>Suspended</span>
                </span>
            );
        }
        return (
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                <span>Pending Approval</span>
            </span>
        );
    };

    return (
        <AdminLayout title={`Center Details - ${center.name}`}>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Hero Header Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-700 font-mono font-black text-xl flex items-center justify-center shadow-xs shrink-0">
                            #{center.code || center.id}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-slate-900">{center.name}</h1>
                                {renderStatusBadge(center.status)}
                            </div>
                            <p className="text-xs font-bold text-slate-600 mt-1">
                                Director / Owner: <span className="text-indigo-700">{center.owner_name || center.director_name || 'N/A'}</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{center.address || 'Address N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={getUrl(`/admin/center/${center.id}/edit`)}
                            className="px-4 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-extrabold rounded-xl text-xs transition flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                            <span>Edit Center</span>
                        </Link>
                        <Link
                            href={getUrl('/admin/center')}
                            className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-extrabold rounded-xl text-xs transition"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>

                {/* Portal User Credentials Status Box */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-xs uppercase tracking-wider">
                            <i className="fa-solid fa-key"></i>
                            <span>Center Portal Access Credentials</span>
                        </div>
                        <span className="text-[10px] font-mono bg-white/10 px-2.5 py-1 rounded-full text-indigo-200">
                            {user ? 'LOGIN ACTIVE' : 'NO USER CREATED'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                        <div>
                            <span className="text-slate-400 text-[11px] block">Username:</span>
                            <span className="font-bold text-white text-sm">{user?.username || `center_${center.code}`}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 text-[11px] block">Login Email:</span>
                            <span className="font-bold text-white text-sm">{center.email || user?.email || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 text-[11px] block">Login Password:</span>
                            <span className="font-bold text-emerald-400 text-sm">{user?.text_password || 'password123'}</span>
                        </div>
                    </div>
                </div>

                {/* Metrics & Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Center & Ownership Information */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600 pb-2 border-b border-slate-100">
                            <i className="fa-solid fa-building-columns text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">Institute Credentials</h3>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Institute Code:</span>
                                <span className="font-mono font-bold text-indigo-700">#{center.code}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Institute Name:</span>
                                <span className="font-bold text-slate-900">{center.name}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Director / Owner:</span>
                                <span className="font-bold text-slate-900">{center.owner_name || center.director_name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Father's Name:</span>
                                <span className="font-bold text-slate-800">{center.fathers_name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Mother's Name:</span>
                                <span className="font-bold text-slate-800">{center.mothers_name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Mobile Phone:</span>
                                <span className="font-mono font-bold text-slate-900">{center.mobile || center.phone || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Email:</span>
                                <span className="font-bold text-slate-900">{center.email || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Location & Documents */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600 pb-2 border-b border-slate-100">
                            <i className="fa-solid fa-location-dot text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">Location & Office Info</h3>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Full Address:</span>
                                <span className="font-bold text-slate-900 text-right">{center.address || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Post Office:</span>
                                <span className="font-bold text-slate-800">{center.post_office || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Postal Code:</span>
                                <span className="font-mono font-bold text-slate-800">{center.postal_code || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Computers Count:</span>
                                <span className="font-mono font-bold text-slate-900">{center.no_of_computers || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Institute Age:</span>
                                <span className="font-bold text-slate-800">{center.institute_age || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Facebook Page:</span>
                                {center.facebook_url ? (
                                    <a href={center.facebook_url} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">
                                        View Page
                                    </a>
                                ) : (
                                    <span className="text-slate-400">N/A</span>
                                )}
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Center Location (Landmark):</span>
                                <span className="font-bold text-slate-900 text-right">{center.center_location || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-1 border-b border-slate-50">
                                <span className="text-slate-500 font-semibold">Full Address:</span>
                                <span className="font-bold text-slate-900 text-right">{center.address || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Uploads Grid */}
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600 pb-2 border-b border-slate-100">
                        <i className="fa-solid fa-image text-lg"></i>
                        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">Uploaded Branding & Photos</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                        {/* Center Logo */}
                        <div className="border border-slate-200 rounded-2xl p-3 text-center space-y-2">
                            <span className="text-slate-500 text-[11px] block font-bold">Center Logo</span>
                            {center.center_logo ? (
                                <img
                                    src={getUrl(center.center_logo)}
                                    alt="Center Logo"
                                    className="h-28 w-full object-contain rounded-xl border border-slate-100 bg-slate-50 p-2"
                                />
                            ) : (
                                <div className="h-28 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">No Logo Uploaded</div>
                            )}
                        </div>

                        {/* Director Photo */}
                        <div className="border border-slate-200 rounded-2xl p-3 text-center space-y-2">
                            <span className="text-slate-500 text-[11px] block font-bold">Director Photo</span>
                            {center.photo || center.director_photo || center.director_image ? (
                                <img
                                    src={getUrl(center.photo || center.director_photo || center.director_image)}
                                    alt="Director"
                                    className="h-28 w-full object-cover rounded-xl border border-slate-100"
                                />
                            ) : (
                                <div className="h-28 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">No Photo Uploaded</div>
                            )}
                        </div>

                        {/* Director Signature */}
                        <div className="border border-slate-200 rounded-2xl p-3 text-center space-y-2">
                            <span className="text-slate-500 text-[11px] block font-bold">Director Signature</span>
                            {center.authority_signature || center.director_signature ? (
                                <img
                                    src={getUrl(center.authority_signature || center.director_signature)}
                                    alt="Signature"
                                    className="h-28 w-full object-contain rounded-xl border border-slate-100 bg-slate-50 p-2"
                                />
                            ) : (
                                <div className="h-28 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">No Signature</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
