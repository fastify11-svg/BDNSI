<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Upazila') }}</div>

                <div>
                    <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                       href="{{ route('admin.upazila-store.create') }}">{{ __('Upazila') }}</a>
                </div>

        </div>
    </x-slot>

    <div class="w-full mt-8">
        <style>
            .id-column {
                display: none;
            }
        </style>
        <table class="w-full" id="session-table">
            <thead>
            <tr>
                <th>{{ __('ID') }}</th>
                <th>{{ __('District Name') }}</th>
                <th>{{ __('Name') }}</th>

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
                    url: '{{ route('admin.upazila-store.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {

                            item.action = actionIcons({
                                {{--'edit': '{{ route('admin.slider.edit', '@') }}'.replace('@', item.id),--}}
                                {{--'delete': '{{ route('admin.upazila-store.destroy', '@') }}'.replace('@', item.id),--}}
                            });

                            return item;
                        });
                        return response.data;
                    }
                },
                columns: [
                    {data: 'DT_RowIndex',orderable:false,searchable:false},
                    {data: 'district.name'},
                    {data: 'name'},

                ]
            });
        </script>
    </x-slot>
</x-admin-app-layout>
