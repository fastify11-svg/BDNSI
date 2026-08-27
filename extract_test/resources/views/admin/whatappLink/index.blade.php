<x-admin-app-layout>
    <script src="https://cdn.ckeditor.com/4.20.0/standard/ckeditor.js"></script>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Whatapp link') }}</div>
            <div>
                <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                   href="{{ route('admin.whatapp-link.index') }}">{{ __('notice List') }}</a>
            </div>
        </div>
    </x-slot>

    <div class="w-full mt-8">
        <form action="{{route('admin.whatapp-link.store')}}" method="post" enctype="multipart/form-data">
            @csrf
            <div class="w-full flex flex-wrap">
                <x-labeled-input required type="text" name="name" label="Customer Care Name" class="w-full"/>
                <x-labeled-input required type="number" placeholder="8801700000000" name="phone" class="w-full"/>
                <div class="w-full">
                    <div class="font-bold">Description</div>
                    <div>
                        <textarea   name="description" id="editor1" required  class="w-full"></textarea>
                    </div>
                </div>
                <div class="w-full py-2 flex justify-center">
                    <button class="px-3 py-1 border bg-blue-700 text-white rounded " type="submit">Submit</button>
                </div>
            </div>
        </form>
    </div>

    <div class="w-full mt-8">
        <table class="w-full" id="users-table">
            <thead>
            <tr>
                <th>{{ __('ID') }}</th>
                <th>{{ __('Name') }}</th>
                <th>{{ __('phone') }}</th>
                <th>{{ __('Action') }}</th>
            </tr>
            </thead>
        </table>
    </div>
    <script>
        CKEDITOR.replace( 'editor1' );
    </script>

    <x-slot name="script">
        <script type="text/javascript" src="{{ mix('js/datatable.js') }}"></script>
        <script type="text/javascript">
            $('#users-table').DataTable({
                serverSide: true,
                processing: true,
                ajax: {
                    url: '{{ route('admin.whatapp-link.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {
                            item.action = actionIcons({
                                'delete': '{{ route('admin.whatapp-link.destroy', '@') }}'.replace('@', item.id),
                            });
                            return item;
                        });
                        return response.data;
                    }
                },
                columns: [
                    {data: 'DT_RowIndex',orderable:false,searchable:false},
                    {data: 'name'},
                    {data: 'phone'},
                    {data: 'action', orderable: false, searchable: false},
                ]
            });
        </script>
    </x-slot>

</x-admin-app-layout>
