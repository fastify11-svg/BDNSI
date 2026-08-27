<img {{ $attributes }} src="{{ \App\Lib\Image::url(\App\Models\ConfigDictionary::get('logo')) ?? asset('frontend/logo.png') }}" alt="Logo"/>
