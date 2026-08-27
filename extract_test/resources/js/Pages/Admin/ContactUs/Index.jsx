import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ contacts, search }) {
    const { app_url } = usePage().props;
    const messageList = contacts?.data || [];
    
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [aiResult, setAiResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get(getUrl('/admin/contactUs'), { search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const handleClear = () => {
        setSearchTerm('');
        Inertia.get(getUrl('/admin/contactUs'), {}, { preserveState: true, preserveScroll: true });
    };

    const openModal = (msg) => {
        setSelectedMessage(msg);
        if (!msg.is_seen) {
            Inertia.patch(getUrl(`/admin/contactUs/${msg.id}/mark-read`), {}, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const closeModal = () => {
        setSelectedMessage(null);
        setAiResult(null);
        setIsAnalyzing(false);
        setCopied(false);
    };

    const handleAiAnalyze = async (msgId) => {
        setIsAnalyzing(true);
        setAiResult(null);
        setCopied(false);
        try {
            const response = await fetch(getUrl(`/admin/contactUs/${msgId}/ai-analyze`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                }
            });
            const resData = await response.json();
            if (resData.success) {
                setAiResult(resData);
            }
        } catch (error) {
            console.error("AI Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            Inertia.delete(getUrl(`/admin/contactUs/${id}`), {
                preserveScroll: true
            });
            if (selectedMessage && selectedMessage.id === id) {
                closeModal();
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="Contact Us Inquiries Management">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Student & Public Inquiries</h2>
                        <p className="text-xs text-slate-500">View and manage contact us messages and inquiry support history.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="relative w-full max-w-md">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Name, Email, or Phone..."
                            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#7024A8]/20 focus:border-[#7024A8] outline-none transition"
                        />
                        {searchTerm && (
                            <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        )}
                    </form>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="text-[11px] font-bold text-slate-500 uppercase bg-slate-50 border-b border-slate-200 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-20">Status</th>
                                    <th className="px-6 py-4">Sender Details</th>
                                    <th className="px-6 py-4">Message Snippet</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {messageList.length > 0 ? (
                                    messageList.map((msg) => (
                                        <tr key={msg.id} className={`hover:bg-slate-50/50 transition cursor-pointer ${!msg.is_seen ? 'bg-purple-50/20' : ''}`} onClick={() => openModal(msg)}>
                                            <td className="px-6 py-4 text-center">
                                                {!msg.is_seen ? (
                                                    <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                                        NEW
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        <i className="fa-solid fa-check"></i> Read
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{msg.name}</div>
                                                <div className="text-xs text-slate-500">{msg.email || msg.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className={`text-xs ${!msg.is_seen ? 'font-bold text-slate-800' : 'text-slate-600 font-medium'} line-clamp-2 max-w-xs`}>
                                                    {msg.message}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                                                {formatDate(msg.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <button onClick={() => openModal(msg)} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition shadow-sm">
                                                        <i className="fa-regular fa-eye"></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(msg.id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition shadow-sm">
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-3">
                                                <i className="fa-solid fa-inbox text-2xl"></i>
                                            </div>
                                            <p className="text-slate-500 font-medium">No contact inquiries found.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {contacts?.links && contacts.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-center sm:justify-end">
                            <div className="flex flex-wrap items-center gap-1">
                                {contacts.links.map((link, idx) => (
                                    <Link
                                        key={`pagination-${idx}`}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                                            link.active 
                                                ? 'bg-[#7024A8] text-white border border-[#7024A8]' 
                                                : !link.url 
                                                    ? 'bg-transparent text-slate-300 border border-transparent cursor-not-allowed' 
                                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        onClick={(e) => !link.url && e.preventDefault()}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <i className="fa-solid fa-envelope-open-text text-[#7024A8]"></i> Inquiry Details
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-rose-500 transition">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 flex flex-col sm:flex-row gap-4 mb-6 relative">
                                <div className="absolute top-4 right-4">
                                    <button 
                                        onClick={() => handleAiAnalyze(selectedMessage.id)}
                                        disabled={isAnalyzing}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition ${isAnalyzing ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md hover:from-indigo-600 hover:to-purple-700'}`}
                                    >
                                        {isAnalyzing ? (
                                            <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</>
                                        ) : (
                                            <><i className="fa-solid fa-wand-magic-sparkles"></i> Analyze with AI</>
                                        )}
                                    </button>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-[#7024A8] text-white flex items-center justify-center text-xl shrink-0 font-bold uppercase shadow-sm">
                                    {selectedMessage.name.charAt(0)}
                                </div>
                                <div className="flex-1 pr-24">
                                    <h4 className="font-black text-slate-900 text-lg">{selectedMessage.name}</h4>
                                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs font-medium text-slate-600">
                                        {selectedMessage.email && (
                                            <a href={`mailto:${selectedMessage.email}`} className="hover:text-[#7024A8] flex items-center gap-1">
                                                <i className="fa-regular fa-envelope"></i> {selectedMessage.email}
                                            </a>
                                        )}
                                        {selectedMessage.phone && (
                                            <a href={`tel:${selectedMessage.phone}`} className="hover:text-[#7024A8] flex items-center gap-1">
                                                <i className="fa-solid fa-phone"></i> {selectedMessage.phone}
                                            </a>
                                        )}
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <i className="fa-regular fa-calendar"></i> {formatDate(selectedMessage.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {aiResult && (
                                <div className="mb-6 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl overflow-hidden shadow-sm animate-[fadeIn_0.3s_ease-out]">
                                    <div className="px-4 py-2.5 bg-indigo-50/80 border-b border-indigo-100 flex items-center justify-between">
                                        <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                                            <i className="fa-solid fa-robot"></i> {aiResult.source}
                                        </span>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-indigo-600 border border-indigo-200">
                                                {aiResult.data.category}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${aiResult.data.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-200' : aiResult.data.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                                {aiResult.data.priority} Priority
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-end mb-2">
                                            <h6 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Suggested Reply Draft</h6>
                                            <button 
                                                onClick={() => copyToClipboard(aiResult.data.suggested_reply)}
                                                className={`text-[10px] font-bold px-2 py-1 rounded transition ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                                            >
                                                {copied ? <><i className="fa-solid fa-check"></i> Copied!</> : <><i className="fa-regular fa-copy"></i> Copy Draft</>}
                                            </button>
                                        </div>
                                        <div className="bg-white border border-indigo-50 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap font-mono shadow-sm">
                                            {aiResult.data.suggested_reply}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message</h5>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                            <button onClick={closeModal} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-sm">
                                Close
                            </button>
                            {selectedMessage.email && (
                                <a 
                                    href={`mailto:${selectedMessage.email}?subject=Re: Your Inquiry to BDNSI`}
                                    className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-[#7024A8] hover:bg-purple-800 transition shadow-sm flex items-center gap-2"
                                >
                                    <i className="fa-solid fa-reply"></i> Reply via Email
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
