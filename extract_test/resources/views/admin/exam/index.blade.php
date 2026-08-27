<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Exam') }}</div>
                <div>
                    <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                       href="{{ route('admin.exam.create') }}">{{ __('Create Exam') }}</a>
                </div>
        </div>
    </x-slot>

    <div class="w-full mt-8">
        <table class="w-full" id="users-table">
            <thead>
            <tr>
                <th>{{ __('ID') }}</th>
                <th>{{ __('Subject') }}</th>
                <th>{{ __('Exam Name') }}</th>
                <th>{{ __('Start Time') }}</th>
                <th>{{ __('End Time') }}</th>
                <th>{{ __('Status') }}</th>
                <th>{{ __('Edit') }}</th>
                <th>{{ __('Action') }}</th>
            </tr>
            </thead>
        </table>
    </div>
    <x-slot name="script">
        <script type="text/javascript" src="{{ mix('js/datatable.js') }}"></script>
        <script type="text/javascript">
            $('#users-table').DataTable({
                serverSide: true,
                processing: true,
                ajax: {
                    url: '{{ route('admin.exam.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {
                            item.action = actionIcons({
                                'show': '{{ route('admin.exam.show', '@') }}'.replace('@', item.id),
                            });
                            item.status=@js(\App\Enums\ExamStatus::asSelectArray())[item.status]
                            return item;
                        });
                        return response.data;
                    }
                },
                columns: [
                    {data: 'DT_RowIndex',orderable:false,searchable:false},
                    {data: 'subject.name'},
                    {data: 'name'},
                    {data: 'start_time'},
                    {data: 'end_time'},
                    {data: 'status',orderable:false,searchable:false},
                    {data: 'edit_exam',orderable:false,searchable:false},
                    {data: 'action', orderable: false, searchable: false},
                ]
            });
        </script>
    </x-slot>
</x-admin-app-layout>
