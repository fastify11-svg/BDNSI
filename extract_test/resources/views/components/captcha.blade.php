@php($code = \App\Http\Middleware\CaptchaCodeChecker::generateCode())
<div class="w-full flex mt-4">
    <div class="w-1/2">
        <x-label for="code" :value="__('Code')"/>
        <x-input id="code" type="text" class="block mt-1 w-full" name="code" required autocomplete="off"/>
    </div>
    <div
        x-cloak
        x-data="{ rand: () => Math.floor((Math.random()*100)-50) }"
        class="w-1/2 text-center bg-white text-red-600 text-2xl font-semibold flex justify-evenly items-center px-4 select-none tracking-[.5em]">
        @foreach(str_split($code) as $char)
            <span class="float-left" x-bind:style="{ transform: 'rotate('+rand()+'deg)'}">  {{ $char }}  </span>
        @endforeach
        <input type="hidden" name="_code" value="{{ \App\Http\Middleware\CaptchaCodeChecker::encryptCode($code) }}"/>
    </div>
</div>
