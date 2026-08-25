import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/inertia-react';

const ReportsIndex = ({ metrics, center_performance, filters }) => {
    return (
        <AdminLayout>
            <Head title="Advanced Reporting Dashboard" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">System Financial Reports</h1>
                    
                    {/* Filters Placeholder */}
                    <div className="bg-white p-2 rounded shadow flex space-x-4">
                        <input type="date" defaultValue={filters.start_date} className="border rounded px-2 py-1" />
                        <input type="date" defaultValue={filters.end_date} className="border rounded px-2 py-1" />
                        <button className="bg-blue-600 text-white px-4 py-1 rounded">Filter</button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
                        <div className="flex items-center">
                            <i className="fa fa-money text-3xl text-green-500 mr-4"></i>
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900">৳{metrics.total_revenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
                        <div className="flex items-center">
                            <i className="fa fa-exclamation-triangle text-3xl text-red-500 mr-4"></i>
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Total Dues (Pending)</p>
                                <p className="text-3xl font-bold text-gray-900">৳{metrics.total_dues.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <i className="fa fa-bank text-3xl text-blue-500 mr-4"></i>
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Commissions Paid</p>
                                <p className="text-3xl font-bold text-gray-900">৳{metrics.total_commissions.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Top Performing Centers</h2>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students Enrolled</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {center_performance.map((center, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {center.center_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {center.total_students} Students
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {center_performance.length === 0 && (
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 text-center text-gray-500">No data available for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ReportsIndex;
