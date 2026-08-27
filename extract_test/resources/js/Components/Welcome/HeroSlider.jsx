import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/inertia-react';
import { getUrl } from '../../utils/urlHelper';

export default function HeroSlider({ sliders }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const activeSliders = sliders && sliders.length > 0 ? sliders : [];

    useEffect(() => {
        if (activeSliders.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSliders.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeSliders.length]);

    if (activeSliders.length === 0) {
        return (
            <div className="lg:col-span-8 bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-center items-center h-56 sm:h-[340px] lg:h-[388px]">
                <div className="text-center p-6">
                    <i className="fa-solid fa-images text-4xl text-slate-300 mb-3"></i>
                    <h2 className="text-xl font-black text-slate-400">Welcome to BDNSI</h2>
                    <p className="text-sm text-slate-500 mt-2">No promotional banners are currently active.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-8 bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="relative w-full h-56 sm:h-[340px] lg:h-[388px] bg-slate-950 flex items-center justify-center overflow-hidden rounded-md group">
                <img
                    src={activeSliders[currentSlide]?.photo || activeSliders[currentSlide]?.image ? getUrl(activeSliders[currentSlide].photo || activeSliders[currentSlide].image) : getUrl('/images/about.jpg')}
                    alt={activeSliders[currentSlide]?.title || "Technical Education Training Banner"}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getUrl('/images/govt.png');
                    }}
                />
                {/* Overlay text */}
                <div className="absolute inset-0 bg-black/40 z-0"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                    {activeSliders[currentSlide]?.title && (
                        <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg mb-2">{activeSliders[currentSlide].title}</h2>
                    )}
                    {activeSliders[currentSlide]?.subtitle && (
                        <p className="text-sm sm:text-lg text-white/90 drop-shadow-md mb-6 max-w-2xl">{activeSliders[currentSlide].subtitle}</p>
                    )}
                    {activeSliders[currentSlide]?.button_text && (
                        <Link 
                            href={activeSliders[currentSlide].button_link || '#'} 
                            className="px-6 py-2.5 bg-[#7024A8] hover:bg-[#581C87] text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                        >
                            {activeSliders[currentSlide].button_text}
                        </Link>
                    )}
                </div>
                {/* Navigation Arrows */}
                {activeSliders.length > 1 && (
                    <>
                        <button
                            onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSliders.length) % activeSliders.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                            aria-label="Previous Banner"
                        >
                            <i className="fa-solid fa-chevron-left text-sm"></i>
                        </button>
                        <button
                            onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSliders.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                            aria-label="Next Banner"
                        >
                            <i className="fa-solid fa-chevron-right text-sm"></i>
                        </button>
                    </>
                )}
                {/* Indicator Dots */}
                {activeSliders.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 z-10 max-w-[90%] overflow-x-auto no-scrollbar">
                        {activeSliders.map((_, idx) => (
                            <button
                                key={`dot-${idx}`}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shrink-0 ${currentSlide === idx ? 'bg-amber-400 scale-125 shadow-sm' : 'bg-white/50 hover:bg-white'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
