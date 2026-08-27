<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Student Document' }} - BDNSI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        @media print {
            .no-print, button, .print-hide { display: none !important; }
            body { background: white !important; padding: 0 !important; margin: 0 !important; }
        }
    </style>
</head>
<body class="bg-slate-100 min-h-screen font-sans antialiased text-slate-800 p-4 sm:p-8">
    <div class="max-w-4xl mx-auto space-y-6">
        <!-- Floating Print Bar -->
        <div class="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-md flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                    <i class="fa-solid fa-file-invoice"></i>
                </div>
                <div>
                    <h2 class="text-sm font-extrabold text-slate-900">{{ $title ?? 'Document' }}</h2>
                    <p class="text-[11px] text-slate-500 font-mono">{{ $student->name }} (Roll: {{ $student->roll }})</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="window.print()" class="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-print"></i>
                    <span>Print Document</span>
                </button>
                <a href="{{ url('/students/dashboard') }}" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
                    &larr; Back to Dashboard
                </a>
            </div>
        </div>

        <!-- Render Specific Document Component -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8">
            @if($type === 'idcard')
                <x-student.idcard :student="$student" />
            @elseif($type === 'admit-card')
                <x-student.admit-card :student="$student" />
            @elseif($type === 'registration-card')
                <x-student.registration-card :student="$student" />
            @elseif($type === 'transcript')
                <x-student.transcript :student="$student" />
            @endif
        </div>
    </div>
</body>
</html>
