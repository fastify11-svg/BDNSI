<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driving License Verification - Bangladesh</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #16a34a; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
    </style>
</head>
<body class="bg-white text-gray-900">

<header class="bg-gradient-to-r from-green-500 to-green-700">
    <div class="container mx-auto px-4 py-2">
        <div class="flex justify-between items-center">
            <img src="{{asset('driving.png')}}" alt="Government Logo" class="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-white shadow-md" />
            <img src="{{asset('govt.png')}}" alt="Government Logo" class="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-white shadow-md" />
        </div>
    </div>
</header>

<main class="container mx-auto px-4 py-4">
    <div class="text-center mb-4">
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-green-800 leading-tight">
            Driving License  People's Republic of Bangladesh

        </h1>
    </div>

    <section class="flex flex-col items-center space-y-3">
        <div class="bg-white rounded-xl border-2 border-green-600 w-24 h-24 sm:w-32 sm:h-32 p-1 flex items-center justify-center shadow-md">
            <img src="{{ $data ? $data->image : asset('images/no-image.png') }}" alt="License Photo" class="object-cover w-full h-full rounded-lg" />
        </div>
        <div class="text-center">
            <h2 class="text-base sm:text-lg font-semibold text-green-800 mb-2">Verification Panel</h2>
            <div class="inline-flex items-center space-x-2 bg-white border-2 border-green-600 rounded-lg px-4 py-1 shadow-sm">
                <span class="text-base sm:text-lg font-bold text-green-900 tracking-wide">{{ $data ? $data->license_number : 'N/A' }}</span>
                <div class="w-4 h-4 rounded-full bg-white border-2 border-green-600 flex items-center justify-center">
                    <img src="{{asset('blueverify.png')}}" alt="Verified" class="w-2 h-2">
                </div>
            </div>
        </div>
    </section>
    @if($data)
        <div class="w-full max-w-xl mx-auto p-4">
            <div class="text-center mb-4">
                <h2 class="text-base font-semibold text-gray-800 mb-2">User Information</h2>
                <div class="space-y-2">
                    <div class="w-full border border-green-700 rounded-md px-3 py-1.5 bg-white text-left text-sm">
                        <span class="font-medium text-gray-600">Name:</span>
                        {{ strtoupper($data->name) }}
                    </div>
                    <div class="w-full border border-green-700 rounded-md px-3 py-1.5 bg-white text-left text-sm">
                        <span class="font-medium text-gray-600">Father's Name:</span> {{ strtoupper($data->father_name) }}
                    </div>
                    <div class="w-full border border-green-700 rounded-md px-3 py-1.5 bg-white text-left text-sm">
                        <span class="font-medium text-gray-600">CNIC:</span> {{ strtoupper($data->cnic) }}
                    </div>
                    <div class="w-full border border-green-700 rounded-md px-3 py-1.5 bg-white text-left text-sm">
                        <span class="font-medium text-gray-600">City:</span> {{ strtoupper($data->city) }}
                    </div>
                    @if($data->state)
                        <div class="w-full border border-green-700 rounded-md px-3 py-1.5 bg-white text-left text-sm">
                            <span class="font-medium text-gray-600">State:</span> {{ strtoupper($data->state) }}
                        </div>
                    @endif
                </div>
            </div>

            <div class="text-center mt-6">
                <h2 class="text-base font-semibold text-gray-800 mb-2">License Information</h2>
                <div class="space-y-2">
                    <div class="w-full border border-green-700 rounded-md px-3 py-1.5 bg-white text-left text-sm">
                        <span class="font-medium text-gray-600">License No:</span>
                        <span class="font-mono">{{ strtoupper($data->license_number) }}</span>
                    </div>
                    <div class="w-full border border-green-700 rounded-md px-3 py-1.5 bg-white text-left text-sm">
                        <span class="font-medium text-gray-600">Issue Date:</span>
                        {{ $data->issue_date ? strtoupper($data->issue_date->format('d M Y')) : 'N/A' }}
                    </div>
                    <div class="w-full border border-green-700 rounded-md px-3 py-1.5 bg-white text-left text-sm">
                        <span class="font-medium text-gray-600">Valid From:</span>
                        {{ $data->valid_from ? strtoupper($data->valid_from->format('d M Y')) : 'N/A' }}
                    </div>
                    <div class="w-full border border-green-700 rounded-md px-3 py-1.5 bg-white text-left text-sm">
                        <span class="font-medium text-gray-600">Valid To:</span>
                        {{ $data->valid_to ? strtoupper($data->valid_to->format('d M Y')) : 'N/A' }}
                    </div>
                    <div class="w-full border border-green-700 rounded-md px-3 py-1.5 bg-white text-left text-sm">
                        <span class="font-medium text-gray-600">License Type:</span>
                        @php
                            $vehicleOptions = \App\Models\License::getVehicleOptions();
                            $allowedVehicles = $data->allowed_vehicles;
                            if (!is_array($allowedVehicles)) {
                                $allowedVehicles = [$allowedVehicles];
                            }
                        @endphp

                        @if(count($allowedVehicles) > 0)
                            <div class="inline-flex flex-wrap gap-1 mt-1">
                                @foreach($allowedVehicles as $vehicle)
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                {{ strtoupper($vehicleOptions[$vehicle] ?? $vehicle) }}
                            </span>
                                @endforeach
                            </div>
                        @else
                            <span class="text-gray-500">N/A</span>
                        @endif
                    </div>
                </div>
            </div>
        </div>

    @else
    <div class="max-w-2xl mx-auto mt-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div class="text-red-600 mb-2">
                <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            </div>
            <h3 class="text-base font-semibold text-red-800 mb-1">License Not Found</h3>
            <p class="text-sm text-red-600">The license number you are looking for does not exist in our database.</p>
        </div>
    </div>
    @endif

</main>

<footer class="mt-6">
    <div class="bg-gradient-to-r from-green-500 to-green-700 text-center py-4 px-4">
        <p class="text-xs text-white leading-relaxed max-w-4xl mx-auto">
            Driving License Issuance Management System (DLIMS) automates the processes
            for driving license issuance, renewal and upgrades. This system provides
            quick processing service to public and up-to-date statistics to the authorities
            by using state-of-the-art technology and equipment.
        </p>
    </div>
    <div class="bg-gray-900 text-white">
        <div class="container mx-auto px-4 py-2 flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
            <div class="flex flex-wrap items-center space-x-3 text-xs">
                <a href="#" class="border border-gray-400 rounded-full px-2 py-1 hover:bg-white hover:text-gray-900 transition-colors">Terms & Support</a>
                <a href="#" class="hover:underline">Privacy Policy</a>
            </div>
        </div>
    </div>
</footer>

</body>
</html>
