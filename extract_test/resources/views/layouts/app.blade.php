<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="csrf-token" content="{{ csrf_token() }}"/>
    <title>Young Tecnical Training</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap"/>
    <link rel="stylesheet" href="{{ mix('css/app.css') }}"/>
    <style>

        .bg-gradient-success {
            background-color: #1cc88a;
            background-image: linear-gradient(180deg, #1cc88a 10%, #13855c 100%);
            background-size: cover;
        }
        .bg-gradient-primary {
            background-color: #4e73df;
            background-image: linear-gradient(180deg, #4e73df 10%, #224abe 100%);
            background-size: cover;
        }
    </style>
</head>
<body class="font-sans antialiased print:!mb-0">
<div
    class="flex min-h-screen bg-green-200"
    x-data="{ sidebarOpen : window.innerWidth >= 1024, width: window.innerWidth }"
    @resize.window="width = window.innerWidth"
    x-init="window.addEventListener('resize', () => { sidebarOpen = window.innerWidth >= 1024 })"
>
   @include('layouts.navigation')

    <template x-if="sidebarOpen && width < 1024">
        <div>
            <div
                @click.slef="sidebarOpen = false"
                class="absolute z-0 top-0 bottom-0 right-0 left-0 bg-gray-500 opacity-50"
            ></div>
        </div>
    </template>

    <div class="flex flex-col flex-grow ">
        <header class="w-full flex-grow-0  print:hidden ">
            <div
                class="w-full flex   justify-between items-center bg-white border-b border-gray-200 p-4"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    @click="sidebarOpen = true"
                    class="h-6 w-6 cursor-pointer text-gray-600 lg:hidden"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
                <div class="flex-grow flex justify-end items-center gap-2">
                    <div class="h-5 ml-1 mr-2"></div>
                </div>
                <div class="relative " x-data="{ dropped: false }" x-on:click.outside="dropped = false">
                    <div class="flex items-center pl-2 mr-2 cursor-pointer" x-on:click="dropped = !dropped">
                        <img
                            src="{{ auth()->user()->avatar }}"
                            alt="Avatar of {{ auth()->user()->name }}"
                            class="h-8 w-8 rounded-full"
                        />
                        <div class="text-gray-500 font-semibold mx-1 ml-4">{{ auth()->user()->name }}</div>
                        <svg
                            class="w-3 h-3 fill-current text-gray-400 ml-2"
                            viewBox="0 0 12 12"
                        >
                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                        </svg>
                    </div>
                    <div class="w-48 fixed top-16 right-0 bg-white rounded-b shadow"
                         x-show="dropped"
                         x-transition:enter="transition origin-top ease-out duration-100"
                         x-transition:enter-start="opacity-0 scale-y-0"
                         x-transition:enter-end="opacity-100 scale-y-100"
                         x-transition:leave="transition origin-top ease-in duration-100"
                         x-transition:leave-start="opacity-100 scale-y-100"
                         x-transition:leave-end="opacity-0 scale-y-0"
                    >
                        <div class="p-2 cursor-pointer hover:font-semibold">
                            <a href="{{ route('profile-update.create') }}">
                                {{ __('Profile') }}
                            </a>
                        </div>
                        <div class="p-2 cursor-pointer hover:font-semibold">
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <div onclick="event.preventDefault(); this.closest('form').submit();">
                                    {{ __('Log Out') }}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <main class="flex-grow lg:ml-64 ">
            @isset($header)
                <div class="w-full   p-4 print:hidden">
                    {{ $header }}
                </div>
                <div class="p-2 flex items-center">
                      <div class="w-[10%]">
                          <button class="w-full px-2 border py-1 rounded-l-md bg-gradient-success text-white">Notice</button>
                      </div>
                    <div class="w-[90%]">
                        <marquee behavior="" direction="">{{\App\Models\ConfigDictionary::get('center_notice','Coming Soon')}}</marquee>
                    </div>
                </div>
            @endisset
            @if(session(\App\Mixin\ResponseMixin::SUCCESS_MESSAGE_SESSION_KEY))
                <x-alert type="success">{{ session(\App\Mixin\ResponseMixin::SUCCESS_MESSAGE_SESSION_KEY) }}</x-alert>
            @endif
            @if(session(\App\Mixin\ResponseMixin::ERROR_MESSAGE_SESSION_KEY))
                <x-alert type="error">{{ session(\App\Mixin\ResponseMixin::ERROR_MESSAGE_SESSION_KEY) }}</x-alert>
            @endif
            <div class="px-4 py-8 print:px-0 print:py-0">
                  <div class="bg-white rounded-md p-3">
                      {{ $slot }}
                  </div>
            </div>
        </main>
        <footer class="w-full p-2 text-center print:hidden">
         nhmi.com.bd
        </footer>
    </div>
</div>
<script type="text/javascript" src="{{ mix('js/app.js') }}"></script>
<script type="text/javascript">
    window.onload = () => {
        const url = location.href.indexOf('?') > 0
            ? location.href.substring(0, location.href.indexOf('?'))
            : location.href;
        document.querySelector('.nav-links').querySelectorAll("a").forEach(element => {
            if(element.href === url) {
                element.classList.add('active')
            }
        })
        document.querySelectorAll("a.active").forEach(element => {
            element.classList.remove('border-transparent')
            element.classList.add('border-teal-400')
            element.dispatchEvent(
                new CustomEvent("active", {
                    bubbles: true,
                })
            );
        });
    };
</script>
{{ $script ?? '' }}
</body>
</html>
