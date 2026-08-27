<x-admin-app-layout>
    <x-slot name="header">
        <div class="flex justify-between">
            <div class="text-xl">{{ __('Center Details') }}</div>
            <div>
                <a
                    class="border border-slate-500 py-1 px-4 rounded text-slate-700 text-sm hover:text-white hover:bg-slate-700"
                    href="{{ route('admin.center.index') }}">{{ __('Centers') }}</a>
            </div>
        </div>
    </x-slot>

    <div class="w-full bg-white flex flex-wrap p-4">
        <div class="w-full md:w-1/2 lg:w-1/3">
            <table>
                <tr><td class="p-2 font-semibold">{{ __('Code') }}</td><td class="p-2">{{ $center->code }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Name') }}</td><td class="p-2">{{ $center->name }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Director Name') }}</td><td class="p-2">{{ $center->director_name??'' }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Director Image') }}</td><td class="p-2"><a href="{{ $center->director_image??'' }}"><img
                                src="{{ $center->director_image??'' }}" class="w-5" alt=""></a></td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Owner Name') }}</td><td class="p-2">{{ $center->owner_name }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Fathers Name') }}</td><td class="p-2">{{ $center->fathers_name }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Mothers Name') }}</td><td class="p-2">{{ $center->mothers_name }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Religion') }}</td><td class="p-2">{{ $center->religion->key }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Gender') }}</td><td class="p-2">{{ $center->gender->key }}</td></tr>
            </table>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3">
            <table>
                <tr><td class="p-2 font-semibold">{{ __('Nationality') }}</td><td class="p-2">{{ $center->nationality }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Division') }}</td><td class="p-2">{{ \App\Lib\Geo::divisions()[$center->division]['name'] }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('District') }}</td><td class="p-2">{{ \App\Lib\Geo::districts()[$center->district]['name'] }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Upazilla') }}</td><td class="p-2">{{ \App\Lib\Geo::upazillas()[$center->upazilla]['name'] }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Post Office') }}</td><td class="p-2">{{ $center->post_office }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Postal Code') }}</td><td class="p-2">{{ $center->postal_code }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Facebook URL') }}</td><td class="p-2">{{ $center->facebook_url }}</td></tr>
            </table>
        </div>
        <div class="w-full md:w-1/2 lg:w-1/3">
            <table>
                <tr><td class="p-2 font-semibold">{{ __('No Of Computers') }}</td><td class="p-2">{{ $center->no_of_computers }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Institute Age') }}</td><td class="p-2">{{ $center->institute_age }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Address') }}</td><td class="p-2">{{ $center->address }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Mobile') }}</td><td class="p-2">{{ $center->mobile }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Email') }}</td><td class="p-2">{{ $center->email }}</td></tr>
                <tr><td class="p-2 font-semibold">{{ __('Status') }}</td><td class="p-2">{{ $center->status->key }}</td></tr>
            </table>
        </div>
        <div class="w-full flex flex-wrap mt-4">
            <div class="w-full py-4 font-semibold">
                {{ __('Photo') }}
            </div>
            <div class="w-full border">
                <img src="{{ $center->photo }}" alt="Photo"/>
            </div>
        </div>
        <div class="w-full flex flex-wrap mt-4">
            <div class="w-full py-4 font-semibold">
                {{ __('Authority Signature') }}
            </div>
            <div class="w-full border">
                <img src="{{ $center->authority_signature }}" alt="Authority Signature"/>
            </div>
        </div>
        <div class="w-full flex flex-wrap mt-4">
            <div class="w-full py-4 font-semibold">
                {{ __('NID Photo') }}
            </div>
            <div class="w-full border">
                <img src="{{ $center->nid_photo }}" alt="NID Photo"/>
            </div>
        </div>
        <div class="w-full flex flex-wrap mt-4">
            <div class="w-full py-4 font-semibold">
                {{ __('Tread License') }}
            </div>
            <div class="w-full border">
                <img src="{{ $center->trade_license }}" alt="Trade License"/>
            </div>
        </div>
    </div>
</x-admin-app-layout>
