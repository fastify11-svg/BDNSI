@props(['subject'])


<div class="single-blog shadow rounded-xl overflow-hidden bg-white transition hover:shadow-lg">
    <div class="blog-img relative">
        <a href="{{ route('course.details', $subject->id) }}">
            <img src="{{ asset($subject->photo) }}" alt="{{ $subject->name ?? 'Course' }}" class="w-full h-48 object-cover">
        </a>
        @if($subject->rate)
            <div class="absolute top-3 right-3 bg-[#7024A8] text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md">
                ৳ {{ $subject->rate }}
            </div>
        @endif
    </div>
    <div class="blog-content p-5 flex flex-col justify-between flex-grow">
        <div>
            @if($subject->duration || $subject->education_qualification)
                <div class="flex flex-wrap gap-2 mb-3 text-xs text-slate-600">
                    @if($subject->duration)
                        <span class="bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-md border border-purple-100 flex items-center gap-1.5">
                            <i class="fi-rr-clock sm"></i> <span>{{ $subject->duration }}</span>
                        </span>
                    @endif
                    @if($subject->education_qualification)
                        <span class="bg-amber-50 text-amber-700 font-semibold px-2.5 py-1 rounded-md border border-amber-100 flex items-center gap-1.5">
                            <i class="fi-rr-graduation-cap sm"></i> <span>{{ $subject->education_qualification }}</span>
                        </span>
                    @endif
                </div>
            @endif
            <a href="{{ route('course.details', $subject->id) }}" style="cursor: pointer;">
                <h4 class="blog-content-title font-bold text-slate-800 text-lg hover:text-[#7024A8] transition line-clamp-2">
                    {{ $subject->name ?? '' }}
                </h4>
            </a>
        </div>
        <div class="blog-content-btn mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-400 font-mono">{{ $subject->code ? 'Code: ' . $subject->code : '' }}</span>
            <a href="{{ route('course.details', $subject->id) }}" class="theme-btn secondary inline-flex items-center gap-1 text-sm font-bold text-[#7024A8] hover:text-purple-900" style="cursor: pointer;">আরো দেখুন <i class="fi-rr-arrow-right"></i></a>
        </div>
    </div>
</div>








