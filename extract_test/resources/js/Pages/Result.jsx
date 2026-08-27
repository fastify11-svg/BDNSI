import React, { useState, useEffect, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';
import html2pdf from 'html2pdf.js';
import { getUrl } from '../utils/urlHelper';
import { calculateGrade, calculateGPA, getGradeLimit } from '../utils/gradeHelper';

export default function Result({ student, error }) {
    const { app_url } = usePage().props;
    const [roll, setRoll] = useState('');
    const resultCardRef = useRef(null);
    const pdfPrintRef = useRef(null);

    const getAbsoluteUrl = (path) => {
        let relative = getUrl(path);
        if (relative.startsWith('http://') || relative.startsWith('https://')) {
            return relative;
        }
        if (typeof window !== 'undefined') {
            return window.location.origin + relative;
        }
        return relative;
    };

    const studentPhotoUrl = student?.picture || student?.photo ? getAbsoluteUrl(student.picture || student.photo) : getAbsoluteUrl('/images/avatar.png');
    const sealLogoUrl = getAbsoluteUrl('/govt.png');

    const [base64Seal, setBase64Seal] = useState(sealLogoUrl);
    const [base64Photo, setBase64Photo] = useState(studentPhotoUrl);

    useEffect(() => {
        const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        if (params.get('roll')) {
            setRoll(params.get('roll'));
        }
    }, []);

    const toBase64 = (url, setCallback) => {
        if (!url) return;
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("HTTP " + res.status);
                return res.blob();
            })
            .then(blob => {
                if (!blob.type.startsWith('image/')) throw new Error("Not an image");
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) setCallback(reader.result);
                };
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth || img.width;
                        canvas.height = img.naturalHeight || img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        const dataURL = canvas.toDataURL('image/jpeg', 1.0);
                        setCallback(dataURL);
                    } catch (e) {
                        setCallback(url);
                    }
                };
                img.onerror = () => setCallback(url);
                img.src = url;
            });
    };

    useEffect(() => {
        if (student) {
            setBase64Photo(studentPhotoUrl);
            setBase64Seal(sealLogoUrl);
            toBase64(studentPhotoUrl, setBase64Photo);
            toBase64(sealLogoUrl, setBase64Seal);
        }
    }, [student, studentPhotoUrl, sealLogoUrl]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!roll.trim()) return;
        Inertia.get(getUrl('/result'), { roll: roll.trim() }, { preserveState: true, preserveScroll: true });
    };

    const handleDownloadPDF = () => {
        const element = pdfPrintRef.current;
        if (!element) return;
        const opt = {
            margin:       0.2,
            filename:     'Student_Result_Transcript.pdf',
            image:        { type: 'jpeg', quality: 1.0 },
            html2canvas:  { scale: 2, useCORS: true, allowTaint: true, windowWidth: 1024, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const written = student?.result?.written ?? 0;
    const practical = student?.result?.practical ?? 0;
    const viva = student?.result?.viva ?? 0;
    const totalMarks = written + practical + viva;

    const courseType = student?.course_type || 0;
    const limit = student ? getGradeLimit(courseType) : 100;
    const writtenLimit = limit * 0.5;
    const practicalLimit = limit * 0.3;
    const vivaLimit = limit * 0.2;

    const getGradeInfo = (marks) => {
        const grade = calculateGrade(marks, courseType);
        const gpa = calculateGPA(marks, courseType);
        const status = parseFloat(gpa) > 0 ? 'PASSED' : 'FAILED';
        
        let color = 'bg-emerald-100 text-emerald-900 border-emerald-300';
        let bg = '#d1fae5';
        let text = '#064e3b';
        let border = '#6ee7b7';
        
        if (grade === 'F' || grade === 'Invalid') {
            color = 'bg-rose-100 text-rose-900 border-rose-300';
            bg = '#ffe4e6'; text = '#881337'; border = '#fda4af';
        } else if (parseFloat(gpa) < 3.00) {
            color = 'bg-amber-100 text-amber-900 border-amber-300';
            bg = '#fef3c7'; text = '#78350f'; border = '#fcd34d';
        } else if (parseFloat(gpa) < 3.50) {
            color = 'bg-purple-100 text-[#7024A8] border-purple-300';
            bg = '#f3e8ff'; text = '#7024A8'; border = '#d8b4fe';
        }
        
        return { grade, gpa, status, color, bg, text, border };
    };

    const resultMeta = getGradeInfo(totalMarks);

    return (
        <FrontendLayout>
            {/* Search Header Banner */}
            <div className="bg-gradient-to-r from-[#7024A8] to-[#581C87] text-white py-10 px-4 rounded-lg shadow-sm mb-6">
                <div className="max-w-4xl mx-auto text-center space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-sm">Student Result Verification</h1>
                    <p className="text-purple-200 text-xs sm:text-sm font-medium">Verify official academic records and print digital marksheet transcript</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-2 sm:px-6 space-y-8">
                {/* Search Input Card */}
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl border border-slate-200 max-w-xl mx-auto space-y-5 -mt-10 relative z-20">
                    <h2 className="text-sm font-extrabold text-slate-900 text-center uppercase tracking-wider flex items-center justify-center gap-2">
                        <i className="fa-solid fa-graduation-cap text-[#7024A8]"></i>
                        <span>Search Academic Result</span>
                    </h2>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm animate-pulse">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wide mb-1.5 ml-1">
                                Roll No / Registration No
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={roll}
                                    onChange={(e) => setRoll(e.target.value)}
                                    required
                                    placeholder="Enter Roll or Registration Number..."
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-slate-200 focus:ring-4 focus:ring-purple-500/20 focus:border-[#7024A8] text-sm font-bold text-slate-800 transition-all outline-none font-mono"
                                />
                                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[#7024A8] transition-colors"></i>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-[#7024A8] hover:bg-[#581C87] text-white font-extrabold rounded-lg shadow-md hover:shadow-lg transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 transform active:scale-[0.98]"
                        >
                            <i className="fa-solid fa-file-invoice"></i>
                            <span>Get Result</span>
                        </button>
                    </form>
                </div>

                {/* Digital Marksheet Output Card */}
                {student && (
                    <div className="space-y-4">
                        {/* SCREEN VERSION */}
                        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden relative mt-8 p-0">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#7024A8] to-[#581C87] text-white p-4 sm:p-6 md:p-8 text-center relative border-b-4 border-amber-400 z-10">
                                <div className="flex flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full p-1.5 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                                            <img
                                                src={sealLogoUrl}
                                                alt="Seal"
                                                className="w-full h-full object-contain shrink-0 rounded-full"
                                                onError={(e) => { e.target.src = getUrl('/images/avatar.png'); }}
                                            />
                                        </div>
                                        <div className="text-left space-y-0.5">
                                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-300">GOVT. APPROVED TECHNICAL BOARD</p>
                                            <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-none text-white drop-shadow-sm">
                                                Young Technical Training Centre
                                            </h2>
                                            <p className="text-[10px] sm:text-[11px] md:text-xs text-purple-200 font-bold uppercase tracking-wide">Bangladesh Technical Education Portal</p>
                                        </div>
                                    </div>

                                    <div className="text-right bg-white/10 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-3 rounded-lg border border-white/20 shadow-inner hidden sm:block">
                                        <p className="text-[9px] sm:text-[10px] font-black text-amber-300 uppercase tracking-widest">OFFICIAL TRANSCRIPT</p>
                                        <p className="text-xs sm:text-sm font-mono font-black text-white mt-0.5">Reg: {student.registration || student.reg_no || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 relative z-10 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                                    {/* Student Photo */}
                                    <div className="order-1 md:order-2 md:col-span-4 flex flex-col items-center justify-center space-y-4 bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 text-center shadow-inner w-full mb-4 md:mb-0">
                                        <div className="w-32 h-36 border-[3px] border-[#7024A8] rounded-lg overflow-hidden bg-white shadow-md shrink-0">
                                            <img
                                                src={studentPhotoUrl}
                                                alt={student.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = getUrl('/images/avatar.png'); }}
                                            />
                                        </div>

                                        <div className={`w-full py-2.5 md:py-3 px-4 rounded-xl border text-center shadow-sm ${resultMeta.color}`}>
                                            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-80 mb-0.5">FINAL RESULT STATUS</p>
                                            <h4 className="text-lg sm:text-xl md:text-2xl font-black tracking-widest drop-shadow-sm">{resultMeta.status}</h4>
                                            <div className="flex items-center justify-center gap-3 md:gap-4 mt-2 text-[10px] md:text-xs font-extrabold border-t border-current/20 pt-2">
                                                <span className="flex flex-row gap-1"><span className="opacity-70">Grade:</span> <span className="font-mono">{resultMeta.grade}</span></span>
                                                <span className="h-4 w-px bg-current/20"></span>
                                                <span className="flex flex-row gap-1"><span className="opacity-70">GPA:</span> <span className="font-mono">{resultMeta.gpa}</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Student Personal Info */}
                                    <div className="order-2 md:order-1 md:col-span-8 space-y-4">
                                        <h3 className="text-[11px] sm:text-xs font-black text-[#7024A8] uppercase tracking-wider border-b-2 border-slate-200 pb-1.5 flex items-center gap-2">
                                            <i className="fa-solid fa-user-graduate"></i>
                                            <span>STUDENT PERSONAL & ACADEMIC INFORMATION</span>
                                        </h3>

                                        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 text-xs">
                                            <div className="border-b border-dashed border-slate-200 pb-2 flex flex-col gap-1">
                                                <span className="uppercase tracking-wider text-[9px] text-slate-500 font-bold">STUDENT NAME</span>
                                                <p className="font-extrabold text-slate-900 text-[11px] sm:text-[13px] break-words leading-tight">{student.name || 'N/A'}</p>
                                            </div>
                                            <div className="border-b border-dashed border-slate-200 pb-2 flex flex-col gap-1">
                                                <span className="uppercase tracking-wider text-[9px] text-slate-500 font-bold">FATHER'S NAME</span>
                                                <p className="font-bold text-slate-800 text-[11px] sm:text-[13px] break-words leading-tight">{student.fathers_name || student.father_name || 'N/A'}</p>
                                            </div>
                                            <div className="border-b border-dashed border-slate-200 pb-2 flex flex-col gap-1">
                                                <span className="uppercase tracking-wider text-[9px] text-slate-500 font-bold">MOTHER'S NAME</span>
                                                <p className="font-bold text-slate-800 text-[11px] sm:text-[13px] break-words leading-tight">{student.mothers_name || student.mother_name || 'N/A'}</p>
                                            </div>
                                            <div className="border-b border-dashed border-slate-200 pb-2 flex flex-col gap-1">
                                                <span className="uppercase tracking-wider text-[9px] text-slate-500 font-bold">ROLL NUMBER</span>
                                                <p className="font-mono font-extrabold text-[#7024A8] text-[11px] sm:text-[13px] break-words leading-tight">{student.roll || student.roll_no || 'N/A'}</p>
                                            </div>
                                            <div className="border-b border-dashed border-slate-200 pb-2 flex flex-col gap-1">
                                                <span className="uppercase tracking-wider text-[9px] text-slate-500 font-bold">REGISTRATION NO</span>
                                                <p className="font-mono font-bold text-slate-800 text-[11px] sm:text-[13px] break-words leading-tight">{student.registration || student.reg_no || 'N/A'}</p>
                                            </div>
                                            <div className="border-b border-dashed border-slate-200 pb-2 flex flex-col gap-1">
                                                <span className="uppercase tracking-wider text-[9px] text-slate-500 font-bold">COURSE / SUBJECT</span>
                                                <p className="font-bold text-slate-900 text-[11px] sm:text-[13px] break-words leading-tight">{student.subject?.name || student.course_name || 'N/A'}</p>
                                            </div>
                                            <div className="border-b border-dashed border-slate-200 pb-2 flex flex-col gap-1">
                                                <span className="uppercase tracking-wider text-[9px] text-slate-500 font-bold">SESSION</span>
                                                <p className="font-bold text-slate-800 text-[11px] sm:text-[13px] break-words leading-tight">{student.session?.name || student.session || 'N/A'}</p>
                                            </div>
                                            <div className="border-b border-dashed border-slate-200 pb-2 flex flex-col gap-1">
                                                <span className="uppercase tracking-wider text-[9px] text-slate-500 font-bold">COURSE DURATION</span>
                                                <p className="font-bold text-slate-800 text-[11px] sm:text-[13px] break-words leading-tight">{student.course_duration || student.duration || 'One Year'}</p>
                                            </div>
                                            <div className="border-b border-dashed border-slate-200 pb-2 flex flex-col gap-1 col-span-2">
                                                <span className="uppercase tracking-wider text-[9px] text-slate-500 font-bold">TRAINING CENTER / INSTITUTE</span>
                                                <p className="font-bold text-slate-900 text-[11px] sm:text-[13px] break-words leading-tight">{student.center?.name || 'Bangladesh National Skill Institute'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Marks Breakdown Table */}
                                <div className="space-y-3 pt-2 md:pt-4">
                                    <h3 className="text-[11px] sm:text-xs font-black text-[#7024A8] uppercase tracking-wider border-b-2 border-slate-200 pb-1.5 flex items-center gap-2">
                                        <i className="fa-solid fa-list-check"></i>
                                        <span>SUBJECT MARKS BREAKDOWN</span>
                                    </h3>

                                    <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-slate-200">
                                        <table className="w-full text-left border-collapse text-xs min-w-[650px] whitespace-nowrap">
                                            <thead>
                                                <tr className="bg-slate-100 border-b-2 border-slate-300 text-slate-800 uppercase font-black text-[9px] sm:text-[10px] tracking-wider">
                                                    <th className="px-3 py-2.5 border-r border-slate-200">EXAMINATION COMPONENT</th>
                                                    <th className="px-3 py-2.5 text-center border-r border-slate-200">FULL MARKS</th>
                                                    <th className="px-3 py-2.5 text-center border-r border-slate-200">MARKS OBTAINED</th>
                                                    <th className="px-3 py-2.5 text-center border-r border-slate-200">GRADE POINT</th>
                                                    <th className="px-3 py-2.5 text-center">LETTER GRADE</th>
                                                </tr>
                                            </thead>
                                            <tbody className="font-bold text-slate-800">
                                                <tr className="border-b border-slate-200">
                                                    <td className="px-3 py-2.5 border-r border-slate-200">Written Examination</td>
                                                    <td className="px-3 py-2.5 text-center font-mono text-slate-500 border-r border-slate-200">{writtenLimit}</td>
                                                    <td className="px-3 py-2.5 text-center font-mono font-black text-slate-900 border-r border-slate-200">{written}</td>
                                                    <td className="px-3 py-2.5 text-center font-mono border-r border-slate-200" rowSpan="3">
                                                        <span className="font-mono font-black text-[#7024A8] text-xs sm:text-sm">{resultMeta.gpa}</span>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center" rowSpan="3">
                                                        <span className="bg-purple-100 text-[#7024A8] font-black px-2.5 py-1 rounded text-xs shadow-sm">
                                                            {resultMeta.grade}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-slate-200">
                                                    <td className="px-3 py-2.5 border-r border-slate-200">Practical Assessment</td>
                                                    <td className="px-3 py-2.5 text-center font-mono text-slate-500 border-r border-slate-200">{practicalLimit}</td>
                                                    <td className="px-3 py-2.5 text-center font-mono font-black text-slate-900 border-r border-slate-200">{practical}</td>
                                                </tr>
                                                <tr className="border-b-2 border-slate-300">
                                                    <td className="px-3 py-2.5 border-r border-slate-200">Viva-Voce / Oral Exam</td>
                                                    <td className="px-3 py-2.5 text-center font-mono text-slate-500 border-r border-slate-200">{vivaLimit}</td>
                                                    <td className="px-3 py-2.5 text-center font-mono font-black text-slate-900 border-r border-slate-200">{viva}</td>
                                                </tr>
                                                <tr className="bg-slate-50 font-black text-slate-900">
                                                    <td className="px-3 py-2.5 uppercase text-right border-r border-slate-200 text-xs">TOTAL MARKS OBTAINED</td>
                                                    <td className="px-3 py-2.5 text-center font-mono border-r border-slate-200">{limit}</td>
                                                    <td className="px-3 py-2.5 text-center font-mono text-sm text-[#7024A8] border-r border-slate-200">{totalMarks}</td>
                                                    <td className="px-3 py-2.5 text-center font-mono text-sm border-r border-slate-200">{resultMeta.gpa}</td>
                                                    <td className="px-3 py-2.5 text-center text-sm text-emerald-700">{resultMeta.status}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Official Signatures */}
                                <div className="pt-8 mt-6 border-t border-slate-200 flex flex-row justify-around gap-4 text-center text-xs">
                                    <div className="space-y-1 flex flex-col items-center">
                                        <div className="h-10 border-b-2 border-slate-800 w-44 flex items-end justify-center pb-1">
                                            <span className="font-serif italic text-slate-400 text-xs">Controller of Exam</span>
                                        </div>
                                        <p className="font-extrabold text-slate-800 uppercase tracking-widest text-[10px] pt-1">Controller of Examinations</p>
                                        <p className="text-[9px] text-slate-500 font-semibold">Bangladesh Technical Board</p>
                                    </div>
                                    <div className="space-y-1 flex flex-col items-center">
                                        <div className="h-10 border-b-2 border-slate-800 w-44 flex items-end justify-center pb-1">
                                            <span className="font-serif italic text-slate-400 text-xs">Authorized Seal</span>
                                        </div>
                                        <p className="font-extrabold text-slate-800 uppercase tracking-widest text-[10px] pt-1">Center Director Signature</p>
                                        <p className="text-[9px] text-slate-500 font-semibold">Official Seal & Verification</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                                <span className="text-xs text-slate-500 font-extrabold mr-2 uppercase tracking-widest hidden md:block">
                                    Share Result:
                                </span>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 hover:shadow-md transition-all shadow-sm">
                                    <i className="fa-brands fa-facebook-f text-sm"></i>
                                </a>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('I just got my verified academic result from YTTC! Check it out here:')}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#000000] text-white flex items-center justify-center hover:scale-110 hover:shadow-md transition-all shadow-sm">
                                    <i className="fa-brands fa-x-twitter text-sm"></i>
                                </a>
                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 hover:shadow-md transition-all shadow-sm">
                                    <i className="fa-brands fa-linkedin-in text-sm"></i>
                                </a>
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out my verified result from YTTC: ' + window.location.href)}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 hover:shadow-md transition-all shadow-sm">
                                    <i className="fa-brands fa-whatsapp text-sm"></i>
                                </a>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <span className="text-[10px] sm:text-xs text-slate-500 font-bold flex items-center gap-2">
                                    <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                                    <span className="hidden sm:inline">Official Digital Certificate &bull;</span> Verified Online
                                </span>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="px-6 py-2.5 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-lg text-xs transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95 w-full sm:w-auto justify-center"
                                >
                                    <i className="fa-solid fa-download"></i>
                                    <span>Download Result Sheet</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* HIDDEN PERFECT DESKTOP VERSION FOR PDF GENERATION ONLY */}
            {student && (
                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '750px', zIndex: -10 }}>
                    <div ref={pdfPrintRef} style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', width: '750px', color: '#1e293b', padding: '0px', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
                        
                        {/* Certificate Header */}
                        <div style={{ padding: '20px 24px', position: 'relative', backgroundImage: 'linear-gradient(to right, #7024A8, #581C87)', borderBottom: '4px solid #fbbf24', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box', minHeight: '90px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '64px', height: '64px', minWidth: '64px', minHeight: '64px', backgroundColor: '#ffffff', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
                                    <img src={base64Seal} alt="Seal" style={{ width: '56px', height: '56px', maxWidth: '56px', maxHeight: '56px', objectFit: 'contain', display: 'block', borderRadius: '50%' }} crossOrigin="anonymous" />
                                </div>
                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <p style={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fde047', margin: '0 0 2px 0', padding: 0, lineHeight: '1.2' }}>GOVT. APPROVED TECHNICAL BOARD</p>
                                    <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: '0 0 3px 0', padding: 0, lineHeight: '1.15', letterSpacing: '-0.02em' }}>
                                        Young Technical Training Centre
                                    </h2>
                                    <p style={{ fontSize: '10px', color: '#e9d5ff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, padding: 0, lineHeight: '1.2' }}>Bangladesh Technical Education Portal</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <p style={{ fontSize: '9px', fontWeight: '900', color: '#fde047', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px 0', padding: 0, lineHeight: '1' }}>OFFICIAL TRANSCRIPT</p>
                                <p style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", fontWeight: '800', color: '#ffffff', margin: 0, padding: 0, lineHeight: '1' }}>Reg: {student.registration || student.reg_no || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Body Container */}
                        <div style={{ padding: '28px 32px', backgroundColor: '#ffffff' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '28px', alignItems: 'start' }}>
                                
                                {/* Details Table (col-span-8) */}
                                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#7024A8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 4px 0', lineHeight: '1.2' }}>
                                        STUDENT PERSONAL & ACADEMIC INFORMATION
                                    </h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: '28px', rowGap: '16px', fontSize: '12px', marginTop: '8px' }}>
                                        <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', margin: 0 }}>
                                            <span style={{ display: 'block', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '9px', marginBottom: '4px', lineHeight: '1' }}>STUDENT NAME</span>
                                            <p style={{ fontWeight: '900', color: '#0f172a', fontSize: '12px', margin: 0, lineHeight: '1.3' }}>{student.name || 'N/A'}</p>
                                        </div>
                                        <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', margin: 0 }}>
                                            <span style={{ display: 'block', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '9px', marginBottom: '4px', lineHeight: '1' }}>FATHER'S NAME</span>
                                            <p style={{ fontWeight: '900', color: '#0f172a', fontSize: '12px', margin: 0, lineHeight: '1.3' }}>{student.fathers_name || student.father_name || 'N/A'}</p>
                                        </div>
                                        <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', margin: 0 }}>
                                            <span style={{ display: 'block', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '9px', marginBottom: '4px', lineHeight: '1' }}>MOTHER'S NAME</span>
                                            <p style={{ fontWeight: '900', color: '#0f172a', fontSize: '12px', margin: 0, lineHeight: '1.3' }}>{student.mothers_name || student.mother_name || 'N/A'}</p>
                                        </div>
                                        <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', margin: 0 }}>
                                            <span style={{ display: 'block', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '9px', marginBottom: '4px', lineHeight: '1' }}>ROLL NUMBER</span>
                                            <p style={{ fontWeight: '900', color: '#7024A8', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', margin: 0, lineHeight: '1.3' }}>{student.roll || student.roll_no || 'N/A'}</p>
                                        </div>
                                        <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', margin: 0 }}>
                                            <span style={{ display: 'block', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '9px', marginBottom: '4px', lineHeight: '1' }}>REGISTRATION NO</span>
                                            <p style={{ fontWeight: '900', color: '#0f172a', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', margin: 0, lineHeight: '1.3' }}>{student.registration || student.reg_no || 'N/A'}</p>
                                        </div>
                                        <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', margin: 0 }}>
                                            <span style={{ display: 'block', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '9px', marginBottom: '4px', lineHeight: '1' }}>COURSE / SUBJECT</span>
                                            <p style={{ fontWeight: '900', color: '#0f172a', fontSize: '12px', margin: 0, lineHeight: '1.3' }}>{student.subject?.name || student.course_name || 'N/A'}</p>
                                        </div>
                                        <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', margin: 0 }}>
                                            <span style={{ display: 'block', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '9px', marginBottom: '4px', lineHeight: '1' }}>SESSION</span>
                                            <p style={{ fontWeight: '900', color: '#0f172a', fontSize: '12px', margin: 0, lineHeight: '1.3' }}>{student.session?.name || student.session || 'N/A'}</p>
                                        </div>
                                        <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', margin: 0 }}>
                                            <span style={{ display: 'block', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '9px', marginBottom: '4px', lineHeight: '1' }}>COURSE DURATION</span>
                                            <p style={{ fontWeight: '900', color: '#0f172a', fontSize: '12px', margin: 0, lineHeight: '1.3' }}>{student.course_duration || student.duration || 'One Year'}</p>
                                        </div>
                                        <div style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', margin: 0, gridColumn: 'span 2' }}>
                                            <span style={{ display: 'block', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '9px', marginBottom: '4px', lineHeight: '1' }}>TRAINING CENTER / INSTITUTE</span>
                                            <p style={{ fontWeight: '900', color: '#0f172a', fontSize: '12px', margin: 0, lineHeight: '1.3' }}>{student.center?.name || 'Bangladesh National Skill Institute'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Photo & Badge (col-span-4) */}
                                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', backgroundColor: '#f8fafc', padding: '18px 16px', borderRadius: '16px', border: '1px solid #e2e8f0', width: '100%', marginTop: '4px', boxSizing: 'border-box' }}>
                                    <div style={{ width: '120px', height: '140px', flexShrink: 0, border: '3px solid #7024A8', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff', position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                        <img src={base64Photo} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} crossOrigin="anonymous" />
                                    </div>
                                    <div style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${resultMeta.border}`, textAlign: 'center', backgroundColor: resultMeta.bg, color: resultMeta.text, boxSizing: 'border-box' }}>
                                        <p style={{ fontSize: '8px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, margin: '0 0 4px 0', lineHeight: '1' }}>FINAL RESULT STATUS</p>
                                        <h4 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '0.1em', margin: '0 0 4px 0', lineHeight: '1.1' }}>{resultMeta.status}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '6px', fontSize: '11px', fontWeight: '800', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '6px' }}>
                                            <span><span style={{ opacity: 0.7 }}>Grade:</span> <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{resultMeta.grade}</span></span>
                                            <span style={{ height: '12px', width: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }}></span>
                                            <span><span style={{ opacity: 0.7 }}>GPA:</span> <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{resultMeta.gpa}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Marks Table */}
                            <div style={{ marginTop: '24px' }}>
                                <h3 style={{ fontSize: '11px', fontWeight: '900', color: '#7024A8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', margin: '0 0 12px 0', lineHeight: '1.2' }}>
                                    SUBJECT MARKS BREAKDOWN
                                </h3>

                                <div style={{ borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '11px' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#1e293b', textTransform: 'uppercase', fontWeight: '900', fontSize: '9px', letterSpacing: '0.05em' }}>
                                                <th style={{ padding: '10px 12px', borderRight: '1px solid #e2e8f0' }}>EXAMINATION COMPONENT</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #e2e8f0', width: '96px' }}>FULL MARKS</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #e2e8f0', width: '112px' }}>MARKS OBTAINED</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'center', borderRight: '1px solid #e2e8f0', width: '96px' }}>GRADE POINT</th>
                                                <th style={{ padding: '10px 12px', textAlign: 'center', width: '112px' }}>LETTER GRADE</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ fontWeight: '700', color: '#1e293b' }}>
                                                <tr>
                                                    <td style={{ padding: '10px 12px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>Written Examination</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#64748b', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>{writtenLimit}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: '900', color: '#0f172a', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>{written}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }} rowSpan="3">
                                                        <span style={{ fontWeight: '900', color: '#7024A8', fontSize: '15px' }}>{resultMeta.gpa}</span>
                                                    </td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }} rowSpan="3">
                                                        <span style={{ backgroundColor: '#f3e8ff', color: '#7024A8', fontWeight: '900', padding: '4px 10px', borderRadius: '4px', fontSize: '13px' }}>
                                                            {resultMeta.grade}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '10px 12px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>Practical Assessment</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#64748b', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>{practicalLimit}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: '900', color: '#0f172a', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>{practical}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '10px 12px', borderRight: '1px solid #e2e8f0', borderBottom: '2px solid #cbd5e1' }}>Viva-Voce / Oral Exam</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#64748b', borderRight: '1px solid #e2e8f0', borderBottom: '2px solid #cbd5e1' }}>{vivaLimit}</td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: '900', color: '#0f172a', borderRight: '1px solid #e2e8f0', borderBottom: '2px solid #cbd5e1' }}>{viva}</td>
                                                </tr>
                                                <tr style={{ backgroundColor: '#f8fafc', fontWeight: '900', color: '#0f172a' }}>
                                                    <td style={{ padding: '12px 12px', textTransform: 'uppercase', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontSize: '11px', letterSpacing: '0.05em' }}>TOTAL MARKS OBTAINED</td>
                                                    <td style={{ padding: '12px 12px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", borderRight: '1px solid #e2e8f0' }}>{limit}</td>
                                                    <td style={{ padding: '12px 12px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', color: '#7024A8', borderRight: '1px solid #e2e8f0' }}>{totalMarks}</td>
                                                <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', borderRight: '1px solid #e2e8f0' }}>{resultMeta.gpa}</td>
                                                <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '11px', color: '#047857' }}>{resultMeta.status}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div style={{ paddingTop: '36px', marginTop: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', gap: '16px', textAlign: 'center', fontSize: '10px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ height: '36px', borderBottom: '1.5px solid #1e293b', width: '176px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px' }}>
                                        <span style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#94a3b8', fontSize: '11px' }}>Controller of Exam</span>
                                    </div>
                                    <p style={{ fontWeight: '900', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', paddingTop: '6px', margin: 0 }}>Controller of Examinations</p>
                                    <p style={{ fontSize: '9px', color: '#64748b', fontWeight: '600', margin: 0 }}>Bangladesh Technical Board</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ height: '36px', borderBottom: '1.5px solid #1e293b', width: '176px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px' }}>
                                        <span style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#94a3b8', fontSize: '11px' }}>Authorized Seal</span>
                                    </div>
                                    <p style={{ fontWeight: '900', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px', paddingTop: '6px', margin: 0 }}>Center Director Signature</p>
                                    <p style={{ fontSize: '9px', color: '#64748b', fontWeight: '600', margin: 0 }}>Official Seal & Verification</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </FrontendLayout>
    );
}
