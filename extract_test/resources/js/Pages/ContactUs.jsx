import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';
import { getUrl } from '../utils/urlHelper';

export default function ContactUs() {
    const { flash } = usePage().props;
    const [submitted, setSubmitted] = useState(false);
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const courseParam = params.get('course');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: courseParam ? `Admission Inquiry: ${courseParam}` : 'General Inquiry',
        message: courseParam ? `I am interested in enrolling in the "${courseParam}" course. Please contact me with further admission procedures and details.` : ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(getUrl('/contact-us'), {
            onSuccess: () => {
                reset();
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 6000);
            }
        });
    };

    return (
        <FrontendLayout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7024A8]">24/7 SUPPORT & HELP</span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">Contact Us</h1>
                        <p className="text-xs text-slate-500 max-w-xl mt-1.5 leading-relaxed">
                            Have a question about technical training courses, center affiliations, student certificate verification, or general support? Reach out to our team today.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border border-purple-100 shrink-0 w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-full bg-[#7024A8] text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
                            <i className="fa-solid fa-headset"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HELPLINE NUMBER</p>
                            <p className="text-xl font-black text-[#7024A8] font-mono">09649700002</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid: Form (7 cols) + Office Info (5 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Contact Form Section */}
                    <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                        <div className="bg-[#7024A8] text-white px-5 py-3 text-xs font-bold flex items-center gap-2">
                            <i className="fa-solid fa-paper-plane"></i>
                            <span className="uppercase tracking-wider font-black">SEND US A DIRECT MESSAGE</span>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {(submitted || flash?.success) && (
                                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-xs font-bold animate-fadeIn">
                                    <i className="fa-solid fa-circle-check text-lg text-emerald-600"></i>
                                    <span>Thank you! Your message has been sent successfully. We will get back to you shortly.</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Full Name <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Mohammad Ali"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition font-medium"
                                    />
                                    {errors.name && <p className="text-[11px] text-rose-500 font-semibold">{errors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="e.g. name@example.com"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition font-medium"
                                    />
                                    {errors.email && <p className="text-[11px] text-rose-500 font-semibold">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Phone Number <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="e.g. 01700000000"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition font-mono font-medium"
                                    />
                                    {errors.phone && <p className="text-[11px] text-rose-500 font-semibold">{errors.phone}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Inquiry Type</label>
                                    <select
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition font-semibold"
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Center Accreditation">Center Accreditation & Apply</option>
                                        <option value="Student Verification">Student Result & Verification</option>
                                        <option value="Course Information">Course & Exam Details</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Your Message <span className="text-rose-500">*</span></label>
                                <textarea
                                    required
                                    rows={5}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Write your query or message details here..."
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition resize-none font-medium"
                                ></textarea>
                                {errors.message && <p className="text-[11px] text-rose-500 font-semibold">{errors.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-[#7024A8] hover:bg-[#581C87] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow transition-all flex items-center justify-center gap-2 transform active:scale-98"
                            >
                                {processing ? (
                                    <span>Sending Message...</span>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-paper-plane"></i>
                                        <span>SUBMIT MESSAGE</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Office Info Cards */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                            <div className="bg-[#7024A8] text-white px-5 py-3 text-xs font-bold flex items-center gap-2">
                                <i className="fa-solid fa-building-columns"></i>
                                <span className="uppercase tracking-wider font-black">OFFICE ADDRESS & INFORMATION</span>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-[#7024A8] flex items-center justify-center shrink-0 text-base shadow-xs">
                                        <i className="fa-solid fa-location-dot"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900 text-xs">Headquarters Address</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                                            26/E/A-1st Colony, Mazar Road, Mirpur, Dhaka-1216, Bangladesh.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-base shadow-xs">
                                        <i className="fa-solid fa-phone"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900 text-xs">Phone & Call Support</h4>
                                        <p className="text-xs font-mono text-slate-800 font-semibold mt-0.5">09649700002</p>
                                        <p className="text-[11px] text-slate-500 font-mono">+880 1700-000000 (Cell)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-base shadow-xs">
                                        <i className="fa-solid fa-envelope"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900 text-xs">Email Correspondence</h4>
                                        <p className="text-xs font-semibold text-slate-700 mt-0.5">info@yttc.com.bd</p>
                                        <p className="text-[11px] text-slate-500">support@yttc.com.bd</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                                    <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-base shadow-xs">
                                        <i className="fa-solid fa-clock"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900 text-xs">Official Business Hours</h4>
                                        <p className="text-xs text-slate-700 font-semibold mt-0.5">Saturday - Thursday: 9:00 AM - 6:00 PM</p>
                                        <p className="text-[11px] text-rose-600 font-semibold">Friday: Closed (Weekly Holiday)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Google Maps Location Embed */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="bg-[#7024A8] text-white px-5 py-3 text-xs font-bold flex items-center gap-2">
                        <i className="fa-solid fa-map-location-dot"></i>
                        <span className="uppercase tracking-wider font-black">MAP LOCATION (HEADQUARTERS)</span>
                    </div>
                    <div className="h-80 w-full bg-slate-100 overflow-hidden relative">
                        <iframe
                            className="w-full h-full border-0 block"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.36263592182!2d90.35414847602497!3d23.787884187989937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0be36e7a2b9%3A0x868b1a37c1d7bb5e!2sMazar%20Rd%2C%20Dhaka!5e0!2m3!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
