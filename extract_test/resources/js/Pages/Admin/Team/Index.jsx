import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, useForm, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ teams }) {
    const { app_url } = usePage().props;
    const teamList = teams?.data || teams || [];

    const [deleteModal, setDeleteModal] = useState(null);
    const [editModal, setEditModal] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const filteredTeams = teamList.filter(team => activeTab === 'all' || team.status.toString() === activeTab);

    const { data, setData, post, reset, errors, processing: formProcessing, clearErrors } = useForm({
        name: '',
        designation: '',
        description: '',
        bn_name: '',
        bn_designation: '',
        bn_description: '',
        ar_name: '',
        ar_designation: '',
        ar_description: '',
        facebook_link: '',
        twitter_link: '',
        linkedin_link: '',
        phone: '',
        email: '',
        status: 1,
        order_index: 0,
        image: null,
    });

    const editForm = useForm({
        _method: 'PUT',
        name: '',
        designation: '',
        description: '',
        bn_name: '',
        bn_designation: '',
        bn_description: '',
        ar_name: '',
        ar_designation: '',
        ar_description: '',
        facebook_link: '',
        twitter_link: '',
        linkedin_link: '',
        phone: '',
        email: '',
        status: 1,
        order_index: 0,
        image: null,
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post(getUrl('/admin/team'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setImagePreview(null);
                clearErrors();
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.post(getUrl(`/admin/team/${editModal.id}`), {
            preserveScroll: true,
            onSuccess: () => {
                setEditModal(null);
                setEditImagePreview(null);
                editForm.reset();
                editForm.clearErrors();
            }
        });
    };

    const openEditModal = (team) => {
        setEditModal(team);
        editForm.setData({
            _method: 'PUT',
            name: team.name || '',
            designation: team.designation || '',
            description: team.description || '',
            bn_name: team.bn_name || '',
            bn_designation: team.bn_designation || '',
            bn_description: team.bn_description || '',
            ar_name: team.ar_name || '',
            ar_designation: team.ar_designation || '',
            ar_description: team.ar_description || '',
            facebook_link: team.facebook_link || '',
            twitter_link: team.twitter_link || '',
            linkedin_link: team.linkedin_link || '',
            phone: team.phone || '',
            email: team.email || '',
            status: team.status,
            order_index: team.order_index,
            image: null,
        });
        setEditImagePreview(team.image);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            editForm.setData('image', file);
            setEditImagePreview(URL.createObjectURL(file));
        }
    };

    const handleConfirmDelete = () => {
        if (!deleteModal) return;
        setProcessing(true);
        Inertia.delete(getUrl(`/admin/team/${deleteModal.id}`), {
            onFinish: () => {
                setProcessing(false);
                setDeleteModal(null);
            }
        });
    };

    return (
        <AdminLayout title="Team & Staff Management">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leadership & Team</h1>
                        <p className="text-xs text-slate-500">Manage institute instructors, staff members, and executive board.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Data Table */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F8FAFC]">
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">STAFF DIRECTORY</p>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Active Team Members</h2>
                                </div>
                                <div className="flex bg-slate-200 p-1 rounded-xl">
                                    <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>All</button>
                                    <button onClick={() => setActiveTab('1')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === '1' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Active</button>
                                    <button onClick={() => setActiveTab('0')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === '0' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Inactive</button>
                                </div>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-[11px] text-slate-500 uppercase bg-white border-b border-slate-200/80 whitespace-nowrap font-extrabold">
                                        <tr>
                                            <th className="px-6 py-4">Profile & Name</th>
                                            <th className="px-6 py-4">Designation</th>
                                            <th className="px-6 py-4 text-center">Order</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredTeams.length > 0 ? (
                                            filteredTeams.map((member) => (
                                                <tr key={member.id} className="hover:bg-indigo-50/20 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                                                                <img
                                                                    src={member.image ? getUrl(member.image) : getUrl('/images/avatar.png')}
                                                                    alt={member.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => { e.target.src = getUrl('/images/avatar.png'); }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-extrabold text-slate-900 text-sm max-w-[200px] truncate">{member.name}</p>
                                                                <div className="flex gap-2 mt-1">
                                                                    {member.facebook_link && <a href={member.facebook_link} target="_blank" className="text-slate-400 hover:text-blue-600"><i className="fa-brands fa-facebook"></i></a>}
                                                                    {member.linkedin_link && <a href={member.linkedin_link} target="_blank" className="text-slate-400 hover:text-blue-700"><i className="fa-brands fa-linkedin"></i></a>}
                                                                    {member.phone && <a href={`tel:${member.phone}`} className="text-slate-400 hover:text-emerald-600"><i className="fa-solid fa-phone"></i></a>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                            {member.designation || 'Staff Member'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{member.order_index}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        {member.status ? (
                                                            <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-lg text-[10px] font-extrabold">Active</span>
                                                        ) : (
                                                            <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-[10px] font-extrabold">Inactive</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                                        <button
                                                            onClick={() => openEditModal(member)}
                                                            title="Edit Member Details"
                                                            className="p-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold inline-flex items-center border border-indigo-200 transition"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteModal(member)}
                                                            title="Delete Member"
                                                            className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold inline-flex items-center border border-rose-200 transition"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                                                    No team members found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {teams?.links && teams.links.length > 3 && (
                            <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">
                                    Showing {teams.from || 0} to {teams.to || 0} of {teams.total || 0} members
                                </span>
                                <div className="flex items-center gap-1">
                                    {teams.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url ? getUrl(link.url) : '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1.5 rounded-xl font-bold transition ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white shadow-xs'
                                                    : link.url
                                                    ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                                    : 'text-slate-300 cursor-not-allowed'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Smart Add Sidebar */}
                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 space-y-6 h-fit sticky top-6 overflow-y-auto max-h-[90vh]">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">SMART ADD</p>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 mt-1">
                                <i className="fa-solid fa-user-plus text-indigo-600"></i>
                                <span>Add Team Member</span>
                            </h3>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Name (English)</label>
                                <input type="text" required value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                {errors.name && <p className="text-[10px] text-rose-600 mt-1">{errors.name}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Designation (English)</label>
                                <input type="text" required value={data.designation} onChange={(e) => setData('designation', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Description (English)</label>
                                <textarea rows="3" value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500" placeholder="Brief bio or description..."></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Sort Order</label>
                                    <input type="number" value={data.order_index} onChange={(e) => setData('order_index', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Status</label>
                                    <label className="flex items-center cursor-pointer mt-1">
                                        <div className="relative">
                                            <input type="checkbox" className="sr-only" checked={data.status === 1} onChange={(e) => setData('status', e.target.checked ? 1 : 0)} />
                                            <div className={`block w-10 h-6 rounded-full transition-colors ${data.status ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.status ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="pt-2 border-t border-slate-100">
                                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">Social & Contact</label>
                                <div className="space-y-2">
                                    <input type="text" placeholder="Facebook URL" value={data.facebook_link} onChange={(e) => setData('facebook_link', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                    <input type="text" placeholder="LinkedIn URL" value={data.linkedin_link} onChange={(e) => setData('linkedin_link', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                    <input type="text" placeholder="Phone Number" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                    <input type="email" placeholder="Email Address" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-2">Translations (Optional)</label>
                                <div className="space-y-2">
                                    <input type="text" placeholder="Name (Bangla)" value={data.bn_name} onChange={(e) => setData('bn_name', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                    <input type="text" placeholder="Designation (Bangla)" value={data.bn_designation} onChange={(e) => setData('bn_designation', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                    <textarea rows="2" placeholder="Description (Bangla)" value={data.bn_description} onChange={(e) => setData('bn_description', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none"></textarea>
                                    <input type="text" placeholder="Name (Arabic)" value={data.ar_name} onChange={(e) => setData('ar_name', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                    <input type="text" placeholder="Designation (Arabic)" value={data.ar_designation} onChange={(e) => setData('ar_designation', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                    <textarea rows="2" placeholder="Description (Arabic)" value={data.ar_description} onChange={(e) => setData('ar_description', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none"></textarea>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Profile Photo</label>
                                <div className="mt-1 flex justify-center px-6 pt-4 pb-4 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition group relative overflow-hidden">
                                    {imagePreview ? (
                                        <div className="absolute inset-0 w-full h-full">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-xs font-bold flex items-center gap-2"><i className="fa-solid fa-camera"></i> Change</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-center">
                                            <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-400 group-hover:text-indigo-500 transition"></i>
                                            <div className="flex text-[10px] text-slate-600 justify-center">
                                                <span className="relative cursor-pointer bg-white rounded-md font-bold text-indigo-600 hover:text-indigo-500">Upload</span>
                                            </div>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                {errors.image && <p className="text-[10px] text-rose-600 mt-1">{errors.image}</p>}
                            </div>

                            <button type="submit" disabled={formProcessing} className="w-full py-2.5 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2">
                                <i className="fa-solid fa-user-plus"></i>
                                <span>Save Team Member</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div onClick={() => setEditModal(null)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-10 border border-slate-200/80 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
                            <h3 className="text-lg font-black text-slate-900">Edit Team Member</h3>
                            <button onClick={() => setEditModal(null)} className="text-slate-400 hover:text-slate-700 transition">
                                <i className="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <form id="editForm" onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Name (English)</label>
                                        <input type="text" required value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Designation (English)</label>
                                        <input type="text" required value={editForm.data.designation} onChange={(e) => editForm.setData('designation', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Description (English)</label>
                                        <textarea rows="3" value={editForm.data.description} onChange={(e) => editForm.setData('description', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500"></textarea>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Social & Contact Links</label>
                                        <div className="space-y-2">
                                            <input type="text" placeholder="Facebook URL" value={editForm.data.facebook_link} onChange={(e) => editForm.setData('facebook_link', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                            <input type="text" placeholder="LinkedIn URL" value={editForm.data.linkedin_link} onChange={(e) => editForm.setData('linkedin_link', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                            <input type="text" placeholder="Phone" value={editForm.data.phone} onChange={(e) => editForm.setData('phone', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                            <input type="email" placeholder="Email" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Translations (Optional)</label>
                                        <div className="space-y-2">
                                            <input type="text" placeholder="Name (Bangla)" value={editForm.data.bn_name} onChange={(e) => editForm.setData('bn_name', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                            <input type="text" placeholder="Designation (Bangla)" value={editForm.data.bn_designation} onChange={(e) => editForm.setData('bn_designation', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                            <textarea rows="2" placeholder="Description (Bangla)" value={editForm.data.bn_description} onChange={(e) => editForm.setData('bn_description', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none"></textarea>
                                            <input type="text" placeholder="Name (Arabic)" value={editForm.data.ar_name} onChange={(e) => editForm.setData('ar_name', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                            <input type="text" placeholder="Designation (Arabic)" value={editForm.data.ar_designation} onChange={(e) => editForm.setData('ar_designation', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none" />
                                            <textarea rows="2" placeholder="Description (Arabic)" value={editForm.data.ar_description} onChange={(e) => editForm.setData('ar_description', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none"></textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Sort Order</label>
                                        <input type="number" value={editForm.data.order_index} onChange={(e) => editForm.setData('order_index', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Status</label>
                                        <label className="flex items-center cursor-pointer mt-1">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only" checked={editForm.data.status === 1} onChange={(e) => editForm.setData('status', e.target.checked ? 1 : 0)} />
                                                <div className={`block w-10 h-6 rounded-full transition-colors ${editForm.data.status ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${editForm.data.status ? 'transform translate-x-4' : ''}`}></div>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Update Photo</label>
                                        <div className="mt-1 flex items-center gap-3">
                                            {editImagePreview && (
                                                <img src={editImagePreview.startsWith('blob:') ? editImagePreview : getUrl(editImagePreview)} alt="Preview" className="w-12 h-12 object-cover rounded-full border border-slate-200" />
                                            )}
                                            <input type="file" accept="image/*" onChange={handleEditImageChange} className="text-[10px]" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl flex justify-end gap-3">
                            <button type="button" onClick={() => setEditModal(null)} className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition">Cancel</button>
                            <button type="submit" form="editForm" disabled={editForm.processing} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        onClick={() => setDeleteModal(null)}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                    ></div>

                    <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-slate-200/80 space-y-6 animate-in fade-in zoom-in-95 duration-150">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-user-xmark"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Remove Team Member?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to remove <strong className="text-slate-800">{deleteModal.name}</strong> from the institute team directory?
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={processing}
                                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                            >
                                Confirm Removal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
