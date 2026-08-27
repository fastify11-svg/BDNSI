import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ users }) {
    const { app_url } = usePage().props;
    const userList = users?.data || users || [];

    return (
        <AdminLayout title="Center / User Accounts">
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">User & Center Accounts</h2>
                        <p className="text-xs text-slate-500">Manage registered center owners and user accounts.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">#ID</th>
                                    <th className="px-6 py-3">Center / User Name</th>
                                    <th className="px-6 py-3">Username / Email</th>
                                    <th className="px-6 py-3">Phone</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {userList.length > 0 ? (
                                    userList.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4 font-semibold text-slate-900">#{user.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                                            <td className="px-6 py-4 text-slate-600">{user.username || user.email}</td>
                                            <td className="px-6 py-4 font-medium text-slate-700">{user.phone || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm">
                                            No user accounts found.
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
