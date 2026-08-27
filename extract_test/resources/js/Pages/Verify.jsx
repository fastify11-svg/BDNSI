import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';
import { getUrl } from '../utils/urlHelper';

export default function Verify({ student }) {
    const { flash, errors } = usePage().props;
    
    const { data, setData, post, processing, reset } = useForm({
        registration: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(getUrl('/verify'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <FrontendLayout>
            <div className="space-y-8 max-w-4xl mx-auto py-8">
                {/* Header Banner */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-xs">
                        <i className="fa-solid fa-certificate"></i>
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7024A8]">VERIFICATION PORTAL</span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">Verify Student Registration & Diploma</h1>
                        <p className="text-xs text-slate-500 max-w-xl mx-auto mt-2 leading-relaxed">
                            Enter the student's Registration Number to verify their enrollment status, course details, and issued diploma authenticity.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-xs font-bold text-slate-700">Registration Number</label>
                            <input
                                type="text"
                                required
                                value={data.registration}
                                onChange={(e) => setData('registration', e.target.value)}
                                placeholder="Enter Registration Number (e.g. 1000000001)"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto px-8 py-3 bg-[#7024A8] hover:bg-[#581C87] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <span>Verifying...</span>
                            ) : (
                                <>
                                    <i className="fa-solid fa-search"></i>
                                    <span>Verify Now</span>
                                </>
                            )}
                        </button>
                    </form>
                    
                    {errors.error && (
                        <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-bold">
                            <i className="fa-solid fa-circle-xmark text-lg text-rose-600"></i>
                            <span>{errors.error}</span>
                        </div>
                    )}
                </div>

                {/* Result Display */}
                {student && (
                    <div className="bg-white rounded-xl border border-emerald-200 shadow-md overflow-hidden animate-fadeIn">
                        <div className="bg-emerald-600 text-white px-6 py-4 flex items-center gap-3">
                            <i className="fa-solid fa-shield-check text-2xl"></i>
                            <div>
                                <h2 className="font-black text-lg">Verified Authentic Record</h2>
                                <p className="text-[10px] font-medium text-emerald-100 uppercase tracking-widest">Official Student Database</p>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0">
                                <img
                                    src={student.picture ? getUrl(student.picture) : getUrl('/images/avatar.png')}
                                    alt={student.name}
                                    className="w-32 h-32 rounded-xl object-cover border-4 border-slate-100 shadow-sm"
                                />
                                <h3 className="text-xl font-black text-slate-900 mt-4 text-center">{student.name}</h3>
                                <div className="mt-2 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                                    <i className="fa-solid fa-check"></i>
                                    Status: Approved
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Registration No.</p>
                                    <p className="text-sm font-mono font-bold text-slate-900">{student.registration}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Course / Subject</p>
                                    <p className="text-sm font-bold text-slate-900">{student.subject?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Training Center</p>
                                    <p className="text-sm font-bold text-slate-900">{student.center?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Parents</p>
                                    <p className="text-xs font-semibold text-slate-700">F: {student.fathers_name}</p>
                                    <p className="text-xs font-semibold text-slate-700">M: {student.mothers_name}</p>
                                </div>
                                
                                {student.result && student.result.certificate && (
                                    <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                                        <p className="text-[10px] font-extrabold text-[#7024A8] uppercase tracking-widest mb-1">Issued Diploma</p>
                                        <div className="flex items-center gap-2">
                                            <i className="fa-solid fa-award text-2xl text-purple-600"></i>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">Serial No: {student.result.certificate}</p>
                                                <p className="text-[10px] text-slate-500 font-semibold">Grade: {student.result_grade || 'Graduated'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </FrontendLayout>
    );
}
