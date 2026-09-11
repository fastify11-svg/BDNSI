import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ subAdmins }) {
    const { app_url } = usePage().props;
    const adminList = subAdmins?.data || subAdmins || [];

    return (
        <AdminLayout title="Sub Admin Management">
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Sub Admin Officers</h2>
                        <p className="text-xs text-slate-500">Manage administrator roles and staff accounts.</p>
                    </div>
                    <div>
                        <Link
                            href={getUrl('/admin/sub-admin/create')}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 text-sm"
                        >
                            <i className="fa-solid fa-plus"></i>
                            Add Sub Admin
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">#ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email Address</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {adminList.length > 0 ? (
                                    adminList.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4 font-semibold text-slate-900">#{admin.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{admin.name}</td>
                                            <td className="px-6 py-4 text-slate-600">{admin.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-purple-100 text-[#7024A8] font-bold px-3 py-1 rounded-full text-xs">
                                                    System Admin
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Link
                                                    href={getUrl(`/admin/sub-admin/${admin.id}/edit`)}
                                                    className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition shadow-sm"
                                                >
                                                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm">
                                            No sub admin accounts found.
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
