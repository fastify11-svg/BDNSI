import React from 'react';

export default function LicenseView({ data }) {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col justify-between">
            <div>
                {/* Header */}
                <header className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-3 px-4 shadow-sm">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <img src="/driving.png" alt="Driving Logo" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-white shadow-md" onError={(e) => { e.target.style.display = 'none'; }} />
                        <img src="/govt.png" alt="Govt Logo" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-white shadow-md" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                    <div className="text-center">
                        <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-900">
                            Driving License Verification - People's Republic of Bangladesh
                        </h1>
                    </div>

                    <div className="flex flex-col items-center space-y-3">
                        <div className="bg-white rounded-2xl border-2 border-emerald-600 w-28 h-28 sm:w-36 sm:h-36 p-1 flex items-center justify-center shadow-md overflow-hidden">
                            <img
                                src={data?.image || '/images/no-image.png'}
                                alt="License Photo"
                                className="object-cover w-full h-full rounded-xl"
                                onError={(e) => { e.target.src = '/images/student/logo.png'; }}
                            />
                        </div>
                        <div className="text-center">
                            <h2 className="text-base font-semibold text-emerald-800 mb-1">Verification Panel</h2>
                            <div className="inline-flex items-center space-x-2 bg-white border-2 border-emerald-600 rounded-xl px-4 py-1.5 shadow-sm">
                                <span className="text-base sm:text-lg font-bold text-emerald-950 tracking-wide">
                                    {data?.license_number || 'N/A'}
                                </span>
                                <span className="inline-block bg-emerald-600 text-white rounded-full p-1 text-xs">
                                    <i className="fa-solid fa-check"></i>
                                </span>
                            </div>
                        </div>
                    </div>

                    {data ? (
                        <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 text-center border-b border-gray-200 pb-2">
                                    User Information
                                </h3>
                                <div className="space-y-2">
                                    <div className="bg-white border border-emerald-700/30 rounded-xl px-4 py-2 text-sm flex justify-between">
                                        <span className="font-semibold text-gray-600">Full Name:</span>
                                        <span className="font-bold text-gray-900">{data.name?.toUpperCase()}</span>
                                    </div>
                                    <div className="bg-white border border-emerald-700/30 rounded-xl px-4 py-2 text-sm flex justify-between">
                                        <span className="font-semibold text-gray-600">Father's Name:</span>
                                        <span className="font-bold text-gray-900">{data.father_name?.toUpperCase()}</span>
                                    </div>
                                    <div className="bg-white border border-emerald-700/30 rounded-xl px-4 py-2 text-sm flex justify-between">
                                        <span className="font-semibold text-gray-600">CNIC / NID:</span>
                                        <span className="font-bold text-gray-900">{data.cnic?.toUpperCase()}</span>
                                    </div>
                                    <div className="bg-white border border-emerald-700/30 rounded-xl px-4 py-2 text-sm flex justify-between">
                                        <span className="font-semibold text-gray-600">City:</span>
                                        <span className="font-bold text-gray-900">{data.city?.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 text-center border-b border-gray-200 pb-2">
                                    License Details
                                </h3>
                                <div className="space-y-2">
                                    <div className="bg-white border border-emerald-700/30 rounded-xl px-4 py-2 text-sm flex justify-between">
                                        <span className="font-semibold text-gray-600">License Number:</span>
                                        <span className="font-mono font-bold text-emerald-800">{data.license_number?.toUpperCase()}</span>
                                    </div>
                                    <div className="bg-white border border-emerald-700/30 rounded-xl px-4 py-2 text-sm flex justify-between">
                                        <span className="font-semibold text-gray-600">Issue Date:</span>
                                        <span className="font-semibold text-gray-900">{data.issue_date || 'N/A'}</span>
                                    </div>
                                    <div className="bg-white border border-emerald-700/30 rounded-xl px-4 py-2 text-sm flex justify-between">
                                        <span className="font-semibold text-gray-600">Valid To:</span>
                                        <span className="font-semibold text-gray-900">{data.valid_to || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-xl mx-auto bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-2">
                            <i className="fa-solid fa-triangle-exclamation text-3xl text-rose-600"></i>
                            <h3 className="text-lg font-bold text-rose-800">License Record Not Found</h3>
                            <p className="text-xs text-rose-600">The requested driving license record could not be verified in the national database.</p>
                        </div>
                    )}
                </main>
            </div>

            <footer className="bg-slate-900 text-white py-6 px-4 text-center text-xs space-y-2 mt-12">
                <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
                    Driving License Issuance & Management System (DLIMS) - Bangladesh. Government of the People's Republic of Bangladesh.
                </p>
                <div className="text-slate-500 pt-2 border-t border-slate-800">
                    &copy; {new Date().getFullYear()} DLIMS. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
}
