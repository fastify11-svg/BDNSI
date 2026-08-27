<x-admin-app-layout>
    <x-slot name="header">
        <div class="flex justify-between">
            <div class="text-xl">{{ __('Edit Session') }}</div>
            <div>
                <a
                    class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                    href="{{ route('admin.session.index') }}">{{ __('Sessions') }}</a>
            </div>
        </div>
    </x-slot>

    <form action="{{ route('admin.session.update', $session->id) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="flex flex-wrap justify-center w-full bg-white p-4">
            <x-labeled-input name="name" required value="{{ old('name', $session->name) }}" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input name="duration" type="number" min="1" required value="{{ old('duration', $session->duration) }}" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input name="exam_date" type="date" value="{{ old('exam_date', $session->exam_date ? \Carbon\Carbon::parse($session->exam_date)->format('Y-m-d') : '') }}" class="w-full p-1 md:w-1/2 lg:w-1/3"/>
            <x-labeled-input name="result_published_date" type="date" value="{{ old('result_published_date', $session->result_published_date ? \Carbon\Carbon::parse($session->result_published_date)->format('Y-m-d') : '') }}" class="w-full p-1 md:w-1/2 lg:w-1/3"/>

            <x-labeled-select name="status"   required   class="w-full p-1 md:w-1/2 lg:w-1/3">
                  @foreach(\App\Enums\SessionStatus::asArray() as $key=> $value)
                <option value="{{$value}}" {{$value==$session->status ? 'selected' : ''}}>{{$key}}</option>
                @endforeach
            </x-labeled-select>

            <div class="w-full py-8 flex justify-center">
                <x-button>{{ __('Update') }}</x-button>
            </div>
        </div>
    </form>
</x-admin-app-layout>
