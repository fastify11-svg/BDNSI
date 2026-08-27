import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/inertia-react';
import { getUrl } from '@/utils/urlHelper';

// Unit conversion helpers (assuming 96 DPI)
const PX_PER_INCH = 96;
const PX_PER_MM = 3.7795275591;
const PX_PER_CM = 37.795275591;

const toPx = (val, unit) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    if (unit === 'in') return Math.round(num * PX_PER_INCH);
    if (unit === 'mm') return Math.round(num * PX_PER_MM);
    if (unit === 'cm') return Math.round(num * PX_PER_CM);
    return num;
};

const fromPx = (px, unit) => {
    const num = parseFloat(px);
    if (isNaN(num)) return 0;
    if (unit === 'in') return (num / PX_PER_INCH).toFixed(2);
    if (unit === 'mm') return (num / PX_PER_MM).toFixed(1);
    if (unit === 'cm') return (num / PX_PER_CM).toFixed(2);
    return Math.round(num);
};

export default function Create(props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'certificate',
        width: '1123px', // Default A4 Landscape pixels (96 DPI)
        height: '794px',
        background_color: '#ffffff',
        background_image: null,
    });

    const [unit, setUnit] = useState('px');
    const [orientation, setOrientation] = useState('landscape');
    const [previewUrl, setPreviewUrl] = useState(null);

    // Derived display values based on unit
    const [displayW, setDisplayW] = useState(fromPx(1123, 'px'));
    const [displayH, setDisplayH] = useState(fromPx(794, 'px'));

    const presetDimensions = {
        'A4': { width: 1123, height: 794 }, // Landscape by default for these numbers
        'ID Card (CR80)': { width: 1016, height: 648 },
        'Letter': { width: 1056, height: 816 },
    };

    // Update real data when display dims change
    useEffect(() => {
        const wPx = toPx(displayW, unit);
        const hPx = toPx(displayH, unit);
        setData(prev => ({ ...prev, width: `${wPx}px`, height: `${hPx}px` }));
    }, [displayW, displayH, unit]);

    // Handle background preview
    useEffect(() => {
        if (data.background_image) {
            const url = URL.createObjectURL(data.background_image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [data.background_image]);

    const handlePresetChange = (presetName) => {
        const dims = presetDimensions[presetName];
        if (dims) {
            const isLandscape = orientation === 'landscape';
            const w = isLandscape ? Math.max(dims.width, dims.height) : Math.min(dims.width, dims.height);
            const h = isLandscape ? Math.min(dims.width, dims.height) : Math.max(dims.width, dims.height);
            setDisplayW(fromPx(w, unit));
            setDisplayH(fromPx(h, unit));
        }
    };

    const toggleOrientation = () => {
        const newOrientation = orientation === 'landscape' ? 'portrait' : 'landscape';
        setOrientation(newOrientation);
        // Swap dimensions
        const temp = displayW;
        setDisplayW(displayH);
        setDisplayH(temp);
    };

    const submit = (e) => {
        e.preventDefault();
        post(getUrl('/admin/document-templates'));
    };

    return (
        <AdminLayout title="Create Document Template">
            <Head title="Create Document Template" />
            
            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <Link href={getUrl('/admin/document-templates')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center transition-colors">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                Back to Library
                            </Link>
                            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">Create New Template</h2>
                            <p className="mt-1 text-sm text-gray-500">Configure the base canvas and properties for your dynamic document.</p>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100 flex flex-col md:flex-row">
                        <div className="p-8 flex-1 border-r border-gray-100">
                            <form onSubmit={submit} className="space-y-8">
                                
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md transition-shadow py-2.5"
                                                placeholder="e.g., Spring 2025 Admit Card"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {errors.name && <p className="mt-2 text-sm text-red-600" id="name-error">{errors.name}</p>}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Document Type</label>
                                        <div className="mt-1">
                                            <select
                                                id="type"
                                                name="type"
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md transition-shadow py-2.5"
                                                value={data.type}
                                                onChange={e => setData('type', e.target.value)}
                                            >
                                                <option value="admit_card">Admit Card</option>
                                                <option value="registration_card">Registration Card</option>
                                                <option value="transcript">Transcript</option>
                                                <option value="certificate">Certificate</option>
                                                <option value="original_certificate">Original Certificate</option>
                                                <option value="original_c_pdf">Original C-Pdf</option>
                                                <option value="certificate_pdf">Certificate PDF</option>
                                                <option value="id_card">ID Card</option>
                                            </select>
                                        </div>
                                        {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type}</p>}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Canvas Dimensions</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Set the dimensions of the document.
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                                            {['px', 'mm', 'cm', 'in'].map(u => (
                                                <button
                                                    key={u}
                                                    type="button"
                                                    onClick={() => {
                                                        const curW_px = toPx(displayW, unit);
                                                        const curH_px = toPx(displayH, unit);
                                                        setUnit(u);
                                                        setDisplayW(fromPx(curW_px, u));
                                                        setDisplayH(fromPx(curH_px, u));
                                                    }}
                                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${unit === u ? 'bg-white shadow text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    {u.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2 mb-6 items-center">
                                        {Object.keys(presetDimensions).map(preset => (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => handlePresetChange(preset)}
                                                className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                            >
                                                {preset}
                                            </button>
                                        ))}
                                        
                                        <button
                                            type="button"
                                            onClick={toggleOrientation}
                                            className="ml-auto inline-flex items-center px-4 py-2 border border-indigo-200 shadow-sm text-xs font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            {orientation === 'landscape' ? 'Landscape' : 'Portrait'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="width" className="block text-sm font-medium text-gray-700">Width ({unit})</label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="number"
                                                    step="any"
                                                    name="width"
                                                    id="width"
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2.5"
                                                    value={displayW}
                                                    onChange={e => setDisplayW(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height ({unit})</label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input
                                                    type="number"
                                                    step="any"
                                                    name="height"
                                                    id="height"
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2.5"
                                                    value={displayH}
                                                    onChange={e => setDisplayH(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400">Actual pixels: {data.width} x {data.height}</p>
                                </div>

                                <div className="pt-8 border-t border-gray-200">
                                    <div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Background Layer</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Select a solid background color and optionally upload a background image (JPEG/PNG).
                                        </p>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 gap-x-4">
                                        <div>
                                            <label htmlFor="background_color" className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                                            <div className="flex items-center space-x-3">
                                                <input 
                                                    type="color" 
                                                    id="background_color"
                                                    value={data.background_color} 
                                                    onChange={e => setData('background_color', e.target.value)}
                                                    className="w-10 h-10 rounded border-0 cursor-pointer shadow-sm p-0"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.background_color}
                                                    onChange={e => setData('background_color', e.target.value)}
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-24 sm:text-sm border-gray-300 rounded-md uppercase font-mono"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image (Optional)</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                        <span>Upload a file</span>
                                                        <input 
                                                            id="file-upload" 
                                                            name="file-upload" 
                                                            type="file" 
                                                            className="sr-only" 
                                                            accept="image/*"
                                                            onChange={e => setData('background_image', e.target.files[0])}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                            </div>
                                        </div>
                                        {errors.background_image && <p className="mt-2 text-sm text-red-600">{errors.background_image}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-gray-200">
                                    <div className="flex justify-end space-x-3">
                                        <Link
                                            href={getUrl('/admin/document-templates')}
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Creating...' : 'Create & Proceed to Design'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        {/* Live Preview Pane */}
                        <div className="w-full md:w-1/3 bg-gray-50 p-8 border-l border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6 w-full text-center">Live Canvas Preview</h4>
                            
                            <div className="relative flex items-center justify-center w-full h-full p-4 rounded-xl border border-gray-200" 
                                 style={{ 
                                     backgroundColor: data.background_color,
                                     aspectRatio: orientation === 'landscape' ? '1.414 / 1' : '1 / 1.414',
                                     maxHeight: '400px',
                                     boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)'
                                 }}>
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded drop-shadow-sm" />
                                ) : (
                                    <div className={`text-center ${data.background_color.toLowerCase() === '#ffffff' ? 'text-gray-400' : 'text-gray-800 mix-blend-difference opacity-70'}`}>
                                        <svg className={`mx-auto h-12 w-12 mb-2 ${data.background_color.toLowerCase() === '#ffffff' ? 'text-gray-300' : 'text-current'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span className="block text-sm">Solid Color Canvas</span>
                                        <span className="block text-xs mt-1 text-gray-300">({data.width} x {data.height})</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
