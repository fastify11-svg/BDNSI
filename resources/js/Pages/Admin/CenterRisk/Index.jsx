import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function CenterRiskIndex({ centers = [] }) {
    const renderRiskBadge = (level) => {
        if (level === 'CRITICAL') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200/80 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>CRITICAL</span>
                </span>
            );
        } else if (level === 'HIGH') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>HIGH</span>
                </span>
            );
        } else if (level === 'MEDIUM') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>MEDIUM</span>
                </span>
            );
        }
        return (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>LOW</span>
            </span>
        );
    };

    return (
        <AdminLayout title="Center Risk Dashboard">
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Title & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600">RISK MANAGEMENT</span>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">Center Risk Dashboard</h1>
                        <p className="text-xs text-slate-500 mt-1">Monitor credit utilization, unpaid orders, and operational risk across all active centers.</p>
                    </div>
                </div>

                {/* Data Table Card */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-xs text-left text-slate-600 min-w-[1000px]">
                            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200 font-extrabold tracking-wider whitespace-nowrap">
                                <tr>
                                    <th className="px-5 py-3.5">Center Details</th>
                                    <th className="px-5 py-3.5 text-right">Credit Limit & Due</th>
                                    <th className="px-5 py-3.5 text-right">Utilization</th>
                                    <th className="px-5 py-3.5 text-right">Unpaid Orders</th>
                                    <th className="px-5 py-3.5 text-right">Doc Rejections</th>
                                    <th className="px-5 py-3.5 text-center">Risk Score</th>
                                    <th className="px-5 py-3.5">Risk Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {centers.length > 0 ? (
                                    centers.map((center) => (
                                        <tr key={center.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                                                        #{center.center_code}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={getUrl(`/admin/center/${center.id}`)}
                                                            className="font-extrabold text-slate-900 text-xs hover:text-indigo-600 transition-colors block"
                                                        >
                                                            {center.center_name}
                                                        </Link>
                                                        <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                                                            {center.owner_name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="px-5 py-4 text-right">
                                                <p className="font-bold text-rose-600">Due: ৳{Number(center.current_due || 0).toFixed(2)}</p>
                                                {center.credit_limit_enabled ? (
                                                    <p className="text-[10px] text-slate-400">Limit: ৳{Number(center.credit_limit || 0).toFixed(2)}</p>
                                                ) : (
                                                    <p className="text-[10px] text-slate-400">No Limit</p>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <p className="font-bold text-slate-800">{Number(center.factors?.utilization || 0).toFixed(1)}%</p>
                                            </td>
                                            
                                            <td className="px-5 py-4 text-right">
                                                <p className="font-bold text-slate-800">{center.factors?.unpaid_volume || 0}</p>
                                            </td>
                                            
                                            <td className="px-5 py-4 text-right">
                                                <p className="font-bold text-slate-800">{Number(center.factors?.rejection_rate || 0).toFixed(1)}%</p>
                                            </td>
                                            
                                            <td className="px-5 py-4 text-center">
                                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 font-black text-slate-700 border border-slate-200">
                                                    {center.risk_score}
                                                </div>
                                            </td>
                                            
                                            <td className="px-5 py-4">
                                                {renderRiskBadge(center.risk_level)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                                            <i className="fa-regular fa-folder-open text-2xl text-slate-300 mb-2 block"></i>
                                            No active centers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
