import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';
import { getUrl } from '../utils/urlHelper';
import { isEnabled } from '../utils/moduleHelper';
import HeroSlider from '../Components/Welcome/HeroSlider';
import NoticeBoard from '../Components/Welcome/NoticeBoard';
import CourseList from '../Components/Welcome/CourseList';
import VideoGallery from '../Components/Welcome/VideoGallery';



export default function Welcome({
    sliders = [],
    sponsors = [],
    photo_gallery = [],
    courses = [],
    teams = [],
    youtube_videos = [],
    notices = [],
    centers = [],
    success_students = [],
    notice = '',
    about_us = '',
    counts = {},
    site_config = {}
}) {
    const { app_url, site_config: pageConfig = {} } = usePage().props;
    const config = { ...pageConfig, ...site_config };

    const [aboutExpanded, setAboutExpanded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [clickedSponsors, setClickedSponsors] = useState({});



    const cleanNotice = notice ? notice.replace(/<[^>]*>?/gm, '').trim() : '';





    const verifiedInstitutes = centers.length > 0 ? centers : [];
    const successStudentList = success_students.length > 0 ? success_students : [];

    const galleryImages = photo_gallery && photo_gallery.length > 0
        ? photo_gallery.map(g => g.photo || g.image)
        : [];

    const sponsorList = sponsors.length > 0 ? sponsors.map(s => s.image || s.photo) : [];

    return (
        <FrontendLayout>
            {/* Continuous Marquee Animation Styles */}
            

            {/* 1. Scrolling Notice Ticker (Right to Left Continuous News Ticker) */}
            {isEnabled(config.toggle_notice_board) && (
                <div className="bg-white border border-rose-200 rounded-md overflow-hidden flex items-center shadow-sm relative z-20">
                    <span className="bg-[#BE123C] text-white font-black px-3 sm:px-4 py-2 text-[11px] sm:text-xs uppercase tracking-wider shrink-0 z-30 shadow-sm relative">
                        NOTICE
                    </span>
                    <div className="overflow-hidden flex-1 flex items-center px-3 py-2 relative z-0">
                        <div className="animate-notice-marquee">
                            <div className="flex gap-16 shrink-0 min-w-full pr-16 items-center">
                                <p className="text-[13px] font-semibold text-slate-800">
                                    {cleanNotice || 'No notice available at the moment.'}
                                </p>
                            </div>
                            <div className="flex gap-16 shrink-0 min-w-full pr-16 items-center" aria-hidden="true">
                                <p className="text-[13px] font-semibold text-slate-800">
                                    {cleanNotice || 'No notice available at the moment.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Hero Section (Grid: Left 8 cols Slider, Right 4 cols Leadership & E-Services) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
                {/* Left 8 Cols: Banner Carousel */}
                <HeroSlider sliders={sliders} />

                {/* Right 4 Cols: Leadership Card & Internal E-Services */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                    {/* LEADERSHIP Card */}
                    <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-[#7024A8] text-white font-extrabold px-4 py-2.5 text-xs text-center uppercase tracking-wider">
                            LEADERSHIP
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-4 text-center bg-white">
                            {teams.length === 0 ? (
                                <div className="col-span-2 text-xs text-slate-400 py-4">No leadership team registered.</div>
                            ) : (
                            teams.slice(0, 2).map((team, idx) => (
                                <div key={`team-${team.id || idx}`} className="space-y-1">
                                    <div className="w-20 h-24 bg-slate-100 border border-slate-200 rounded overflow-hidden mx-auto shadow-sm group">
                                        <img
                                            src={team.image ? getUrl(team.image) : getUrl('/images/1711405466.jpg')}
                                            alt={team.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getUrl('/images/avatar.png');
                                            }}
                                        />
                                    </div>
                                    <p className="font-extrabold text-slate-900 text-xs mt-1 truncate" title={team.name}>{team.name}</p>
                                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{team.designation}</p>
                                    <div className="flex items-center justify-center gap-2 mt-1.5">
                                        {team.facebook_link && <a href={team.facebook_link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition"><i className="fa-brands fa-facebook"></i></a>}
                                        {team.twitter_link && <a href={team.twitter_link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition"><i className="fa-brands fa-twitter"></i></a>}
                                        {team.linkedin_link && <a href={team.linkedin_link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-700 transition"><i className="fa-brands fa-linkedin"></i></a>}
                                        {team.phone && <a href={`tel:${team.phone}`} className="text-slate-400 hover:text-emerald-600 transition"><i className="fa-solid fa-phone"></i></a>}
                                        {team.email && <a href={`mailto:${team.email}`} className="text-slate-400 hover:text-rose-600 transition"><i className="fa-solid fa-envelope"></i></a>}
                                    </div>
                                </div>
                            )))}
                        </div>
                    </div>

                    {/* INTERNAL E-SERVICES Card */}
                    <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-[#7024A8] text-white font-extrabold px-4 py-2.5 text-xs text-center uppercase tracking-wider">
                            INTERNAL E-SERVICES
                        </div>
                        <div className="divide-y divide-slate-100 text-[13px] font-semibold">
                            {isEnabled(config.toggle_result_verify) && (
                                <Link href={getUrl('/result')} className="px-4 py-2.5 flex justify-between items-center text-slate-700 hover:bg-purple-50 hover:text-[#7024A8] transition">
                                    <span className="flex items-center gap-2"><i className="fa-solid fa-graduation-cap text-[#7024A8] w-4 text-center"></i>Student Result</span>
                                    <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
                                </Link>
                            )}
                            {isEnabled(config.toggle_center_apply) && (
                                <Link href={getUrl('/center-request/create')} className="px-4 py-2.5 flex justify-between items-center text-slate-700 hover:bg-purple-50 hover:text-[#7024A8] transition">
                                    <span className="flex items-center gap-2"><i className="fa-solid fa-building text-[#7024A8] w-4 text-center"></i>Center Apply</span>
                                    <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
                                </Link>
                            )}
                            <Link href={getUrl('/login')} className="px-4 py-2.5 flex justify-between items-center text-slate-700 hover:bg-purple-50 hover:text-[#7024A8] transition">
                                <span className="flex items-center gap-2"><i className="fa-solid fa-lock text-[#7024A8] w-4 text-center"></i>Center Login</span>
                                <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
                            </Link>
                            {isEnabled(config.toggle_notice_board) && (
                                <Link href={getUrl('/all-notice-list')} className="px-4 py-2.5 flex justify-between items-center text-slate-700 hover:bg-purple-50 hover:text-[#7024A8] transition">
                                    <span className="flex items-center gap-2"><i className="fa-solid fa-bell text-[#7024A8] w-4 text-center"></i>Notice Board</span>
                                    <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Middle Content Layout (2 Columns: Left 8 cols, Right 4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
                {/* Left 8 Cols Container */}
                <div className="lg:col-span-8 space-y-4 sm:space-y-6">
                    {/* NOTICE BOARD Card */}
                    <NoticeBoard notices={notices} />

                    {/* ABOUT US Card */}
                    <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-[#7024A8] text-white px-4 py-2.5 text-xs font-bold flex items-center gap-2">
                            <i className="fa-solid fa-building-columns text-white"></i>
                            <span className="uppercase tracking-wider font-extrabold text-white">ABOUT US</span>
                        </div>
                        <div className="p-4 flex flex-col sm:flex-row gap-5 items-start">
                            <img
                                src={getUrl('/images/about.jpg')}
                                alt="About BDNSI Institute"
                                className="w-full sm:w-48 h-36 object-cover rounded border border-slate-200 shrink-0 shadow-sm"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getUrl('/images/1711405466.jpg');
                                }}
                            />
                            <div className="space-y-3 text-[13px] text-slate-700 leading-relaxed font-medium w-full">
                                {aboutExpanded ? (
                                    <div 
                                        className="prose max-w-none text-[13px] text-slate-700 space-y-2 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: about_us || 'Information not available.' }} 
                                    />
                                ) : (
                                    <p className="line-clamp-4 sm:line-clamp-5">
                                        {about_us ? about_us.replace(/<[^>]*>?/gm, '') : 'Information not available.'}
                                    </p>
                                )}
                                {about_us && about_us.length > 200 && (
                                    <button
                                        onClick={() => setAboutExpanded(!aboutExpanded)}
                                        className="text-[#7024A8] font-bold hover:underline inline-block text-xs"
                                    >
                                        {aboutExpanded ? '« Read less' : 'Read more »'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* STATISTICS COUNTER GRID (4 Columns) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-white rounded-md p-4 sm:p-5 border border-slate-200 text-center shadow-sm">
                            <h3 className="text-2xl sm:text-3xl font-black text-[#7024A8]">{counts.total_centers ?? 216}+</h3>
                            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase mt-1 tracking-wider">CENTERS</p>
                        </div>
                        <div className="bg-white rounded-md p-4 sm:p-5 border border-slate-200 text-center shadow-sm">
                            <h3 className="text-2xl sm:text-3xl font-black text-[#7024A8]">{counts.total_courses ?? 532}+</h3>
                            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase mt-1 tracking-wider">COURSES</p>
                        </div>
                        <div className="bg-white rounded-md p-4 sm:p-5 border border-slate-200 text-center shadow-sm">
                            <h3 className="text-2xl sm:text-3xl font-black text-[#7024A8]">{counts.total_exams ?? 176}+</h3>
                            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase mt-1 tracking-wider">EXAMS</p>
                        </div>
                        <div className="bg-[#7024A8] text-white rounded-md p-4 sm:p-5 border border-[#581C87] text-center shadow-sm">
                            <h3 className="text-2xl sm:text-3xl font-black text-amber-300">{counts.total_students ? counts.total_students.toLocaleString() : '54,512'}+</h3>
                            <p className="text-[10px] sm:text-[11px] font-bold text-purple-200 uppercase mt-1 tracking-wider">STUDENTS</p>
                        </div>
                    </div>

                    {/* PHOTO GALLERY Card (Clickable Lightbox Trigger) */}
                    {isEnabled(config.toggle_photo_gallery) && galleryImages.length > 0 && (
                        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-[#7024A8] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <i className="fa-solid fa-camera text-white"></i>
                                    <span className="uppercase tracking-wider font-extrabold text-white">PHOTO GALLERY</span>
                                </div>
                                <span className="text-[10px] bg-[#581C87] text-white px-2.5 py-0.5 rounded font-black tracking-wider uppercase shadow-sm">
                                    LIVE SLIDER
                                </span>
                            </div>
                            <div className="p-4 overflow-hidden relative">
                                <div className="animate-photo-marquee">
                                    <div className="flex gap-4 pr-4 shrink-0">
                                        {galleryImages.map((imgUrl, idx) => (
                                            <div
                                                key={`gallery-a-${idx}`}
                                                onClick={() => setSelectedImage(getUrl(imgUrl))}
                                                className="w-56 h-36 rounded-md border border-slate-200 overflow-hidden bg-slate-900 shrink-0 shadow-sm group cursor-pointer relative"
                                            >
                                                <img
                                                    src={getUrl(imgUrl)}
                                                    alt={`Gallery Activity ${idx}`}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getUrl('/images/1711405466.jpg');
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/40 transition-colors flex items-center justify-center">
                                                    <i className="fa-solid fa-magnifying-glass-plus text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110"></i>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 pr-4 shrink-0" aria-hidden="true">
                                        {galleryImages.map((imgUrl, idx) => (
                                            <div
                                                key={`gallery-b-${idx}`}
                                                onClick={() => setSelectedImage(getUrl(imgUrl))}
                                                className="w-56 h-36 rounded-md border border-slate-200 overflow-hidden bg-slate-900 shrink-0 shadow-sm group cursor-pointer relative"
                                            >
                                                <img
                                                    src={getUrl(imgUrl)}
                                                    alt={`Gallery Activity ${idx}`}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getUrl('/images/1711405466.jpg');
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/40 transition-colors flex items-center justify-center">
                                                    <i className="fa-solid fa-magnifying-glass-plus text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110"></i>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right 4 Cols: IMPORTANT LINKS, HELPLINE Box & STACKED SERVICES SIDEBAR */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                    {/* IMPORTANT LINKS Card */}
                    <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-[#7024A8] text-white font-extrabold px-4 py-2.5 text-xs text-center uppercase tracking-wider">
                            IMPORTANT LINKS
                        </div>
                        <div className="p-3 space-y-2 text-[13px] font-semibold text-slate-700">
                            <Link href={getUrl('/all-course')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; All Courses</Link>
                            {isEnabled(config.toggle_verified_centers) && (
                                <Link href={getUrl('/verified-center')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Verified Center</Link>
                            )}
                            {isEnabled(config.toggle_success_students) && (
                                <Link href={getUrl('/success-student')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Success Students</Link>
                            )}
                            {isEnabled(config.toggle_contact_form) && (
                                <Link href={getUrl('/contact-us')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Contact Us</Link>
                            )}
                        </div>
                    </div>

                    {/* HELPLINE Box */}
                    <div className="bg-white border-2 border-rose-600 rounded-md p-5 text-center shadow-sm">
                        <p className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">HELPLINE</p>
                        <p className="text-2xl font-black text-[#7024A8] font-mono mt-1">{config.site_phone || '09649700002'}</p>
                    </div>

                    {/* STACKED SERVICES SIDEBAR */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* ACADEMIC SERVICES */}
                        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-[#7024A8] text-white px-3 py-2 text-xs font-bold flex items-center gap-2">
                                <i className="fa-solid fa-book-open text-white"></i>
                                <span className="uppercase tracking-wider text-white">ACADEMIC SERVICES</span>
                            </div>
                            <div className="p-3 space-y-2 text-[13px] font-semibold text-slate-700">
                                <Link href={getUrl('/all-course')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; All Courses</Link>
                                {isEnabled(config.toggle_result_verify) && (
                                    <Link href={getUrl('/result')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Student Result</Link>
                                )}
                                {isEnabled(config.toggle_success_students) && (
                                    <Link href={getUrl('/success-student')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Success Students</Link>
                                )}
                            </div>
                        </div>

                        {/* CENTER SERVICES */}
                        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-[#7024A8] text-white px-3 py-2 text-xs font-bold flex items-center gap-2">
                                <i className="fa-solid fa-building text-white"></i>
                                <span className="uppercase tracking-wider text-white">CENTER SERVICES</span>
                            </div>
                            <div className="p-3 space-y-2 text-[13px] font-semibold text-slate-700">
                                {isEnabled(config.toggle_verified_centers) && (
                                    <Link href={getUrl('/verified-center')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Verified Centers</Link>
                                )}
                                {isEnabled(config.toggle_center_apply) && (
                                    <Link href={getUrl('/center-request/create')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Center Apply</Link>
                                )}
                                <Link href={getUrl('/login')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Center Login</Link>
                            </div>
                        </div>

                        {/* INFORMATION */}
                        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-[#7024A8] text-white px-3 py-2 text-xs font-bold flex items-center gap-2">
                                <i className="fa-solid fa-circle-info text-white"></i>
                                <span className="uppercase tracking-wider text-white">INFORMATION</span>
                            </div>
                            <div className="p-3 space-y-2 text-[13px] font-semibold text-slate-700">
                                {isEnabled(config.toggle_notice_board) && (
                                    <Link href={getUrl('/all-notice-list')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Notice Board</Link>
                                )}
                                <Link href={getUrl('/')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; About Us</Link>
                                {isEnabled(config.toggle_contact_form) && (
                                    <Link href={getUrl('/contact-us')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Contact Us</Link>
                                )}
                            </div>
                        </div>

                        {/* POLICIES */}
                        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                            <div className="bg-[#7024A8] text-white px-3 py-2 text-xs font-bold flex items-center gap-2">
                                <i className="fa-solid fa-file-contract text-white"></i>
                                <span className="uppercase tracking-wider text-white">POLICIES</span>
                            </div>
                            <div className="p-3 space-y-2 text-[13px] font-semibold text-slate-700">
                                <Link href={getUrl('/page/terms')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Terms & Condition</Link>
                                <Link href={getUrl('/page/privacy')} className="block hover:text-[#7024A8] transition hover:translate-x-1">&rsaquo; Privacy Policy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. OUR COURSES Card (Desktop Grid & Mobile 2-Row Horizontal Auto-Slider) */}
            <CourseList courses={courses} />
            {/* 5. VERIFIED CENTERS Card (Continuous Auto-Slider) */}
            {isEnabled(config.toggle_verified_centers) && verifiedInstitutes.length > 0 && (
                <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                    <div className="bg-[#7024A8] text-white px-4 py-2.5 text-xs font-bold flex justify-between items-center">
                        <div className="flex items-center gap-2 text-white">
                            <i className="fa-solid fa-building-columns text-white"></i>
                            <span className="uppercase tracking-wider font-extrabold text-white">VERIFIED CENTERS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-[#581C87] text-white px-2.5 py-0.5 rounded font-black tracking-wider uppercase shadow-sm">
                                LIVE SLIDER
                            </span>
                            <Link href={getUrl('/verified-center')} className="bg-[#581C87] text-white hover:bg-purple-900 px-3 py-1 rounded text-[10px] uppercase font-black tracking-wider shadow-sm transition">
                                VIEW ALL
                            </Link>
                        </div>
                    </div>
                    <div className="p-4 overflow-hidden relative">
                        <div className="animate-center-marquee">
                            <div className="flex gap-4 pr-4 shrink-0">
                                {verifiedInstitutes.map((inst, idx) => (
                                    <div key={`center-a-${inst.id || idx}`} className="w-80 p-3 border border-slate-200 rounded-md flex items-center gap-3 bg-white hover:border-purple-300 transition shrink-0 shadow-sm group">
                                        <div className="w-12 h-12 border border-slate-200 rounded overflow-hidden shrink-0 flex items-center justify-center bg-slate-50">
                                            <img
                                                src={inst.photo || inst.center_logo || inst.logo ? getUrl(inst.photo || inst.center_logo || inst.logo) : getUrl('/images/1711405466.jpg')}
                                                alt={inst.name}
                                                className="w-10 h-10 object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = getUrl('/images/1711405466.jpg');
                                                }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-extrabold text-slate-800 text-[13px] truncate group-hover:text-[#7024A8] transition-colors">{inst.name}</p>
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase mt-0.5 inline-block">Verified Center</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 pr-4 shrink-0" aria-hidden="true">
                                {verifiedInstitutes.map((inst, idx) => (
                                    <div key={`center-b-${inst.id || idx}`} className="w-80 p-3 border border-slate-200 rounded-md flex items-center gap-3 bg-white hover:border-purple-300 transition shrink-0 shadow-sm group">
                                        <div className="w-12 h-12 border border-slate-200 rounded overflow-hidden shrink-0 flex items-center justify-center bg-slate-50">
                                            <img
                                                src={inst.photo || inst.center_logo || inst.logo ? getUrl(inst.photo || inst.center_logo || inst.logo) : getUrl('/images/1711405466.jpg')}
                                                alt={inst.name}
                                                className="w-10 h-10 object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = getUrl('/images/1711405466.jpg');
                                                }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-extrabold text-slate-800 text-[13px] truncate group-hover:text-[#7024A8] transition-colors">{inst.name}</p>
                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase mt-0.5 inline-block">Verified Center</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. SUCCESS STUDENTS Card (Continuous Auto-Slider) */}
            {isEnabled(config.toggle_success_students) && successStudentList.length > 0 && (
                <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                    <div className="bg-[#7024A8] text-white px-4 py-2.5 text-xs font-bold flex justify-between items-center">
                        <div className="flex items-center gap-2 text-white">
                            <i className="fa-solid fa-users text-white"></i>
                            <span className="uppercase tracking-wider font-extrabold text-white">SUCCESS STUDENTS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-[#581C87] text-white px-2.5 py-0.5 rounded font-black tracking-wider uppercase shadow-sm">
                                LIVE SLIDER
                            </span>
                            <Link href={getUrl('/success-student')} className="bg-[#581C87] text-white hover:bg-purple-900 px-3 py-1 rounded text-[10px] uppercase font-black tracking-wider shadow-sm transition">
                                VIEW ALL
                            </Link>
                        </div>
                    </div>
                    <div className="p-5 overflow-hidden relative">
                        <div className="animate-student-marquee">
                            <div className="flex gap-6 pr-6 shrink-0">
                                {successStudentList.map((st, idx) => (
                                    <div key={`student-a-${st.id || idx}`} className="w-32 shrink-0 space-y-2 text-center group cursor-pointer">
                                        <div className="w-20 h-20 rounded-full border-[3px] border-[#7024A8] overflow-hidden mx-auto bg-slate-100 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                            <img
                                                src={st.photo || st.picture ? getUrl(st.photo || st.picture) : getUrl('/images/avatar.png')}
                                                alt={st.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = getUrl('/images/avatar.png');
                                                }}
                                            />
                                        </div>
                                        <p className="font-extrabold text-slate-800 text-[13px] truncate group-hover:text-[#7024A8] transition-colors">{st.name}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-6 pr-6 shrink-0" aria-hidden="true">
                                {successStudentList.map((st, idx) => (
                                    <div key={`student-b-${st.id || idx}`} className="w-32 shrink-0 space-y-2 text-center group cursor-pointer">
                                        <div className="w-20 h-20 rounded-full border-[3px] border-[#7024A8] overflow-hidden mx-auto bg-slate-100 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                            <img
                                                src={st.photo || st.picture ? getUrl(st.photo || st.picture) : getUrl('/images/avatar.png')}
                                                alt={st.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = getUrl('/images/avatar.png');
                                                }}
                                            />
                                        </div>
                                        <p className="font-extrabold text-slate-800 text-[13px] truncate group-hover:text-[#7024A8] transition-colors">{st.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 7. VIDEO GALLERY Card (Clickable Link Redirection to Video Gallery Page) */}
            {isEnabled(config.toggle_video_gallery) && (
                <VideoGallery youtube_videos={youtube_videos} />
            )}

            {/* 8. CERTIFIED Card (Continuous Auto-Slider) */}
            {isEnabled(config.toggle_sponsors) && sponsorList.length > 0 && (
                <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                    <div className="bg-[#7024A8] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                            <i className="fa-solid fa-certificate text-white"></i>
                            <span className="uppercase tracking-wider font-extrabold text-white">CERTIFIED</span>
                        </div>
                        <span className="text-[10px] bg-[#581C87] text-white px-2.5 py-0.5 rounded font-black tracking-wider uppercase shadow-sm">
                            REGISTERED
                        </span>
                    </div>
                    <div className="p-4 overflow-hidden relative">
                        <div className="animate-sponsor-marquee items-center">
                            <div className="flex gap-8 pr-8 items-center shrink-0">
                                {sponsorList.map((logoUrl, idx) => (
                                    <div key={`sponsor-a-${idx}`} 
                                        onClick={() => setClickedSponsors(prev => ({...prev, [idx]: !prev[idx]}))}
                                        className={`h-16 w-40 bg-slate-50 border border-slate-100 rounded-md p-2 flex items-center justify-center shrink-0 shadow-sm transition cursor-pointer group ${clickedSponsors[idx] ? 'grayscale border-purple-200 shadow-md' : 'hover:border-purple-200 hover:shadow-md'}`}>
                                        <img
                                            src={getUrl(logoUrl)}
                                            alt={`Certified Partner ${idx}`}
                                            className={`h-full w-full object-contain transition-all duration-300 ${clickedSponsors[idx] ? 'grayscale' : 'group-hover:grayscale'}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getUrl('/images/1711405466.jpg');
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-8 pr-8 items-center shrink-0" aria-hidden="true">
                                {sponsorList.map((logoUrl, idx) => (
                                    <div key={`sponsor-b-${idx}`} 
                                        onClick={() => setClickedSponsors(prev => ({...prev, [idx]: !prev[idx]}))}
                                        className={`h-16 w-40 bg-slate-50 border border-slate-100 rounded-md p-2 flex items-center justify-center shrink-0 shadow-sm transition cursor-pointer group ${clickedSponsors[idx] ? 'grayscale border-purple-200 shadow-md' : 'hover:border-purple-200 hover:shadow-md'}`}>
                                        <img
                                            src={getUrl(logoUrl)}
                                            alt={`Certified Partner ${idx}`}
                                            className={`h-full w-full object-contain transition-all duration-300 ${clickedSponsors[idx] ? 'grayscale' : 'group-hover:grayscale'}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getUrl('/images/1711405466.jpg');
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/30 p-3 rounded-full text-2xl transition z-[110]"
                        aria-label="Close Lightbox"
                    >
                        <i className="fa-solid fa-xmark w-6 h-6 flex items-center justify-center"></i>
                    </button>
                    <img
                        src={selectedImage}
                        alt="Enlarged Gallery Photo"
                        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl transition-transform duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </FrontendLayout>
    );
}
