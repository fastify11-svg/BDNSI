import React from 'react';
import { usePage, Link } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';
import { calculateGrade, calculateGPA, getCourseTypeName } from '../../../utils/gradeHelper';

export default function Show({ student }) {
    const { app_url } = usePage().props;

    if (!student) return null;

    const result = student.result;
    const isPublished = student.result_publised !== null && result;
    const totalMark = result ? parseInt(result.written || 0) + parseInt(result.practical || 0) + parseInt(result.viva || 0) : 0;

    // We will use the helper to get the proper human readable name
    const courseTypeDescription = getCourseTypeName(student.course_type);

    return (
        <AdminLayout title="Result Details">
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Result Details</h2>
                        <p className="text-xs text-slate-500">Viewing full details for {student.name}</p>
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

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
                    <div className="w-full flex flex-col items-center gap-6">
                        <div className="text-center space-y-2">
                            <h1 className="font-extrabold text-3xl sm:text-4xl text-[#7024A8] tracking-tight">BDNSI</h1>
                            <p className="text-sm sm:text-base font-bold text-orange-500 bg-orange-50 px-4 py-1 rounded-full border border-orange-200 inline-block">
                                Govt. License No: J-12345
                            </p>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#7024A8] rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
                            <img 
                                className="relative h-48 w-48 sm:h-56 sm:w-56 object-cover object-center border-4 border-[#7024A8] rounded-3xl shadow-xl z-10 bg-white p-1" 
                                src={student.picture || '/default-avatar.png'} 
                                alt={student.name} 
                            />
                        </div>

                        <div className="w-full border-2 border-[#7024A8] rounded-xl overflow-hidden mt-4 shadow-sm text-sm">
                            {/* Row 1 */}
                            <div className="w-full flex flex-wrap bg-[#7024A8] text-white">
                                <div className="w-1/3 md:w-1/6 border-r border-b border-[#5e1e8c] font-bold flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Name</div>
                                <div className="w-2/3 md:w-2/6 border-b md:border-r border-[#5e1e8c] font-semibold flex items-center py-3 px-4">{student.name}</div>
                                <div className="w-1/3 md:w-1/6 border-r border-b border-[#5e1e8c] font-bold flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Roll</div>
                                <div className="w-2/3 md:w-2/6 border-b border-[#5e1e8c] font-semibold flex items-center py-3 px-4">{student.roll}</div>
                            </div>
                            
                            {/* Row 2 */}
                            <div className="w-full flex flex-wrap bg-white">
                                <div className="w-1/3 md:w-1/6 border-r border-b border-slate-200 font-bold text-slate-500 flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Father's Name</div>
                                <div className="w-2/3 md:w-2/6 border-b md:border-r border-slate-200 font-semibold text-slate-800 flex items-center py-3 px-4">{student.fathers_name}</div>
                                <div className="w-1/3 md:w-1/6 border-r border-b border-slate-200 font-bold text-slate-500 flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Registration</div>
                                <div className="w-2/3 md:w-2/6 border-b border-slate-200 font-semibold text-slate-800 flex items-center py-3 px-4">{student.registration}</div>
                            </div>
                            
                            {/* Row 3 */}
                            <div className="w-full flex flex-wrap bg-slate-50">
                                <div className="w-1/3 md:w-1/6 border-r border-b border-slate-200 font-bold text-slate-500 flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Mother's Name</div>
                                <div className="w-2/3 md:w-2/6 border-b md:border-r border-slate-200 font-semibold text-slate-800 flex items-center py-3 px-4">{student.mothers_name}</div>
                                <div className="w-1/3 md:w-1/6 border-r border-b border-slate-200 font-bold text-slate-500 flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Session</div>
                                <div className="w-2/3 md:w-2/6 border-b border-slate-200 font-semibold text-slate-800 flex items-center py-3 px-4">{student.session?.name}</div>
                            </div>
                            
                            {/* Row 4 */}
                            <div className="w-full flex flex-wrap bg-white">
                                <div className="w-1/3 md:w-1/6 border-r border-b border-slate-200 font-bold text-slate-500 flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Course Name</div>
                                <div className="w-2/3 md:w-2/6 border-b md:border-r border-slate-200 font-semibold text-slate-800 flex items-center py-3 px-4">{student.subject?.name}</div>
                                <div className="w-1/3 md:w-1/6 border-r border-b border-slate-200 font-bold text-slate-500 flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Duration</div>
                                <div className="w-2/3 md:w-2/6 border-b border-slate-200 font-semibold text-slate-800 flex items-center py-3 px-4">{student.course_duration}</div>
                            </div>
                            
                            {/* Row 5 */}
                            <div className="w-full flex flex-wrap bg-slate-50">
                                <div className="w-1/3 md:w-1/6 border-r border-b border-slate-200 font-bold text-slate-500 flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Institute Name</div>
                                <div className="w-2/3 md:w-2/6 border-b md:border-r border-slate-200 font-semibold text-slate-800 flex items-center py-3 px-4">{student.center?.name}</div>
                                <div className="w-1/3 md:w-1/6 border-r border-b border-slate-200 font-bold text-slate-500 flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Institute Code</div>
                                <div className="w-2/3 md:w-2/6 border-b border-slate-200 font-semibold text-slate-800 flex items-center py-3 px-4">{student.center?.code}</div>
                            </div>
                            
                            {/* Row 6 */}
                            <div className="w-full flex flex-wrap bg-white">
                                <div className="w-1/3 md:w-1/6 border-r border-slate-200 font-bold text-slate-500 flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Date of Birth</div>
                                <div className="w-2/3 md:w-2/6 md:border-r border-slate-200 font-semibold text-slate-800 flex items-center py-3 px-4">{student.date_of_birth}</div>
                                <div className="w-1/3 md:w-1/6 border-r border-slate-200 font-bold text-slate-500 flex items-center py-3 px-4 uppercase text-[10px] tracking-wider">Course Type</div>
                                <div className="w-2/3 md:w-2/6 font-semibold text-slate-800 flex items-center py-3 px-4">{courseTypeDescription}</div>
                            </div>
                        </div>

                        {isPublished ? (
                            <div className="w-full border-2 border-[#7024A8] rounded-xl overflow-hidden mt-2 shadow-sm">
                                <div className="bg-[#7024A8] text-white py-3 text-center uppercase tracking-widest text-xs font-black border-b border-[#5e1e8c]">
                                    Academic Marks & Grade
                                </div>
                                <div className="w-full overflow-x-auto bg-white">
                                    <table className="min-w-full text-center">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-4 py-3 border-r border-slate-200">Written</th>
                                                <th className="px-4 py-3 border-r border-slate-200">Practical</th>
                                                <th className="px-4 py-3 border-r border-slate-200">Viva</th>
                                                <th className="px-4 py-3 border-r border-slate-200">Total Marks</th>
                                                <th className="px-4 py-3 border-r border-slate-200">Letter Grade</th>
                                                <th className="px-4 py-3">GPA</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-800 font-bold text-base">
                                            <tr>
                                                <td className="px-4 py-4 border-r border-slate-200 text-indigo-600">{result.written || 0}</td>
                                                <td className="px-4 py-4 border-r border-slate-200 text-teal-600">{result.practical || 0}</td>
                                                <td className="px-4 py-4 border-r border-slate-200 text-cyan-600">{result.viva || 0}</td>
                                                <td className="px-4 py-4 border-r border-slate-200 text-slate-900">{totalMark}</td>
                                                <td className="px-4 py-4 border-r border-slate-200 text-emerald-600 font-black">{calculateGrade(totalMark, student.course_type)}</td>
                                                <td className="px-4 py-4 text-[#7024A8] font-black">{calculateGPA(totalMark, student.course_type)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full p-6 border-2 border-dashed border-rose-200 bg-rose-50 text-rose-600 rounded-xl flex flex-col items-center justify-center gap-2 mt-2">
                                <i className="fa-solid fa-file-circle-xmark text-3xl"></i>
                                <span className="font-bold">Result Not Published</span>
                                <p className="text-xs text-rose-500 font-medium text-center">This student's result has not been recorded or published yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
