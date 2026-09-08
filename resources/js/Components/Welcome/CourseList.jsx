import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import { getUrl } from '../../utils/urlHelper';

export default function CourseList({ courses }) {
    const courseList = courses && courses.length > 0 ? courses : [];
    
    if (courseList.length === 0) {
        return (
            <div data-testid="course-section" className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-[#7024A8] text-white px-4 py-2.5 text-xs font-bold flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                        <i className="fa-solid fa-graduation-cap text-white"></i>
                        <span className="uppercase tracking-wider font-extrabold text-white">OUR COURSES</span>
                    </div>
                </div>
                <div className="p-8 text-center" data-testid="course-empty-state">
                    <i className="fa-solid fa-graduation-cap text-4xl text-slate-300 mb-3"></i>
                    <h2 className="text-lg font-bold text-slate-400">No active courses available right now.</h2>
                    <p className="text-sm text-slate-500 mt-2">Please check back later.</p>
                </div>
            </div>
        );
    }

    const groupInPairs = (arr) => {
        const pairs = [];
        for (let i = 0; i < arr.length; i += 2) {
            pairs.push(arr.slice(i, i + 2));
        }
        return pairs;
    };
    
    const coursePairs = groupInPairs(courseList);

    return (
        <div data-testid="course-section" className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-[#7024A8] text-white px-4 py-2.5 text-xs font-bold flex justify-between items-center">
                <div className="flex items-center gap-2 text-white">
                    <i className="fa-solid fa-graduation-cap text-white"></i>
                    <span className="uppercase tracking-wider font-extrabold text-white">OUR COURSES</span>
                </div>
                <Link href={getUrl('/all-course')} className="bg-[#581C87] text-white hover:bg-purple-900 px-3 py-1 rounded text-[10px] uppercase font-black tracking-wider shadow-sm transition">
                    VIEW ALL
                </Link>
            </div>

            {/* Desktop View: Grid */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {courseList.map((course) => (
                    <Link key={`course-desk-${course.id}`} href={getUrl(`/course-details/${course.id}`)} className="border border-slate-200 rounded-md overflow-hidden bg-white hover:shadow-lg hover:border-purple-200 transition group flex items-start gap-4 p-3 relative h-32">
                        {/* Status Ribbon */}
                        <div className="absolute -right-6 top-3 bg-rose-600 text-white text-[8px] font-black uppercase tracking-widest px-8 py-0.5 rotate-45 shadow-sm">
                            POPULAR
                        </div>
                        <div className="w-24 h-24 bg-slate-100 shrink-0 border border-slate-100 rounded overflow-hidden">
                                <img
                                    src={(course.image || course.photo) ? getUrl(course.image || course.photo) : getUrl('/images/driving.png')}
                                    alt={course.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = getUrl('/images/driving.png');
                                    }}
                                />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                            <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#7024A8] transition line-clamp-2" title={course.name}>
                                {course.name}
                            </h3>
                            <div className="mt-2 space-y-1.5">
                                <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5"><i className="fa-regular fa-clock text-slate-400"></i> {course.duration || course.course_duration || 'N/A'}</p>
                                <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5"><i className="fa-solid fa-bangladeshi-taka-sign text-slate-400"></i> {(course.rate || course.course_fee) ? (course.rate || course.course_fee) : 'Negotiable'}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile View: 2-Row Horizontal Continuous Slider */}
            <div className="sm:hidden p-4 overflow-hidden relative border-t border-slate-100">
                <div className="animate-course-marquee">
                    <div className="flex gap-4 pr-4 shrink-0">
                        {coursePairs.map((pair, idx) => (
                            <div key={`course-pair-a-${idx}`} className="flex flex-col gap-4 w-72 shrink-0">
                                {pair.map((course) => (
                                    <Link key={`course-mob-a-${course.id}`} href={getUrl(`/course-details/${course.id}`)} className="border border-slate-200 rounded-md overflow-hidden bg-white hover:border-purple-200 transition group flex items-start gap-3 p-2 relative h-[88px]">
                                        <div className="w-16 h-16 bg-slate-100 shrink-0 border border-slate-100 rounded overflow-hidden">
                                            <img
                                                src={(course.image || course.photo) ? getUrl(course.image || course.photo) : getUrl('/images/driving.png')}
                                                alt={course.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = getUrl('/images/driving.png');
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 text-[11px] leading-tight group-hover:text-[#7024A8] transition line-clamp-2" title={course.name}>
                                                {course.name}
                                            </h3>
                                            <div className="mt-1.5 space-y-1">
                                                <p className="text-[9px] text-slate-500 font-medium flex items-center gap-1"><i className="fa-regular fa-clock text-slate-400"></i> {course.duration || course.course_duration || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* Duplicate for seamless looping */}
                    <div className="flex gap-4 pr-4 shrink-0" aria-hidden="true">
                        {coursePairs.map((pair, idx) => (
                            <div key={`course-pair-b-${idx}`} className="flex flex-col gap-4 w-72 shrink-0">
                                {pair.map((course) => (
                                    <Link key={`course-mob-b-${course.id}`} href={getUrl(`/course-details/${course.id}`)} className="border border-slate-200 rounded-md overflow-hidden bg-white hover:border-purple-200 transition group flex items-start gap-3 p-2 relative h-[88px]">
                                        <div className="w-16 h-16 bg-slate-100 shrink-0 border border-slate-100 rounded overflow-hidden">
                                            <img
                                                src={(course.image || course.photo) ? getUrl(course.image || course.photo) : getUrl('/images/driving.png')}
                                                alt={course.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = getUrl('/images/driving.png');
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 text-[11px] leading-tight group-hover:text-[#7024A8] transition line-clamp-2" title={course.name}>
                                                {course.name}
                                            </h3>
                                            <div className="mt-1.5 space-y-1">
                                                <p className="text-[9px] text-slate-500 font-medium flex items-center gap-1"><i className="fa-regular fa-clock text-slate-400"></i> {course.duration || course.course_duration || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
