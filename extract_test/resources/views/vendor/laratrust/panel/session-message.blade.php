@php($classes = [
    'error' => 'w-full p-4 text-white bg-red-600',
    'warning' => 'w-full p-4 text-white bg-yellow-600',
    'success' => 'w-full p-4 text-white bg-green-600',
])

@foreach (['error', 'warning', 'success'] as $msg)
    @if(Session::has('laratrust-' . $msg))
        <div class="{{ $classes[$msg] }}" role="alert">
            <p>{{ Session::get('laratrust-' . $msg) }}</p>
        </div>
    @endif
@endforeach
