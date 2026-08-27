<x-admin-app-layout>
    <script src="https://cdn.ckeditor.com/4.20.0/standard/ckeditor.js"></script>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Youtube') }}</div>

        </div>
    </x-slot>

    <div class="w-full mt-8">
        <form action="{{route('admin.youtube-video.store')}}" method="post" enctype="multipart/form-data">
            @csrf
            <div class="w-full flex flex-wrap">
                <x-labeled-input required type="text" name="title" label="Title" class="w-full"/>
                <div class="w-full py-2">
                    <label for="">Link</label>
                    <input type="text" name="link" placeholder="Link" class="px-2 py-1 w-full rounded-md border" required>
                </div>
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
                <th>{{ __('Link') }}</th>
                <th>{{ __('Video') }}</th>
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
                    url: '{{ route('admin.youtube-video.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {
                            item.action = actionIcons({
                                'delete': '{{ route('admin.youtube-video.destroy', '@') }}'.replace('@', item.id),
                            });
                            return item;
                        });
                        return response.data;
                    }
                },
                columns: [
                    {data: 'DT_RowIndex',orderable:false,searchable:false},
                    {data: 'title'},
                    {data: 'link'},
                    {data: 'video_id'},
                    {data: 'action', orderable: false, searchable: false},
                ]
            });
        </script>
    </x-slot>

</x-admin-app-layout>
