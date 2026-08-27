import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index({ files = [] }) {
    const { app_url } = usePage().props;

    const getUrl = (path) => {
        if (!path) return app_url || '/';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const cleanBase = (app_url || '').replace(/\/$/, '');
        const cleanPath = path.replace(/^\//, '');
        return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
    };

    return (
        <AdminLayout title="Database Backup Management">
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Database Backups</h2>
                        <p className="text-xs text-slate-500">Manage and download database backup dumps.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">File Name</th>
                                    <th className="px-6 py-3">Size</th>
                                    <th className="px-6 py-3">Created Date</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {files && files.length > 0 ? (
                                    files.map((file, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4 font-semibold text-slate-900">{file.name}</td>
                                            <td className="px-6 py-4 text-slate-600">{(file.size / (1024 * 1024)).toFixed(2)} MB</td>
                                            <td className="px-6 py-4 text-slate-600">{new Date(file.date * 1000).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <a
                                                    href={getUrl(`/admin/backup/${file.name}`)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                                                >
                                                    <i className="fa-solid fa-download"></i>
                                                    <span>Download</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm">
                                            No backup files found in storage.
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
