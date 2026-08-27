<x-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Students') }}</div>
            <div>
                <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                   href="{{ route('student.create') }}">{{ __('Create Register') }}</a>
            </div>
        </div>
    </x-slot>

    <div class="w-full mt-8">
        <table class="w-full" id="students-table">
            <thead>
            <tr>
                <th>{{ __('ID') }}</th>
                <th>{{ __('Name') }}</th>
                <th>{{ __('Session') }}</th>
                <th>{{ __('Subject') }}</th>
                <th>{{ __('Status') }}</th>
                <th>{{ __('Registration') }}</th>
                <th>{{ __('Admit') }}</th>
                <th>{{ __('Result') }}</th>
                <th>{{ __('Action') }}</th>
            </tr>
            </thead>
        </table>
    </div>
    <x-slot name="script">
        <script type="text/javascript" src="{{ mix('js/datatable.js') }}"></script>
        <script type="text/javascript">
            $('#students-table').DataTable({
                serverSide: true,
                processing: true,
                ajax: {
                    url: '{{ route('student.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {
                            item.status = @js(\App\Enums\StudentStatus::asSelectArray())[item.status]
                            item.action = actionIcons({
                                'show': '{{ route('student.show', '@') }}'.replace('@', item.id),
                                'edit': '{{ route('student.edit', '@') }}'.replace('@', item.id),
                                'delete': '{{ route('student.destroy', '@') }}'.replace('@', item.id),
                            });
                            return item;
                        });
                        return response.data;
                    }
                },
                order: [[0, 'desc']],
                columns: [
                    {data: 'id'},
                    {data: 'name'},
                    {data: 'session.name'},
                    {data: 'subject.name'},
                    {data: 'status'},
                    {data: 'registration'},
                    {data: 'admit'},
                    {data: 'result'},
                    {data: 'action', orderable: false, searchable: false},
                ]
            });
        </script>
    </x-slot>
</x-app-layout>
