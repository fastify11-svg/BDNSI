<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Sessions') }}</div>
            @can('session-create')
                <div>
                    <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                       href="{{ route('admin.session.create') }}">{{ __('Create Session') }}</a>
                </div>
            @endcan
        </div>
    </x-slot>

    <div class="w-full mt-8">
        <table class="w-full" id="session-table">
            <thead>
            <tr>
                <th>{{ __('ID') }}</th>
                <th>{{ __('Name') }}</th>
                <th>{{ __('Duration (Months)') }}</th>
                <th>{{ __('Exam Date') }}</th>
                <th>{{ __('Result Date') }}</th>
                <th>{{ __('Status') }}</th>
                <th>{{ __('Action') }}</th>
            </tr>
            </thead>
        </table>
    </div>
    <x-slot name="script">
        <script type="text/javascript" src="{{ mix('js/datatable.js') }}"></script>
        <script type="text/javascript">
            $('#session-table').DataTable({
                serverSide: true,
                processing: true,
                ajax: {
                    url: '{{ route('admin.session.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {
                            item.name = `<p class="text-center">${item.name}</p>`;
                            item.duration = item.course_duration_string ? `<span class="badge bg-info text-white">${item.course_duration_string}</span>` : 'N/A';
                            item.exam_date = item.exam_date ? item.exam_date : '<span class="text-secondary">Not Set</span>';
                            item.result_published_date = item.result_published_date ? item.result_published_date : '<span class="text-secondary">Not Set</span>';
                            item.action = actionIcons({
                                @can('session-update')
                                'edit': '{{ route('admin.session.edit', '@') }}'.replace('@', item.id),
                                @endcan
                                @can('session-delete')
                                'delete': '{{ route('admin.session.destroy', '@') }}'.replace('@', item.id),
                                @endcan
                            });
                            item.status=@js(\App\Enums\SessionStatus::asSelectArray())[item.status]
                            return item;
                        });
                        return response.data;
                    }
                },
                order: [[0, 'desc']],
                columns: [
                    {data: 'id'},
                    {data: 'name'},
                    {data: 'duration'},
                    {data: 'exam_date'},
                    {data: 'result_published_date'},
                    {data: 'status'},
                    {data: 'action', orderable: false, searchable: false},
                ]
            });
        </script>
    </x-slot>
</x-admin-app-layout>
