import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, useForm, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Index({ sliders }) {
    const { app_url } = usePage().props;
    const sliderList = sliders?.data || sliders || [];

    const [deleteModal, setDeleteModal] = useState(null);
    const [editModal, setEditModal] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const filteredSliders = sliderList.filter(slider => activeTab === 'all' || slider.type.toString() === activeTab);

    const { data, setData, post, reset, errors, processing: formProcessing, clearErrors } = useForm({
        title: '',
        subtitle: '',
        button_text: '',
        button_link: '',
        status: 1,
        order_index: 0,
        type: '0', // 0: Slider, 1: Gallery
        photo: null,
    });

    const editForm = useForm({
        _method: 'PUT',
        title: '',
        subtitle: '',
        button_text: '',
        button_link: '',
        status: 1,
        order_index: 0,
        type: '0',
        photo: null,
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post(getUrl('/admin/slider'), {
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
        editForm.post(getUrl(`/admin/slider/${editModal.id}`), {
            preserveScroll: true,
            onSuccess: () => {
                setEditModal(null);
                setEditImagePreview(null);
                editForm.reset();
                editForm.clearErrors();
            }
        });
    };

    const openEditModal = (slider) => {
        setEditModal(slider);
        editForm.setData({
            _method: 'PUT',
            title: slider.title || '',
            subtitle: slider.subtitle || '',
            button_text: slider.button_text || '',
            button_link: slider.button_link || '',
            status: slider.status,
            order_index: slider.order_index,
            type: slider.type.toString(),
            photo: null,
        });
        setEditImagePreview(slider.photo);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('photo', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            editForm.setData('photo', file);
            setEditImagePreview(URL.createObjectURL(file));
        }
    };

    const handleConfirmDelete = () => {
        if (!deleteModal) return;
        setProcessing(true);
        Inertia.delete(getUrl(`/admin/slider/${deleteModal.id}`), {
            onFinish: () => {
                setProcessing(false);
                setDeleteModal(null);
            }
        });
    };

    return (
        <AdminLayout title="Slider & Gallery Management">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sliders & Photo Gallery</h1>
                        <p className="text-xs text-slate-500">Manage homepage hero banners and image gallery.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Data Table */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">GALLERY CONTENT</p>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Active Images</h2>
                                </div>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('0')}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === '0' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        Hero Sliders
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('1')}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === '1' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        Photo Gallery
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs text-slate-500 uppercase bg-[#F8FAFC] border-b border-slate-200/80 whitespace-nowrap">
                                        <tr>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Preview & Title</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Type</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700 text-center">Order</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700 text-center">Status</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredSliders.length > 0 ? (
                                            filteredSliders.map((slider) => (
                                                <tr key={slider.id} className="hover:bg-slate-50/70 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-20 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 group">
                                                                <img
                                                                    src={slider.photo || getUrl('/images/student/logo.png')}
                                                                    alt={slider.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                                    onError={(e) => { e.target.src = getUrl('/images/student/logo.png'); }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-xs max-w-[200px] truncate">{slider.title || 'Untitled Banner'}</p>
                                                                {slider.subtitle && <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{slider.subtitle}</p>}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${
                                                            slider.type === 0 
                                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        }`}>
                                                            {slider.type === 0 ? 'Hero Slider' : 'Photo Gallery'}
                                                        </span>
                                                    </td>
                                                    
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{slider.order_index}</span>
                                                    </td>
                                                    
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        {slider.status ? (
                                                            <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-lg text-[10px] font-extrabold">Active</span>
                                                        ) : (
                                                            <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-[10px] font-extrabold">Inactive</span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                                        <button
                                                            onClick={() => openEditModal(slider)}
                                                            title="Edit Image"
                                                            className="p-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold inline-flex items-center border border-indigo-200 transition"
                                                        >
                                                            <i className="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteModal(slider)}
                                                            title="Delete Image"
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
                                                    No slider images found. Add one from the right panel.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {sliders?.links && sliders.links.length > 3 && (
                            <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">
                                    Showing {sliders.from || 0} to {sliders.to || 0} of {sliders.total || 0} entries
                                </span>
                                <div className="flex items-center gap-1">
                                    {sliders.links.map((link, idx) => (
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
                                <i className="fa-solid fa-images text-purple-600"></i>
                                <span>Add New Banner</span>
                            </h3>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Annual Festival 2026"
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Subtitle / Description
                                </label>
                                <input
                                    type="text"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                    placeholder="e.g. Join us for the biggest event of the year."
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.subtitle && <p className="text-xs text-rose-600 mt-1">{errors.subtitle}</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                        Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={data.button_text}
                                        onChange={(e) => setData('button_text', e.target.value)}
                                        placeholder="e.g. Learn More"
                                        className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    />
                                    {errors.button_text && <p className="text-xs text-rose-600 mt-1">{errors.button_text}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        value={data.order_index}
                                        onChange={(e) => setData('order_index', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Button URL
                                </label>
                                <input
                                    type="text"
                                    value={data.button_link}
                                    onChange={(e) => setData('button_link', e.target.value)}
                                    placeholder="e.g. https://example.com/apply"
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.button_link && <p className="text-xs text-rose-600 mt-1">{errors.button_link}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Status
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={data.status === 1} onChange={(e) => setData('status', e.target.checked ? 1 : 0)} />
                                        <div className={`block w-10 h-6 rounded-full transition-colors ${data.status ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.status ? 'transform translate-x-4' : ''}`}></div>
                                    </div>
                                    <div className="ml-3 text-xs font-bold text-slate-700">
                                        {data.status ? 'Active' : 'Inactive'}
                                    </div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Display Type *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`cursor-pointer px-3 py-2.5 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${data.type === '0' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                                        <input type="radio" name="type" value="0" className="hidden" onChange={(e) => setData('type', e.target.value)} checked={data.type === '0'} />
                                        <i className="fa-solid fa-panorama"></i>
                                        Hero Slider
                                    </label>
                                    <label className={`cursor-pointer px-3 py-2.5 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${data.type === '1' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                                        <input type="radio" name="type" value="1" className="hidden" onChange={(e) => setData('type', e.target.value)} checked={data.type === '1'} />
                                        <i className="fa-solid fa-camera-retro"></i>
                                        Photo Gallery
                                    </label>
                                </div>
                                {errors.type && <p className="text-xs text-rose-600 mt-1">{errors.type}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Upload Photo *
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition group relative overflow-hidden">
                                    {imagePreview ? (
                                        <div className="absolute inset-0 w-full h-full">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-xs font-bold flex items-center gap-2">
                                                    <i className="fa-solid fa-camera"></i> Change Image
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-center">
                                            <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 group-hover:text-indigo-500 transition"></i>
                                            <div className="flex text-xs text-slate-600 justify-center">
                                                <span className="relative cursor-pointer bg-white rounded-md font-bold text-indigo-600 hover:text-indigo-500">
                                                    <span>Upload a file</span>
                                                </span>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-[10px] text-slate-500">PNG, JPG, GIF up to 2MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                </div>
                                {errors.photo && <p className="text-xs text-rose-600 mt-1">{errors.photo}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={formProcessing}
                                className="w-full py-3 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-upload"></i>
                                <span>Upload & Publish</span>
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
                            <h3 className="text-lg font-black text-slate-900">Edit Slider</h3>
                            <button onClick={() => setEditModal(null)} className="text-slate-400 hover:text-slate-700 transition">
                                <i className="fa-solid fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <form id="editForm" onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Title</label>
                                        <input type="text" value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Subtitle</label>
                                        <input type="text" value={editForm.data.subtitle} onChange={(e) => editForm.setData('subtitle', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none transition" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Button Text</label>
                                        <input type="text" value={editForm.data.button_text} onChange={(e) => editForm.setData('button_text', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Button URL</label>
                                        <input type="text" value={editForm.data.button_link} onChange={(e) => editForm.setData('button_link', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none transition" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Sort Order</label>
                                        <input type="number" value={editForm.data.order_index} onChange={(e) => editForm.setData('order_index', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Status</label>
                                        <label className="flex items-center cursor-pointer mt-2">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only" checked={editForm.data.status === 1} onChange={(e) => editForm.setData('status', e.target.checked ? 1 : 0)} />
                                                <div className={`block w-10 h-6 rounded-full transition-colors ${editForm.data.status ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${editForm.data.status ? 'transform translate-x-4' : ''}`}></div>
                                            </div>
                                            <div className="ml-3 text-xs font-bold text-slate-700">{editForm.data.status ? 'Active' : 'Inactive'}</div>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Display Type</label>
                                        <select value={editForm.data.type} onChange={(e) => editForm.setData('type', e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none transition">
                                            <option value="0">Hero Slider</option>
                                            <option value="1">Photo Gallery</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Update Photo (Optional)</label>
                                    <div className="mt-1 flex items-center gap-4">
                                        {editImagePreview && (
                                            <img src={editImagePreview.startsWith('blob:') ? editImagePreview : getUrl(editImagePreview)} alt="Preview" className="w-24 h-16 object-cover rounded-xl border border-slate-200" />
                                        )}
                                        <input type="file" accept="image/*" onChange={handleEditImageChange} className="text-xs" />
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
                            <i className="fa-solid fa-trash-can"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Delete Image?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to remove <strong className="text-slate-800">{deleteModal.title || 'this image'}</strong> from the gallery?
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
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
