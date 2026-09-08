import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/inertia-react';
import { 
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const ReportsIndex = ({ 
    metrics, 
    revenue_chart_data, 
    center_performance, 
    product_demand,
    top_agents,
    credit_exposure,
    filters 
}) => {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [activeTab, setActiveTab] = useState('financial');

    const handleFilter = () => {
        router.get(route('admin.reports.index'), {
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Advanced Reporting Dashboard" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">System Financial Reports</h1>
                    
                    <div className="bg-white p-2 rounded shadow flex space-x-4">
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            className="border rounded px-2 py-1" 
                        />
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            className="border rounded px-2 py-1" 
                        />
                        <button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Filter</button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Pending Dues</p>
                                <p className="text-3xl font-bold text-gray-900">৳{metrics.total_dues.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <i className="fa fa-bank text-3xl text-blue-500 mr-4"></i>
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Commissions</p>
                                <p className="text-3xl font-bold text-gray-900">৳{metrics.total_commissions.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
                        <div className="flex items-center">
                            <i className="fa fa-certificate text-3xl text-purple-500 mr-4"></i>
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Certificates & Verifications</p>
                                <p className="text-xl font-bold text-gray-900">{metrics.total_issuances.toLocaleString()} Issued</p>
                                <p className="text-sm font-semibold text-gray-600">{metrics.total_verifications.toLocaleString()} Verified</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('financial')}
                            className={`${activeTab === 'financial' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Financial & Revenue
                        </button>
                        <button
                            onClick={() => setActiveTab('sales')}
                            className={`${activeTab === 'sales' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Sales & Agents
                        </button>
                        <button
                            onClick={() => setActiveTab('operational')}
                            className={`${activeTab === 'operational' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Operational & Academic
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'financial' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue vs Collection Chart */}
                        <div className="bg-white rounded-xl shadow p-6 col-span-1 lg:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue vs Collection (Selected Period)</h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenue_chart_data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
                                        <Legend />
                                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" activeDot={{ r: 8 }} name="Gross Revenue" />
                                        <Line type="monotone" dataKey="collection" stroke="#10b981" name="Collected" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Credit Exposure Table */}
                        <div className="bg-white rounded-xl shadow overflow-hidden col-span-1 lg:col-span-2">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-800">Credit Exposure & Risk (Top Centers by Due)</h2>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Center</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limit</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {credit_exposure.map((center, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{center.center_name} ({center.center_code})</td>
                                            <td className="px-6 py-4 text-sm text-red-600 font-bold">৳{center.due.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">৳{center.credit_limit.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div className={`h-2.5 rounded-full ${center.utilization >= 100 ? 'bg-red-600' : center.utilization >= 80 ? 'bg-yellow-400' : 'bg-green-600'}`} style={{ width: `${Math.min(center.utilization, 100)}%` }}></div>
                                                </div>
                                                <span className="text-xs text-gray-500">{center.utilization}%</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${center.classification === 'CREDIT_LIMIT_REACHED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {center.classification}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {credit_exposure.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No centers currently have pending dues.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'sales' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Centers */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Centers (Registrations)</h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={center_performance} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="center_name" type="category" width={150} tick={{fontSize: 12}} />
                                        <Tooltip />
                                        <Bar dataKey="total_students" fill="#3b82f6" name="Total Enrolled" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Agents */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Sales Agents (Commission Earned)</h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={top_agents} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="agent_name" tick={{fontSize: 12}} />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `৳${value.toLocaleString()}`} />
                                        <Bar dataKey="total_earned" fill="#8b5cf6" name="Commission Earned" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'operational' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Product Demand */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Product / Course Demand</h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={product_demand}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="total"
                                            nameKey="subject_name"
                                            label={({ subject_name, percent }) => `${subject_name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {product_demand.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ReportsIndex;
