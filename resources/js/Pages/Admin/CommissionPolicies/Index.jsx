import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, policies, teams }) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'percentage',
        value: '',
        team_id: '',
        product_type: '',
        is_active: true
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.commission-policies.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    return (
        <AdminLayout user={auth.admin} title="Commission Rules">
            <Head title="Commission Rules" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Rules</h3>
                            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
                                Add Rule
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Specific</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {policies.data.map((policy) => (
                                        <tr key={policy.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.value} {policy.type === 'percentage' ? '%' : '৳'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.team ? policy.team.name : 'Global (All)'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.is_active ? 'Active' : 'Inactive'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={policies.links} />
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-4">Add Commission Rule</h3>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Value</label>
                                <input type="number" step="0.01" required value={data.value} onChange={e => setData('value', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Specific Team (Optional)</label>
                                <select value={data.team_id} onChange={e => setData('team_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="">Global (Applies to all)</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded">Save Rule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
