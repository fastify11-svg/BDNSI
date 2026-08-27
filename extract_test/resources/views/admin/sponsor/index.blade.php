<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Sponsor') }}</div>

                <div>
                    <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                       href="{{ route('admin.sponsor.create') }}">{{ __('Add Sponsor  ') }}</a>
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
                <th>{{ __('Title') }}</th>
                <th>{{ __('Photo') }}</th>
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
                    url: '{{ route('admin.sponsor.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {
                            item.name = `<p class="text-center">${item.name}</p>`;
                            item.photo = `<img class="w-8 h-8 object-cover m-auto" src="${item.photo}" alt="" />`;
                            item.type=@js(\App\Enums\SliderType::asSelectArray())[item.type]
                            item.action = actionIcons({
                                {{--'edit': '{{ route('admin.sponsor.edit', '@') }}'.replace('@', item.id),--}}
                                'delete': '{{ route('admin.slider.destroy', '@') }}'.replace('@', item.id),
                            });

                            return item;
                        });
                        return response.data;
                    }
                },
                columns: [
                    {data: 'DT_RowIndex',orderable:false,searchable:false},
                    {data: 'title'},
                    {data: 'photo'},
                    {data: 'action', orderable: false, searchable: false},
                ]
            });
        </script>
    </x-slot>
</x-admin-app-layout>
