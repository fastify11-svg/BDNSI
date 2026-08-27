<x-frontend-layouts>
    <section id="login">
        <div class="container login border" style="padding:30px;">
            <h4 class="text-center" style="color:#6aa84f">Login Your Institute Account</h4>

            <div class="row">
                <div class="col-lg-4 col-md-4 col-sm-12 col-12">
                    <center>
                        <img class="p-2" src="{{\App\Lib\Image::url(\App\Models\ConfigDictionary::get('logo'))??asset('images/student/logo.png')}}"
                             alt=""
                             style="width: 80%; margin-top: 5px; border-radius: 50%;  ">

                    </center>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-12 col-12">
                       <div class="shadow p-4">
                           <div class="font-weight-bold text-danger">
                               <x-auth-session-status class="mb-4" :status="session('status')" />
                               <x-auth-validation-errors class="mb-4" :errors="$errors" />
                           </div>
                           <form class="branch-login" method="POST" action="{{route('login')}}">
                               @csrf
                               <div class="form-group">
                                   <x-frontend.input label="Institute Email" name="email" required/>
                               </div>
                               <div class="form-group">
                                   <x-frontend.input type="password" label="Password" name="password" required/>
                                   <div class="text-end">
                                       <a href="" class="text-end" contenteditable="false" style="cursor: pointer;">Forget Password?</a>
                                   </div>
                               </div>
                               <div class="checkBox  d-flex justify-content-center mt-4">
                                   <button class="btn text-white" style="background:#6aa84f" type="submit">Login</button>

                               </div>
                               <div>
                                   <a class="text-danger" style="color: black; text-decoration: none; cursor: pointer;" href="{{route('center-request.create')}}" contenteditable="false">Institute Apply</a>
                               </div>
                           </form>
                       </div>
                </div>
            </div>
        </div>
    </section>
{{--    <x-auth-card>
        <x-slot name="logo">
            <a href="/">
                <x-application-logo class="w-20 h-20 fill-current text-gray-500" />
            </a>
        </x-slot>

        <!-- Session Status -->
        <x-auth-session-status class="mb-4" :status="session('status')" />

        <!-- Validation Errors -->
        <x-auth-validation-errors class="mb-4" :errors="$errors" />

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <!-- Email Address -->
            <div>
                <x-label for="email" :value="__('Email')" />

                <x-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus />
            </div>

            <!-- Password -->
            <div class="mt-4">
                <x-label for="password" :value="__('Password')" />

                <x-input id="password" class="block mt-1 w-full"
                                type="password"
                                name="password"
                                required autocomplete="current-password" />
            </div>
            <!-- Remember Me -->
            <div class="block mt-4">
                <label for="remember_me" class="inline-flex items-center">
                    <input id="remember_me" type="checkbox" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" name="remember">
                    <span class="ml-2 text-sm text-gray-600">{{ __('Remember me') }}</span>
                </label>
            </div>

            <div class="flex items-center justify-end mt-4">
                @if (Route::has('password.request'))
                    <a class="underline text-sm text-gray-600 hover:text-gray-900" href="{{ route('password.request') }}">
                        {{ __('Forgot your password?') }}
                    </a>
                @endif

                <x-button class="ml-3">
                    {{ __('Log in') }}
                </x-button>
            </div>
        </form>
    </x-auth-card>--}}
</x-frontend-layouts>
