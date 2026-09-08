import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { InertiaLink as Link, useForm } from '@inertiajs/inertia-react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';

export default function Index({ leads }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        status: 'New',
        source: '',
        proposed_price: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.leads.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            },
        });
    };
    
    return (
        <AdminLayout>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Sales CRM - Leads</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add New Lead
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Follow Up</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proposed Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {leads.data && leads.data.length > 0 ? (
                            leads.data.map((lead) => (
                                <tr key={lead.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{lead.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{lead.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                                              lead.status === 'Converted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {lead.follow_up_date || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                        {lead.proposed_price ? `৳${lead.proposed_price}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {lead.status === 'Converted' && lead.center_id ? (
                                            <Link href={route('admin.center.edit', lead.center_id)} className="text-green-600 hover:text-green-900">
                                                View Center
                                            </Link>
                                        ) : (
                                            <Link href={route('admin.leads.convert', lead.id)} method="post" as="button" type="button" className="text-blue-600 hover:text-blue-900">
                                                Convert
                                            </Link>
                                        )}
                                        <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No leads found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {leads.links && <Pagination links={leads.links} />}
            </div>
            
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Lead</h3>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                required 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input 
                                type="text" 
                                name="phone"
                                value={data.phone} 
                                onChange={e => setData('phone', e.target.value)} 
                                required 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                            />
                            {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select 
                                name="status"
                                value={data.status} 
                                onChange={e => setData('status', e.target.value)} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Negotiating">Negotiating</option>
                                <option value="Converted">Converted</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Lost">Lost</option>
                            </select>
                            {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Proposed Price (৳)</label>
                            <input 
                                type="number" 
                                name="proposed_price"
                                step="0.01"
                                value={data.proposed_price} 
                                onChange={e => setData('proposed_price', e.target.value)} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                            />
                            {errors.proposed_price && <div className="text-red-500 text-xs mt-1">{errors.proposed_price}</div>}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                {processing ? 'Saving...' : 'Save Lead'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

        </AdminLayout>
    );
}
