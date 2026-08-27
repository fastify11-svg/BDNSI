import React from 'react';
import { useForm, Head } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Index({ api_settings }) {
    const { data, setData, post, processing, errors } = useForm({
        gemini_api_key: api_settings?.gemini_api_key || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/api-settings', {
            onSuccess: () => alert('API Settings updated successfully!'),
        });
    };

    return (
        <AdminLayout title="API Settings">
            <Head title="API Settings" />
            
            <div className="max-w-4xl mx-auto py-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-5">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <i className="fa-solid fa-key text-[#7024A8]"></i>
                            Third-Party API Integration Settings
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Manage API keys for external services like Google Gemini AI securely from the database.
                        </p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Gemini API Key Block */}
                            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        <i className="fa-solid fa-robot text-lg"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">Google Gemini Vision API</h3>
                                        <p className="text-[11px] text-slate-500">Used for OCR text extraction from Student IDs and Passports</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">API Key</label>
                                    <input 
                                        type="password"
                                        placeholder="Enter Gemini API Key"
                                        className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        value={data.gemini_api_key}
                                        onChange={e => setData('gemini_api_key', e.target.value)}
                                    />
                                    {errors.gemini_api_key && <p className="text-red-500 text-xs mt-1">{errors.gemini_api_key}</p>}
                                    <p className="text-[10px] text-slate-400 mt-2">
                                        Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>. Leave empty to fallback to .env configuration.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-[#7024A8] hover:bg-[#5b1d8a] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-save"></i>}
                                    Save API Settings
                                </button>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
