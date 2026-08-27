<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Translation') }}</div>
            <div>
                <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                   href="{{ route('admin.translation.create') }}">{{ __('Create Translation') }}</a>
            </div>
        </div>
    </x-slot>

    <div class="w-full mt-8">
        <table class="w-full" id="users-table">
            <thead>
            <tr>
                <th>{{ __('ID') }}</th>
                <th>Key</th>
                <th>English</th>
                <th>Bangla</th>
                <th>Arabic</th>
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
                    url: '{{ route('admin.translation.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {
                            item.action = actionIcons({
                                'edit': '{{ route('admin.translation.edit', '@') }}'.replace('@', item.id),
                                'delete': '{{ route('admin.translation.destroy', '@') }}'.replace('@', item.id),
                            });
                            return item;
                        });
                        return response.data;
                    }
                },
                columns: [
                    {data: 'DT_RowIndex',orderable:false,searchable:false},
                    {data: 'key'},
                    {data: 'en'},
                    {data: 'bn'},
                    {data: 'ar'},
                    {data: 'action', orderable: false, searchable: false},
                ]
            });
        </script>
    </x-slot>
</x-admin-app-layout>
