<x-admin-app-layout>
    <x-slot name="header">
        <div class="flex justify-between">
            <div class="text-xl">{{ __('Edit Course') }}</div>
            <div>
                <a
                    class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                    href="{{ route('admin.subject.index') }}">{{ __('Course') }}</a>
            </div>
        </div>
    </x-slot>

    <form action="{{ route('admin.subject.update', $subject->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="flex flex-wrap justify-center w-full bg-white p-6 rounded-xl shadow">
            {!! '-- Gemini Free AI Auto-Suggest Banner --' && '' !!}
            <div class="w-full p-2 mb-4">
                <div class="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#7024A8] text-white p-6 rounded-2xl shadow-lg border border-purple-400/30 relative overflow-hidden">
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div class="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-inner text-2xl">
                                ✨
                            </div>
                            <div>
                                <h4 class="text-lg font-black tracking-wide flex items-center gap-2">
                                    Gemini Free AI Assistant
                                    <span class="bg-gradient-to-r from-pink-400 to-amber-300 text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Free Auto-Fill</span>
                                </h4>
                                <p class="text-xs text-purple-200 mt-0.5">
                                    কোর্সের নাম লিখুন এবং <strong>"✨ Generate AI Info"</strong> বাটনে ক্লিক করুন। এআই স্বয়ংক্রিয়ভাবে কোড, মেয়াদ, ফি, যোগ্যতা এবং বিস্তারিত তথ্য পূরণ করে দেবে!
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 w-full md:w-auto justify-end">
                            <button type="button" id="btn_gemini_suggest" class="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-extrabold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm w-full md:w-auto cursor-pointer">
                                <span>✨</span> Generate AI Info
                            </button>
                            <button type="button" id="btn_ai_settings" title="Set Custom Gemini API Key" class="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl border border-white/20 transition text-sm cursor-pointer">
                                ⚙️
                            </button>
                        </div>
                    </div>

                    {!! '-- AI Loading State --' && '' !!}
                    <div id="ai_loading_container" class="hidden mt-6 pt-6 border-t border-white/10 text-center py-4">
                        <div class="inline-flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-full text-sm font-semibold animate-pulse">
                            <svg class="animate-spin h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Gemini AI কোর্সের সম্পূর্ণ সিলেবাস ও তথ্য তৈরি করছে... একটু অপেক্ষা করুন...</span>
                        </div>
                    </div>

                    {!! '-- AI Results Preview Panel --' && '' !!}
                    <div id="ai_result_container" class="hidden mt-6 pt-6 border-t border-white/15 space-y-4 animate-fadeIn">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <span id="ai_source_badge" class="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                                ✔ Gemini AI Suggestion Ready
                            </span>
                            <button type="button" id="btn_apply_all_ai" class="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-5 py-2 rounded-lg text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
                                ⚡ 1-Click Apply All Info
                            </button>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-black/20 p-4 rounded-xl border border-white/5">
                            <div>
                                <span class="text-purple-300 block mb-0.5">Course Code:</span>
                                <strong id="preview_code" class="text-white text-sm font-mono">-</strong>
                            </div>
                            <div>
                                <span class="text-purple-300 block mb-0.5">Duration:</span>
                                <strong id="preview_duration" class="text-white text-sm">-</strong>
                            </div>
                            <div>
                                <span class="text-purple-300 block mb-0.5">Fee / Rate:</span>
                                <strong id="preview_rate" class="text-amber-300 text-sm">-</strong>
                            </div>
                            <div>
                                <span class="text-purple-300 block mb-0.5">Qualification:</span>
                                <strong id="preview_qual" class="text-white text-sm truncate block">-</strong>
                            </div>
                        </div>

                        <div class="bg-black/20 p-4 rounded-xl border border-white/5 text-xs space-y-1">
                            <span class="text-purple-300 font-bold block">Course Details / Syllabus Preview:</span>
                            <p id="preview_details" class="text-purple-100 line-clamp-3 leading-relaxed">-</p>
                        </div>
                    </div>
                </div>
            </div>

            <x-label-input name="name" label="Course Name" required value="{{ old('name', $subject->name) }}" class="w-full sm:w-1/2 p-2"/>
            <x-label-input name="code" label="Course Code" value="{{ old('code', $subject->code) }}" class="w-full sm:w-1/2 p-2"/>
            <x-labeled-input name="duration" label="Duration (e.g. 6 Months)" value="{{ old('duration', $subject->duration) }}" class="w-full sm:w-1/2 p-2"/>
            <x-labeled-input name="rate" label="Course Fee/Rate (৳)" value="{{ old('rate', $subject->rate) }}" class="w-full sm:w-1/2 p-2"/>
            <x-labeled-input name="education_qualification" label="Education Qualification" value="{{ old('education_qualification', $subject->education_qualification) }}" class="w-full sm:w-1/2 p-2"/>
            
            <x-labeled-select name="type" label="Course Type" class="w-full sm:w-1/2 p-2" required>
                @foreach(\App\Enums\CourseType::getInstances() as $course_type)
                    <option value="{{$course_type->value}}" {{$subject->type->value==$course_type->value ? 'selected':''}}>{{$course_type->description}}</option>
                @endforeach
            </x-labeled-select>
            <x-labeled-textarea name="course_details" label="Course Details/Description" value="{{ old('course_details', $subject->course_details) }}" class="w-full p-2" ></x-labeled-textarea>

            <div class="w-full p-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Course Thumbnail/Photo</label>
                <input type="file" name="photo" id="photo_input" accept="image/*" class="w-full border p-2 rounded"/>
                <div id="photo_preview_container" class="mt-3 {{ $subject->photo ? '' : 'hidden' }}">
                    <img id="photo_preview" src="{{ $subject->photo }}" alt="Preview" class="w-32 h-32 object-cover rounded-lg border shadow-sm"/>
                </div>
            </div>

            <div class="w-full py-6 flex justify-center">
                <x-button class="bg-[#7024A8] hover:bg-purple-800 text-white font-bold px-8 py-3 rounded-xl">{{ __('Update Course') }}</x-button>
            </div>
        </div>
    </form>
    <x-slot name="script">
        <script>
            document.getElementById('photo_input').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById('photo_preview').src = e.target.result;
                        document.getElementById('photo_preview_container').classList.remove('hidden');
                    }
                    reader.readAsDataURL(file);
                }
            });

            let lastAiData = null;

            document.getElementById('btn_ai_settings').addEventListener('click', function() {
                const currentKey = localStorage.getItem('gemini_api_key') || '';
                const key = prompt("Enter your free Google Gemini API Key (Optional - leave empty to use BDNSI Free AI Engine):\n\nGet a free key from: https://aistudio.google.com", currentKey);
                if (key !== null) {
                    localStorage.setItem('gemini_api_key', key.trim());
                    alert('Gemini API Key saved successfully!');
                }
            });

            document.getElementById('btn_gemini_suggest').addEventListener('click', function() {
                const nameInput = document.getElementById('name');
                const name = nameInput.value.trim();
                if (!name) {
                    alert('দয়া করে প্রথমে Course Name বক্সে কোর্সের নাম লিখুন (যেমন: Web Development, Graphic Design, AutoCAD ইত্যাদি)!');
                    nameInput.focus();
                    return;
                }

                document.getElementById('ai_loading_container').classList.remove('hidden');
                document.getElementById('ai_result_container').classList.add('hidden');
                document.getElementById('btn_gemini_suggest').disabled = true;

                fetch("{{ route('admin.subject.aiSuggest') }}", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        api_key: localStorage.getItem('gemini_api_key') || ''
                    })
                })
                .then(res => res.json())
                .then(res => {
                    document.getElementById('ai_loading_container').classList.add('hidden');
                    document.getElementById('btn_gemini_suggest').disabled = false;

                    if (res.success && res.data) {
                        lastAiData = res.data;
                        document.getElementById('ai_source_badge').innerText = '✔ ' + (res.source || 'Gemini AI Suggestion Ready');
                        document.getElementById('preview_code').innerText = res.data.code || '-';
                        document.getElementById('preview_duration').innerText = res.data.duration || '-';
                        document.getElementById('preview_rate').innerText = res.data.rate ? '৳ ' + res.data.rate : '-';
                        document.getElementById('preview_qual').innerText = res.data.education_qualification || '-';
                        document.getElementById('preview_details').innerText = res.data.course_details || '-';

                        document.getElementById('ai_result_container').classList.remove('hidden');
                        
                        // Automatically apply 1-click fill
                        applyAiData(lastAiData);
                    } else {
                        alert(res.error || 'তথ্য জেনারেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
                    }
                })
                .catch(err => {
                    document.getElementById('ai_loading_container').classList.add('hidden');
                    document.getElementById('btn_gemini_suggest').disabled = false;
                    alert('নেটওয়ার্ক সমস্যা! দয়া করে আবার চেষ্টা করুন।');
                });
            });

            function applyAiData(data) {
                if (!data) return;
                if (data.code && document.getElementById('code')) document.getElementById('code').value = data.code;
                if (data.duration && document.getElementById('duration')) document.getElementById('duration').value = data.duration;
                if (data.rate && document.getElementById('rate')) document.getElementById('rate').value = data.rate;
                if (data.education_qualification && document.getElementById('education_qualification')) document.getElementById('education_qualification').value = data.education_qualification;
                if (data.type && document.getElementById('type')) document.getElementById('type').value = data.type;
                if (data.course_details && document.getElementById('course_details')) document.getElementById('course_details').value = data.course_details;

                // Visual highlight feedback
                ['code', 'duration', 'rate', 'education_qualification', 'course_details'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.transition = 'background-color 0.5s ease, border-color 0.5s ease';
                        el.style.backgroundColor = '#fef3c7'; // amber-100 highlight
                        el.style.borderColor = '#f59e0b';
                        setTimeout(() => { 
                            el.style.backgroundColor = ''; 
                            el.style.borderColor = '';
                        }, 1800);
                    }
                });
            }

            document.getElementById('btn_apply_all_ai').addEventListener('click', function() {
                if (lastAiData) {
                    applyAiData(lastAiData);
                    alert('✨ সফলভাবে সমস্ত তথ্য ফর্মে বসে গেছে!');
                }
            });
        </script>
    </x-slot>
</x-admin-app-layout>
