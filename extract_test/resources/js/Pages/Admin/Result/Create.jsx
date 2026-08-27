import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';
import { getGradeLimit, getCourseTypeName } from '../../../utils/gradeHelper';

export default function Create({ students = [] }) {
    const { app_url } = usePage().props;
    const studentList = students?.data || students || [];
    
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const [roll, setRoll] = useState(searchParams.get('roll') || '');
    const [isPublishing, setIsPublishing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (roll) {
            Inertia.get(getUrl('/admin/result/create'), { roll }, { preserveState: true });
        }
    };

    // State for result inputs. Default to first student if exists.
    const student = studentList.length > 0 ? studentList[0] : null;
    const [marks, setMarks] = useState({
        written: student?.result?.written || 0,
        practical: student?.result?.practical || 0,
        viva: student?.result?.viva || 0,
    });
    const [targetGpa, setTargetGpa] = useState('');

    const [publishSemesters, setPublishSemesters] = useState(student?.semester_results?.length > 0);

    React.useEffect(() => {
        if (student) {
            setPublishSemesters(student.semester_results?.length > 0);
        }
    }, [student]);

    // Update marks when student changes
    React.useEffect(() => {
        if (student) {
            setMarks({
                written: student.result?.written || 0,
                practical: student.result?.practical || 0,
                viva: student.result?.viva || 0,
            });
        }
    }, [student]);

    const handleMarksChange = (e) => {
        setMarks({
            ...marks,
            [e.target.name]: e.target.value
        });
    };

    const handleAutoFill = () => {
        if (!student || !targetGpa) return;
        let gpa = parseFloat(targetGpa);
        if (gpa > 4.0) gpa = 4.0;
        if (gpa < 0) gpa = 0;
        
        const limit = getGradeLimit(student.course_type);
        // Formula: GPA = Percentage / 20 => Percentage = GPA * 20
        // Total Marks = (Percentage / 100) * limit = (GPA * 20 / 100) * limit = GPA * 0.2 * limit
        let targetTotal = Math.round(gpa * 0.2 * limit);
        
        // Distribution: Written (70%), Practical (20%), Viva (10%)
        let w = Math.round(targetTotal * 0.7);
        let p = Math.round(targetTotal * 0.2);
        let v = targetTotal - w - p;
        
        setMarks({ written: w.toString(), practical: p.toString(), viva: v.toString() });
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        
        if (!student) return;

        setIsPublishing(true);
        try {
            const res = await axios.post(getUrl('/admin/result'), {
                id: student.id,
                written: marks.written,
                practical: marks.practical,
                viva: marks.viva,
                publish_semesters: publishSemesters
            });
            
            if (res.data?.success || res.data?.type === 'success') {
                setSuccessMessage(res.data.message || 'Result published successfully');
                // Optional: redirect to index
                setTimeout(() => {
                    Inertia.visit(getUrl('/admin/result'));
                }, 1500);
            } else {
                setErrorMessage('Something went wrong');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to publish result');
        } finally {
            setIsPublishing(false);
        }
    };

    const totalMarks = parseInt(marks.written || 0) + parseInt(marks.practical || 0) + parseInt(marks.viva || 0);
    const markLimit = student ? getGradeLimit(student.course_type) : 100;
    const isOverLimit = totalMarks > markLimit;

    return (
        <AdminLayout title="Create Result">
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Create Result</h2>
                        <p className="text-xs text-slate-500">Search for a student and publish their exam results.</p>
                    </div>
                    <div>
                        <Link
                            href={getUrl('/admin/result')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm px-5 py-2.5 rounded-lg border border-slate-300 transition-all flex items-center gap-2"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            <span>Results List</span>
                        </Link>
                    </div>
                </div>

                {successMessage && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3">
                        <i className="fa-solid fa-circle-check"></i>
                        <span className="font-semibold text-sm">{successMessage}</span>
                    </div>
                )}
                {errorMessage && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-3">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <span className="font-semibold text-sm">{errorMessage}</span>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number <span className="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                required 
                                value={roll}
                                onChange={e => setRoll(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-slate-500"
                                placeholder="Enter student roll number"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="bg-slate-800 text-white font-bold px-6 py-2 rounded-xl hover:bg-slate-900 transition shadow-sm text-sm h-[38px] whitespace-nowrap"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {student && (
                    <form onSubmit={handlePublish}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <i className="fa-solid fa-graduation-cap text-indigo-600"></i> Enter Marks
                                </h3>
                                
                                <div className="flex items-center gap-2">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="relative flex items-center bg-white rounded-lg px-2 py-1 border border-purple-200 shadow-sm">
                                            <i className="fa-solid fa-wand-magic-sparkles text-purple-600 text-sm mr-2"></i>
                                            <input 
                                                type="number" 
                                                placeholder="Target GPA (e.g. 3.73)"
                                                value={targetGpa}
                                                onChange={(e) => setTargetGpa(e.target.value)}
                                                step="0.01"
                                                min="0"
                                                max="4.00"
                                                className="w-40 px-2 py-1 text-sm border-none focus:outline-none focus:ring-0"
                                            />
                                            <button 
                                                type="button"
                                                onClick={handleAutoFill}
                                                className="bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white transition px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap"
                                            >
                                                Auto Fill
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200 font-bold">
                                        <tr>
                                            <th className="px-4 py-3 border-r border-slate-100">Student</th>
                                            <th className="px-4 py-3 border-r border-slate-100 text-center">Course Type</th>
                                            <th className="px-4 py-3 border-r border-slate-100">Roll</th>
                                            <th className="px-4 py-3 border-r border-slate-100">Registration</th>
                                            <th className="px-4 py-3 border-r border-slate-100 text-center">Written</th>
                                            <th className="px-4 py-3 border-r border-slate-100 text-center">Practical</th>
                                            <th className="px-4 py-3 border-r border-slate-100 text-center">Viva</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr className="hover:bg-slate-50 transition text-slate-700">
                                            <td className="px-4 py-4 border-r border-slate-100 font-medium">{student.name}</td>
                                            <td className="px-4 py-4 border-r border-slate-100 text-center">
                                                {getCourseTypeName(student.course_type)}
                                            </td>
                                            <td className="px-4 py-4 border-r border-slate-100">{student.roll}</td>
                                            <td className="px-4 py-4 border-r border-slate-100">{student.registration}</td>
                                            <td className="px-4 py-3 border-r border-slate-100 w-32">
                                                <input 
                                                    type="number" 
                                                    name="written"
                                                    value={marks.written}
                                                    onChange={handleMarksChange}
                                                    min="0"
                                                    className={`w-full px-2 py-1 border rounded focus:outline-none ${isOverLimit ? 'border-rose-500 bg-rose-50' : 'border-slate-300'}`}
                                                />
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-100 w-32">
                                                <input 
                                                    type="number" 
                                                    name="practical"
                                                    value={marks.practical}
                                                    onChange={handleMarksChange}
                                                    min="0"
                                                    className={`w-full px-2 py-1 border rounded focus:outline-none ${isOverLimit ? 'border-rose-500 bg-rose-50' : 'border-slate-300'}`}
                                                />
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-100 w-32">
                                                <input 
                                                    type="number" 
                                                    name="viva"
                                                    value={marks.viva}
                                                    onChange={handleMarksChange}
                                                    min="0"
                                                    className={`w-full px-2 py-1 border rounded focus:outline-none ${isOverLimit ? 'border-rose-500 bg-rose-50' : 'border-slate-300'}`}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Semesters Section */}
                            <div className="p-4 bg-slate-50 border-t border-slate-200">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="publish_semesters"
                                        checked={publishSemesters}
                                        onChange={(e) => setPublishSemesters(e.target.checked)}
                                        className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <label htmlFor="publish_semesters" className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer select-none">
                                        <i className="fa-solid fa-layer-group text-indigo-600"></i> 
                                        Publish Semester Results (Auto-Generate based on CGPA)
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 ml-8">
                                    If checked, the system will automatically generate a detailed 5-subject-per-semester marksheet matching the final GPA perfectly based on course duration.
                                </p>
                            </div>
<div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                                {isOverLimit && (
                                    <span className="text-rose-500 text-xs font-bold">Total marks cannot exceed {markLimit}!</span>
                                )}
                                <button 
                                    type="submit" 
                                    disabled={isPublishing || isOverLimit}
                                    className="ml-auto bg-indigo-600 text-white font-bold px-8 py-2 rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isPublishing && <i className="fa-solid fa-spinner fa-spin"></i>}
                                    <span>Publish</span>
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {student && (
                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-3xl mx-auto">
                        <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 flex items-center justify-between">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                <i className="fa-solid fa-chart-bar text-indigo-600"></i> 
                                Grading System ({getCourseTypeName(student.course_type)})
                            </h3>
                            <span className="text-xs font-black text-indigo-700 bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                Total Marks: {markLimit}
                            </span>
                        </div>
                        <div className="p-0 sm:p-4 overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-[10px] text-slate-500 uppercase bg-slate-50 sm:rounded-t-lg font-extrabold tracking-wider border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-center">Marks Range</th>
                                        <th className="px-4 py-3 text-center">Percentage</th>
                                        <th className="px-4 py-3 text-center">Letter Grade</th>
                                        <th className="px-4 py-3 text-center">Base GPA</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {[
                                        { pct: 80, grade: 'A+', point: '4.00' },
                                        { pct: 75, grade: 'A', point: '3.75' },
                                        { pct: 70, grade: 'A-', point: '3.50' },
                                        { pct: 65, grade: 'B+', point: '3.25' },
                                        { pct: 60, grade: 'B', point: '3.00' },
                                        { pct: 55, grade: 'B-', point: '2.75' },
                                        { pct: 50, grade: 'C+', point: '2.50' },
                                        { pct: 45, grade: 'C', point: '2.25' },
                                        { pct: 40, grade: 'D', point: '2.00' },
                                        { pct: 0,  grade: 'F', point: '0.00' }
                                    ].map((g, idx, arr) => {
                                        const nextPct = idx === 0 ? 100 : arr[idx - 1].pct - 1;
                                        const maxMarks = Math.round((nextPct / 100) * markLimit);
                                        const minMarks = Math.round((g.pct / 100) * markLimit);
                                        
                                        return (
                                            <tr key={idx} className="hover:bg-indigo-50/30 transition text-slate-700">
                                                <td className="px-4 py-2 text-center font-mono text-xs font-bold">
                                                    {idx === 0 ? `${minMarks} - ${markLimit}` : (idx === arr.length - 1 ? `0 - ${maxMarks}` : `${minMarks} - ${maxMarks}`)}
                                                </td>
                                                <td className="px-4 py-2 text-center font-mono text-xs text-slate-500">
                                                    {idx === 0 ? `80% - 100%` : (idx === arr.length - 1 ? `< 40%` : `${g.pct}% - ${nextPct}%`)}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs font-black shadow-sm ${g.grade === 'F' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                                                        {g.grade}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-center font-mono font-black text-indigo-700">
                                                    {g.point}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-[11px] text-slate-600 flex items-start gap-2 shadow-inner">
                                <i className="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                                <p>
                                    <strong className="text-slate-800">Note:</strong> The system automatically calculates continuous exact GPA (e.g. <strong>3.73</strong>, <strong>3.81</strong>) for any marks falling between these ranges based on the exact percentage calculation (Percentage / 20).
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
