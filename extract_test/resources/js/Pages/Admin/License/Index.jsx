import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ licenses }) {
    const { app_url } = usePage().props;
    const licenseList = licenses?.data || licenses || [];

    return (
        <AdminLayout title="Driving & Vocational License Management">
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Verified Licenses</h2>
                        <p className="text-xs text-slate-500">Manage issued driving licenses and vocational certification records.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">#ID</th>
                                    <th className="px-6 py-3">Holder Name</th>
                                    <th className="px-6 py-3">License Number</th>
                                    <th className="px-6 py-3">CNIC / NID</th>
                                    <th className="px-6 py-3">Valid Until</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {licenseList.length > 0 ? (
                                    licenseList.map((lic) => (
                                        <tr key={lic.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4 font-semibold text-slate-900">#{lic.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{lic.name}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-purple-700">{lic.license_number}</td>
                                            <td className="px-6 py-4 font-medium text-slate-600">{lic.cnic || 'N/A'}</td>
                                            <td className="px-6 py-4 font-medium text-slate-700">{lic.valid_to || 'Permanent'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400 text-sm">
                                            No license records found.
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
