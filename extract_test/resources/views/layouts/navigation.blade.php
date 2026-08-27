<sidebar
    class=" shadow-lg bg-white h-screen w-64 overflow-y-scroll scrollbar-hide print:hidden fixed z-10 transition duration-300"
    :class="{ '-translate-x-64' : !sidebarOpen }"
>
    <div class="p-8 md:pl-4 flex md:flex-row-reverse justify-between items-center flex-wrap">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            @click="sidebarOpen = false"
            class="text-gray-400 h-6 w-6 cursor-pointer md:hidden"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
        </svg>
        <img
            src="{{ auth()->user()->avatar }}"
            alt="Avatar of {{ auth()->user()->username }}"
            class="h-8 w-8 rounded-full"
        />
        <div class="w-full md:w-auto pt-2 md:pt-0">
            <div
                class="w-full text-black font-semibold text-right md:text-left">{{ auth()->user()->name }}</div>
            <div class="w-full text-black text-sm text-right md:text-left">{{ auth()->user()->username }}</div>
        </div>
    </div>
    <div class="w-full flex flex-col text-black nav-links">
        <div class="w-full p-3 mt-4 font-semibold">General</div>
        <div class="w-full flex flex-col">
            <a
                href="{{ route('dashboard') }}"
                class="w-full py-3 px-4 flex justify-between items-center hover:bg-green-200 border-l-4 border-transparent hover:border-teal-400"
            >
                <span>{{ __('Dashboard') }}</span>
            </a>

            <a
                href="{{ route('student.create') }}"
                class="w-full py-3 px-4 flex justify-between items-center hover:bg-green-200 border-l-4 border-transparent hover:border-teal-400"
            >
                <span>{{ __('Add Registration') }}</span>
            </a>
            <a
                href="{{ route('student.index') }}"
                class="w-full py-3 px-4 flex justify-between items-center hover:bg-green-200 border-l-4 border-transparent hover:border-teal-400"
            >
                <span>{{ __('Student List') }}</span>
            </a>
            <a
                href="{{ route('centerStudentResult') }}"
                class="w-full py-3 px-4 flex justify-between items-center hover:bg-green-200 border-l-4 border-transparent hover:border-teal-400"
            >
                <span>{{ __(' Student Result') }}</span>
            </a>

            <a
                href="{{ route('student-submission.create') }}"
                class="w-full py-3 px-4 flex justify-between items-center hover:bg-green-200 border-l-4 border-transparent hover:border-teal-400"
            >
                <span>{{ __('Student Submission') }}</span>
            </a>
        </div>
        <div class="w-full p-3 mt-4 font-semibold">Security</div>
        <div class="w-full flex flex-col">
            <a
                href="{{ route('password-update.create') }}"
                class="w-full py-3 px-4 flex justify-between items-center hover:bg-green-200 border-l-4 border-transparent hover:border-teal-400"
            >
                <span>{{ __('Update password') }}</span>
            </a>
        </div>
    </div>
</sidebar>
