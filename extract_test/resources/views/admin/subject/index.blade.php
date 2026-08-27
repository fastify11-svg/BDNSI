<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-2xl font-black text-slate-800">{{ __('Course Management') }}</span>
                <span class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <span>✨</span> AI Auto-Suggest Active
                </span>
            </div>
            @can('subject-create')
                <div>
                    <a class="bg-gradient-to-r from-purple-600 via-indigo-600 to-[#7024A8] text-white py-2.5 px-5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition flex items-center gap-2 transform active:scale-95"
                       href="{{ route('admin.subject.create') }}">
                        <span class="text-lg">✨</span> {{ __('+ Create Course with AI') }}
                    </a>
                </div>
            @endcan
        </div>
    </x-slot>

    {!! '-- AI Feature Notification Banner --' && '' !!}
    <div class="w-full mt-6 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                🤖
            </div>
            <div>
                <h4 class="font-extrabold text-base tracking-wide flex items-center gap-2 text-purple-200">
                    Gemini Free AI Auto-Suggest System is Ready!
                </h4>
                <p class="text-xs text-slate-300 mt-0.5">
                    নতুন কোর্স তৈরি করতে বা পুরনো কোর্স এডিট করতে গেলে এখন আর হাতে সব টাইপ করতে হবে না। <strong>"✨ + Create Course with AI"</strong> বাটনে ক্লিক করে কোর্সের নাম লিখলেই ১-ক্লিকে সব তথ্য (কোড, ফি, সময়সীমা, সিলেবাস) স্বয়ংক্রিয়ভাবে পূরণ হয়ে যাবে।
                </p>
            </div>
        </div>
        <div class="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
            <a href="{{ route('admin.subject.create') }}" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider shadow transition text-center w-full md:w-auto">
                ⚡ Test AI Now
            </a>
        </div>
    </div>

    <div class="w-full mt-6 overflow-x-auto bg-white p-4 rounded-xl shadow border border-slate-100">
        <table class="w-full text-sm text-left text-slate-600" id="subject_table">
            <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
                <th class="px-4 py-3">{{ __('Image') }}</th>
                <th class="px-4 py-3">{{ __('Course Name') }}</th>
                <th class="px-4 py-3">{{ __('Duration') }}</th>
                <th class="px-4 py-3">{{ __('Rate') }}</th>
                <th class="px-4 py-3">{{ __('Type') }}</th>
                <th class="px-4 py-3 text-right">{{ __('Action') }}</th>
            </tr>
            </thead>
        </table>
    </div>
    <x-slot name="script">
        <script type="text/javascript" src="{{ mix('js/datatable.js') }}"></script>
        <script type="text/javascript">
            $('#subject_table').DataTable({
                serverSide: true,
                processing: true,
                ajax: {
                    url: '{{ route('admin.subject.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {
                            item.photo = `<img class="w-12 h-12 mx-auto object-cover rounded-lg border border-slate-200" src="${item.photo}" alt="${item.name}"/>`;
                            item.name_display = `<div class="font-bold text-slate-900">${item.name}</div><div class="font-mono text-xs font-normal text-slate-500">${item.code || 'No Code'}</div>`;
                            item.duration_display = item.duration ? item.duration : '<span class="text-slate-400">N/A</span>';
                            item.rate_display = item.rate ? `<span class="font-semibold text-emerald-600">৳${item.rate}</span>` : '<span class="text-slate-400">N/A</span>';
                            item.type = @js(\App\Enums\CourseType::asSelectArray())[item.type];
                            item.action = actionIcons({
                                @can('subject-update')
                                'edit': '{{ route('admin.subject.edit', '@') }}'.replace('@', item.id),
                                @endcan
                                @can('subject-delete')
                                'delete': '{{ route('admin.subject.destroy', '@') }}'.replace('@', item.id),
                                @endcan
                            });
                            return item;
                        });
                        return response.data;
                    }
                },
                order: [[1, 'asc']],
                columns: [
                    {data: 'photo', orderable: false, searchable: false},
                    {data: 'name_display', name: 'name'},
                    {data: 'duration_display', name: 'duration'},
                    {data: 'rate_display', name: 'rate'},
                    {data: 'type'},
                    {data: 'action', orderable: false, searchable: false},
                ]
            });
        </script>
    </x-slot>
</x-admin-app-layout>
