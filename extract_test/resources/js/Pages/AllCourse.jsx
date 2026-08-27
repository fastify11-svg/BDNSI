import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';
import { getUrl } from '../utils/urlHelper';

export default function AllCourse({ courses }) {
    const { app_url } = usePage().props;
    const stripHtml = (html) => {
        if (!html) return '';
        let text = String(html).replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    };
    // Check if initial query exists in URL
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const [searchTerm, setSearchTerm] = useState(params.get('course_name') || '');

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get(getUrl('/all-course'), { course_name: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const handleClear = () => {
        setSearchTerm('');
        Inertia.get(getUrl('/all-course'), {}, { preserveState: true, preserveScroll: true });
    };

    const courseData = courses?.data || courses || [];

    return (
        <FrontendLayout>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#581C87] to-[#7024A8] text-white py-12 px-4 shadow-md rounded-b-3xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-sm">Explore Our Courses</h1>
                    <p className="text-purple-200 text-sm sm:text-base max-w-2xl mx-auto font-medium">
                        Discover comprehensive technical and vocational training programs tailored to build your career and enhance your professional skills.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl w-full mx-auto px-4 py-8 sm:py-12 space-y-10">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative z-20 -mt-16">
                    <div className="relative flex items-center shadow-xl rounded-full border-[3px] border-white bg-white overflow-hidden p-1.5 focus-within:ring-4 focus-within:ring-purple-500/20 transition-all">
                        <i className="fa-solid fa-magnifying-glass text-slate-400 pl-4 text-lg"></i>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search courses by title or keyword..."
                            className="w-full py-3 px-4 text-sm sm:text-base font-medium text-slate-700 focus:outline-none bg-transparent placeholder:text-slate-400"
                        />
                        {searchTerm && (
                            <button type="button" onClick={handleClear} className="px-3 text-slate-400 hover:text-rose-500 transition-colors">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-[#7024A8] hover:bg-[#581C87] text-white font-black px-6 sm:px-8 py-3 rounded-full text-sm uppercase tracking-wider transition-colors shadow-md shrink-0 flex items-center gap-2"
                        >
                            <span>Search</span>
                        </button>
                    </div>
                </form>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                    {courseData.length > 0 ? (
                        courseData.map((course) => (
                            <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col group hover:-translate-y-1">
                                <div className="h-44 bg-slate-900 overflow-hidden relative shrink-0 border-b border-slate-100">
                                    <img
                                        src={course.image || course.photo ? getUrl(course.image || course.photo) : getUrl('/images/about.jpg')}
                                        alt={course.name}
                                        className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-90 transition-all duration-700"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = getUrl('/images/govt.png');
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="min-h-[96px]">
                                        <h3 className="font-extrabold text-slate-900 text-[15px] mb-2 line-clamp-2 leading-tight group-hover:text-[#7024A8] transition-colors">
                                            {course.name}
                                        </h3>
                                        <p className="text-[13px] text-slate-500 line-clamp-3 leading-relaxed font-medium">
                                            {stripHtml(course.course_details || course.description || 'Comprehensive technical training program taught by certified industry professionals.')}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-4 flex flex-wrap gap-1.5 mb-5 shrink-0 min-h-[28px]">
                                        {(course.duration || course.course_duration) && (
                                            <span className="bg-purple-50 text-[#7024A8] text-[10px] font-bold px-2 py-1 rounded border border-purple-100 flex items-center gap-1 truncate max-w-full">
                                                <i className="fa-regular fa-clock shrink-0"></i> 
                                                <span className="truncate">{course.duration || course.course_duration}</span>
                                            </span>
                                        )}
                                        {(course.education_qualification || course.qualification) && (
                                            <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded border border-amber-100 flex items-center gap-1 truncate max-w-full">
                                                <i className="fa-solid fa-graduation-cap shrink-0"></i> 
                                                <span className="truncate">{course.education_qualification || course.qualification}</span>
                                            </span>
                                        )}
                                        {(course.rate || course.course_fee) && (
                                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded border border-emerald-100 flex items-center gap-1 truncate max-w-full">
                                                <i className="fa-solid fa-tag shrink-0"></i> 
                                                <span className="truncate"><i className="fa-solid fa-bangladeshi-taka-sign text-emerald-700"></i> {course.rate || course.course_fee}</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            href={getUrl(`/course-details/${course.id}`)}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 text-slate-700 font-extrabold rounded-xl group-hover:bg-[#7024A8] group-hover:text-white transition-colors duration-300 text-xs uppercase tracking-wider border border-slate-200 group-hover:border-[#7024A8]"
                                        >
                                            <span>View Details</span>
                                            <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <i className="fa-solid fa-book-open-reader text-3xl text-slate-300"></i>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No Courses Found</h3>
                            <p className="text-slate-500 text-sm font-medium">We couldn't find any courses matching your search criteria.</p>
                            {searchTerm && (
                                <button 
                                    onClick={handleClear}
                                    className="mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2 rounded-full text-xs uppercase tracking-wider transition-colors"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Pagination (if applicable) */}
                {courses?.links && courses.data.length > 0 && (
                    <div className="flex justify-center pt-8 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1">
                            {courses.links.map((link, k) => (
                                <Link
                                    key={`page-${k}`}
                                    href={link.url ? getUrl(link.url) : '#'}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${
                                        link.active 
                                            ? 'bg-[#7024A8] text-white border-[#7024A8]' 
                                            : !link.url 
                                                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                                                : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50 hover:text-[#7024A8] hover:border-purple-200'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </FrontendLayout>
    );
}
