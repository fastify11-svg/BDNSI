<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('License') }}</div>
            <div>
                <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                   href="{{ route('admin.license.create') }}">{{ __('Add License') }}</a>
            </div>
        </div>
    </x-slot>

    <div class="w-full mt-8">
        <style>
            .id-column {
                display: none;
            }
        </style>
        <table class="w-full" id="license-table">
            <thead>
            <tr>
                <th>{{ __('ID') }}</th>
                <th>{{ __('CNIC') }}</th>
                <th>{{ __('Name') }}</th>
                <th>{{ __('License Number') }}</th>
                <th>{{ __('Allowed Vehicles') }}</th>
                <th>{{ __('Valid To') }}</th>
                <th>{{ __('Action') }}</th>
            </tr>
            </thead>
        </table>
    </div>
    <x-slot name="script">
        <script type="text/javascript" src="{{ mix('js/datatable.js') }}"></script>
        <script type="text/javascript">
            $('#license-table').DataTable({
                serverSide: true,
                processing: true,
                ajax: {
                    url: '{{ route('admin.license.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {
                            item.cnic = `<p class="text-center">${item.cnic}</p>`;
                            item.name = `<p class="text-center">${item.name}</p>`;
                            item.license_number = `<p class="text-center">${item.license_number}</p>`;
                            item.allowed_vehicles = `<p class="text-center">${item.allowed_vehicles}</p>`;
                            item.valid_to_formatted = `<p class="text-center">${item.valid_to_formatted}</p>`;
                            item.action = actionIcons({
                                'show': '{{ route('admin.license.show', '@') }}'.replace('@', item.id),
                                'edit': '{{ route('admin.license.edit', '@') }}'.replace('@', item.id),
                                'delete': '{{ route('admin.license.destroy', '@') }}'.replace('@', item.id),
                            });

                            return item;
                        });
                        return response.data;
                    }
                },
                columns: [
                    {data: 'DT_RowIndex',orderable:false,searchable:false},
                    {data: 'cnic'},
                    {data: 'name'},
                    {data: 'license_number'},
                    {data: 'allowed_vehicles'},
                    {data: 'valid_to_formatted'},
                    {data: 'action', orderable: false, searchable: false},
                ]
            });
        </script>
    </x-slot>
</x-admin-app-layout>
