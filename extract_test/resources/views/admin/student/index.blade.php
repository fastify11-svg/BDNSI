<x-admin-app-layout>
    <x-slot name="header">
        <div class="w-full flex justify-between">
            <div class="text-xl">{{ __('Students') }}</div>
            @can('student-create')
                <div>
                    <a class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                       href="{{ route('admin.student.create') }}">{{ __('Create Student') }}</a>
                </div>
            @endcan
        </div>
    </x-slot>

    <div class="w-full mt-8">
        <div class="mb-4 flex items-center justify-between">
            <div>
                <button type="button" id="bulk-generate-btn" class="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 hidden">
                    {{ __('Bulk Generate Documents') }}
                </button>
            </div>
        </div>
        <table class="w-full" id="students-table">
            <thead>
            <tr>
                <th><input type="checkbox" id="select-all"></th>
                <th>{{ __('ID') }}</th>
                <th>{{ __('Name') }}</th>
                <th>{{ __('Center') }}</th>
                <th>{{ __('Subject') }}</th>
                <th>{{ __('Type') }}</th>
                <th>{{ __('Phone') }}</th>
                <th>{{ __('Result') }}</th>
                <th>{{ __('Roll') }}</th>
                <th>{{ __('Registration') }}</th>
                <th>{{ __('Status') }}</th>
                <th>{{ __('Action') }}</th>
            </tr>
            </thead>
        </table>
    </div>

    <!-- Template Selection Modal -->
    <div id="bulk-template-modal" class="fixed inset-0 z-50 hidden bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl w-1/3 p-6">
            <h3 class="text-lg font-semibold mb-4">{{ __('Select Document Template') }}</h3>
            <div class="mb-4">
                <label for="document-template-select" class="block text-sm font-medium text-gray-700">{{ __('Template') }}</label>
                <select id="document-template-select" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="">{{ __('Loading templates...') }}</option>
                </select>
            </div>
            <div class="flex justify-end gap-2">
                <button type="button" id="close-modal-btn" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">{{ __('Cancel') }}</button>
                <button type="button" id="confirm-generate-btn" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">{{ __('Generate') }}</button>
            </div>
        </div>
    </div>
    <x-slot name="script">
        <script type="text/javascript" src="{{ mix('js/datatable.js') }}"></script>
        <script type="text/javascript">
            let table = $('#students-table').DataTable({
                serverSide: true,
                processing: true,
                ajax: {
                    url: '{{ route('admin.student.index') }}',
                    dataSrc(response) {
                        response.data.map(function (item) {
                            item.checkbox = `<input type="checkbox" class="student-checkbox" value="${item.id}">`;
                            item.status = @js(\App\Enums\StudentStatus::asSelectArray())[item.status]
                            item.course_type = @js(\App\Enums\CourseType::asSelectArray())[item.course_type]
                            item.action = actionIcons({
                                'show': '{{ route('admin.student.show', '@') }}'.replace('@', item.id),
                                @can('student-update')
                                'edit': '{{ route('admin.student.edit', '@') }}'.replace('@', item.id),
                                @endcan
                                @can('student-delete')
                                'delete': '{{ route('admin.student.destroy', '@') }}'.replace('@', item.id),
                                @endcan
                            });
                            return item;
                        });
                        return response.data;
                    }
                },
                columns: [
                    {data: 'checkbox', orderable: false, searchable: false},
                    {data: 'id'},
                    {data: 'name'},
                    {data: 'center.code'},
                    {data: 'subject.name'},
                    {data: 'course_type'},
                    {data: 'phone'},
                    {data: 'student_result'},
                    {data: 'roll',searchable:true},
                    {data: 'registration',searchable:true},
                    {data: 'status'},
                    {data: 'action', orderable: false, searchable: false},
                ]
            });

            // Handle Select All
            $('#select-all').on('click', function() {
                $('.student-checkbox').prop('checked', this.checked);
                toggleBulkButton();
            });

            // Handle individual checkbox click
            $('#students-table').on('change', '.student-checkbox', function() {
                if ($('.student-checkbox:checked').length == $('.student-checkbox').length) {
                    $('#select-all').prop('checked', true);
                } else {
                    $('#select-all').prop('checked', false);
                }
                toggleBulkButton();
            });

            function toggleBulkButton() {
                if ($('.student-checkbox:checked').length > 0) {
                    $('#bulk-generate-btn').removeClass('hidden');
                } else {
                    $('#bulk-generate-btn').addClass('hidden');
                }
            }

            // Open Modal
            $('#bulk-generate-btn').on('click', function() {
                $('#bulk-template-modal').removeClass('hidden');
                
                // Fetch templates
                $.ajax({
                    url: '{{ route('admin.document-templates.index') }}',
                    type: 'GET',
                    headers: {
                        'Accept': 'application/json' // Assuming the controller can return JSON
                    },
                    success: function(res) {
                        let options = '<option value="">{{ __('Select a template...') }}</option>';
                        // If it's a paginated inertia/json response or just items
                        let templates = res.data ? res.data : (res.templates ? res.templates : res);
                        
                        if(Array.isArray(templates)) {
                            templates.forEach(t => {
                                options += `<option value="${t.id}">${t.name} (${t.type})</option>`;
                            });
                        } else if (templates.data) {
                             templates.data.forEach(t => {
                                options += `<option value="${t.id}">${t.name} (${t.type})</option>`;
                            });
                        }
                        $('#document-template-select').html(options);
                    }
                });
            });

            // Close Modal
            $('#close-modal-btn').on('click', function() {
                $('#bulk-template-modal').addClass('hidden');
            });

            // Confirm Generation
            $('#confirm-generate-btn').on('click', function() {
                let template_id = $('#document-template-select').val();
                if (!template_id) {
                    alert('Please select a template');
                    return;
                }

                let student_ids = [];
                $('.student-checkbox:checked').each(function() {
                    student_ids.push($(this).val());
                });

                if (student_ids.length === 0) return;

                // Open bulk generate in new tab via form submission
                let form = $('<form>', {
                    'action': '{{ route('admin.document-templates.bulk-generate') }}',
                    'method': 'POST',
                    'target': '_blank'
                }).append($('<input>', {
                    'type': 'hidden',
                    'name': '_token',
                    'value': '{{ csrf_token() }}'
                })).append($('<input>', {
                    'type': 'hidden',
                    'name': 'template_id',
                    'value': template_id
                }));

                student_ids.forEach(id => {
                    form.append($('<input>', {
                        'type': 'hidden',
                        'name': 'student_ids[]',
                        'value': id
                    }));
                });

                $('body').append(form);
                form.submit();
                $('#bulk-template-modal').addClass('hidden');
            });

        </script>
    </x-slot>
</x-admin-app-layout>
