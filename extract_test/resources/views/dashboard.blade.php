<x-app-layout>
    <x-slot name="header">
        <h2 class="font-bold text-2xl text-gray-900 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <!-- Cards Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        @foreach($cards as $key=>$value)
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg">
                <div class="p-6">
                    <h3 class="text-xl font-semibold">{{ $key ?? '' }}</h3>
                    <p class="text-4xl font-bold mt-4">{{$value ?? '' }}</p>
                </div>

            </div>
        @endforeach
    </div>

    <!-- Center Information Section -->
    <div class="bg-white rounded-lg shadow-lg mt-8 p-6">
        <div class="border-b pb-3">
            <h3 class="text-2xl font-semibold text-gray-700">{{ __('Center Information') }}</h3>
        </div>

        @php($center = auth()->user()->center)

        @if($center)
            <!-- Tabbed Interface -->
            <div x-data="{ tab: 'basic' }" class="mt-6">
                <!-- Tabs -->
                <div class="flex border-b border-gray-300 mb-4">
                    <button @click="tab = 'basic'" :class="tab === 'basic' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'" class="py-2 px-4 font-semibold focus:outline-none">
                        {{ __('Basic Info') }}
                    </button>
                    <button @click="tab = 'location'" :class="tab === 'location' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'" class="py-2 px-4 font-semibold focus:outline-none">
                        {{ __('Location') }}
                    </button>
                    <button @click="tab = 'other'" :class="tab === 'other' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'" class="py-2 px-4 font-semibold focus:outline-none">
                        {{ __('Other Info') }}
                    </button>
                </div>

                <!-- Tab Content -->
                <div x-show="tab === 'basic'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <table class="w-full">
                        @foreach ([
                            'Code' => $center->code ?? '',
                            'Name' => $center->name ?? '',
                            'Owner Name' => $center->owner_name ?? '',
                            'Fathers Name' => $center->fathers_name ?? '',
                            'Mothers Name' => $center->mothers_name ?? '',
                            'Religion' => $center->religion->key ?? '',
                            'Gender' => $center->gender->key ?? ''
                        ] as $label => $value)
                            <tr class="border-b">
                                <td class="p-2 font-semibold">{{ __($label) }}</td>
                                <td class="p-2">{{ $value }}</td>
                            </tr>
                        @endforeach
                    </table>
                </div>
                <div x-show="tab === 'location'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <table class="w-full">
                        @foreach ([
                            'Nationality' => $center->nationality ?? '',
                            'Division' => \App\Lib\Geo::divisions()[$center->division]['name'] ?? '',
                            'District' => \App\Lib\Geo::districts()[$center->district]['name'] ?? '',
                            'Upazilla' => \App\Lib\Geo::upazillas()[$center->upazilla]['name'] ?? '',
                            'Post Office' => $center->post_office ?? '',
                            'Postal Code' => $center->postal_code ?? '',
                            'Facebook URL' => $center->facebook_url ?? ''
                        ] as $label => $value)
                            <tr class="border-b">
                                <td class="p-2 font-semibold">{{ __($label) }}</td>
                                <td class="p-2">{{ $value }}</td>
                            </tr>
                        @endforeach
                    </table>
                </div>
                <div x-show="tab === 'other'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <table class="w-full">
                        @foreach ([
                            'No Of Computers' => $center->no_of_computers ?? '',
                            'Institute Age' => $center->institute_age ?? '',
                            'Address' => $center->address ?? '',
                            'Mobile' => $center->mobile ?? '',
                            'Email' => $center->email ?? '',
                            'Status' => $center->status->key ?? ''
                        ] as $label => $value)
                            <tr class="border-b">
                                <td class="p-2 font-semibold">{{ __($label) }}</td>
                                <td class="p-2">{{ $value }}</td>
                            </tr>
                        @endforeach
                    </table>
                </div>
            </div>
        @else
            <div class="text-center text-red-500 font-bold mt-6">
                {{ __('Center Not Found') }}
            </div>
        @endif
    </div>
</x-app-layout>
