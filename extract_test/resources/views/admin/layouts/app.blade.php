<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="csrf-token" content="{{ csrf_token() }}"/>
    <title> {{ $title ?? config('site.setting.name') }}</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap"/>
    <link rel="stylesheet" href="{{ mix('css/app.css') }}"/>
</head>
<body class="font-sans antialiased">
<div
    class="flex min-h-screen bg-gray-200"
    x-data="{ sidebarOpen : window.innerWidth >= 1024, width: window.innerWidth }"
    @resize.window="width = window.innerWidth"
    x-init="window.addEventListener('resize', () => { sidebarOpen = window.innerWidth >= 1024 })"
>
    <sidebar
        class="bg-[#01609F] h-screen w-64 print:hidden overflow-y-scroll scrollbar-hide fixed z-10 transition duration-300"
        :class="{ '-translate-x-64' : !sidebarOpen }"
    >

        <div class="w-full flex flex-col text-slate-300 nav-links">
            <div class="w-full p-3 mt-4 font-semibold">General</div>
            <div class="w-full flex flex-col">
                <a
                    href="{{ route('admin.dashboard') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Dashboard') }}</span>
                </a>
                @role('admin')
                <a
                    href="{{ route('admin.backup.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Database Backup') }}</span>
                </a>

                <a
                    href="{{ route('admin.whatapp-link.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Whatapp Link') }}</span>
                </a>
      <a
                    href="{{ route('admin.youtube-video.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Youtube Video') }}</span>
                </a>

                @endrole


                @can('team-read')
                    <a
                        href="{{ route('admin.team.index') }}"
                        class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                    >
                        <span>{{ __('Team') }}</span>
                    </a>
                @endcan
                @can('center-read')
                    <a
                        href="{{ route('admin.center.index') }}"
                        class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                    >
                        <span>{{ __('Center') }}</span>
                    </a>
                @endcan
                @can('user-read')
                <a
                    href="{{ route('admin.user.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('User') }}</span>
                </a>
                @endcan
                @can('sub-admin-read')
                <a
                    href="{{ route('admin.sub-admin.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Sub Admin') }}</span>
                </a>
                @endcan

                @can('subject-read')
                <a
                    href="{{ route('admin.subject.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Course') }}</span>
                </a>
                @endcan
                @can('session-read')
                <a
                    href="{{ route('admin.session.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Session') }}</span>
                </a>
                @endcan
                @can('student-read')
                <a
                    href="{{ route('admin.student.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Student') }}</span>
                </a>
                @endcan

                @can('result-read')
                <a
                    href="{{ route('admin.result.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Result') }}</span>
                </a>
                @endcan
                <a
                    href="{{ route('admin.password-update.create') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Update password') }}</span>
                </a>
                @role('admin')

                <a
                    href="{{ route('admin.slider.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Slider') }}</span>
                </a>
                <a
                    href="{{ route('admin.upazila-store.create') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Upazila') }}</span>
                </a>

                <a
                    href="{{ route('admin.notice.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Notice') }}</span>
                </a>



                <a
                    href="{{ route('admin.contactUs') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Contact Us') }}     </span>
                    <span class="p-1 bg-red-500 rounded-full">{{\App\Models\ContactUs::where('is_seen',false)->count()}}    </span>
                </a>
                <a
                    href="{{ route('admin.configDictionary.create') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Configration') }}</span>
                </a>

                <a
                    href="{{ route('admin.sponsor.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Sponsor') }}</span>
                </a>
                <a
                    href="{{ route('admin.translation.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Translation') }}</span>
                </a>

                <a
                    href="{{ route('admin.license.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('License') }}</span>
                </a>

                @endrole
            </div>
            @role('admin')
            <div class="w-full p-3 mt-4 font-semibold">Security</div>
            <div class="w-full flex flex-col">
                <a
                    href="{{ route('laratrust.roles-assignment.index') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400 {{ request()->is('*/permission/*') ? 'active' : '' }}"
                >
                    <span>{{ __('Access management') }}</span>
                </a>
                <a
                    href="{{ route('admin.password-update.create') }}"
                    class="w-full py-3 px-4 flex justify-between items-center hover:bg-slate-900 border-l-4 border-transparent hover:border-teal-400"
                >
                    <span>{{ __('Update password') }}</span>
                </a>
            </div>
            @endrole
        </div>
    </sidebar>

    <template x-if="sidebarOpen && width < 1024">
        <div>
            <div
                @click.slef="sidebarOpen = false"
                class="absolute z-0 top-0 bottom-0 right-0 left-0 bg-gray-500 opacity-50"
            ></div>
        </div>
    </template>

    <div class="flex flex-col flex-grow">
        <header class="w-full flex-grow-0 print:hidden">
            <div
                class="w-full flex justify-between items-center bg-white border-b border-gray-200 p-4"
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
                <div class="relative" x-data="{ dropped: false }" x-on:click.outside="dropped = false">
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
                            <a href="{{ route('admin.profile-update.create') }}">
                                {{ __('Profile') }}
                            </a>
                        </div>
                        <div class="p-2 cursor-pointer hover:font-semibold">
                            <form method="POST" action="{{ route('admin.logout') }}">
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
        <main class="flex-grow lg:ml-64 print:lg:ml-0">
            @isset($header)
                <div class="w-full bg-white print:hidden p-4">
                    {{ $header }}
                </div>
            @endisset
            @if(session(\App\Mixin\ResponseMixin::SUCCESS_MESSAGE_SESSION_KEY))
                <x-alert type="success">{{ session(\App\Mixin\ResponseMixin::SUCCESS_MESSAGE_SESSION_KEY) }}</x-alert>
            @endif
            @if(session(\App\Mixin\ResponseMixin::ERROR_MESSAGE_SESSION_KEY))
                <x-alert type="error">{{ session(\App\Mixin\ResponseMixin::ERROR_MESSAGE_SESSION_KEY) }}</x-alert>
            @endif
            <div class="px-4 py-8 print:px-0 print:py-0">
                {{ $slot }}
            </div>
        </main>
        <footer class="w-full p-2 text-center print:hidden">
            Copyright 2022 - {{ date('Y') }}
        </footer>
    </div>
</div>
{{ $beforeScript ?? '' }}

<script type="text/javascript" src="{{ mix('js/app.js') }}"></script>

<script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof CKEDITOR !== 'undefined') {
            // Find the instance of CKEditor and set the configuration
            for (var instance in CKEDITOR.instances) {
                if (CKEDITOR.instances.hasOwnProperty(instance)) {
                    CKEDITOR.instances[instance].config.versionCheck = false;
                }
            }
        }
    });
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
