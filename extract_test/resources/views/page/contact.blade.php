<x-frontend-layouts>

    <div class="bg-light">
        <!-- Header Section -->
        <div class="py-5 text-center   text-white" style="background: #7024A8">
            <h1 class="text-white">{{__t('Contact Us')}}</h1>
            <p class="text-white">{{__t("We're here to help you. Reach out to us anytime!")}}</p>
        </div>

        <div class="container py-5">
            <div class="row g-5">
                <!-- Contact Form Section -->
                <div class="col-md-6">
                    <div class="card shadow-lg">
                        <div class="card-body p-4">
                            <h4 class="card-title mb-4">{{__t('Send Us a Message')}}</h4>

                            <!-- Success Message -->
                            @if($success = session(\App\Mixin\ResponseMixin::SUCCESS_MESSAGE_SESSION_KEY))
                                <div class="alert alert-success">
                                    {{ $success }}
                                </div>
                            @endif

                            <!-- Error Message -->
                            @if($error = session(\App\Mixin\ResponseMixin::ERROR_MESSAGE_SESSION_KEY))
                                <div class="alert alert-danger">
                                    {{ $error }}
                                </div>
                            @endif

                            <form action="{{ route('contactUs') }}" method="post">
                                @csrf
                                <div class="mb-3">
                                    <label for="name" class="form-label">{{__t('Name')}}</label>
                                    <input type="text" class="form-control" name="name" id="name" placeholder="Enter your name">
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">{{__t('Email')}}</label>
                                    <input type="email" class="form-control" name="email" id="email" placeholder="Enter your email">
                                </div>
                                <div class="mb-3">
                                    <label for="phone" class="form-label">{{__t('Phone')}}</label>
                                    <input type="tel" class="form-control" name="phone" id="phone" placeholder="Enter your phone number">
                                </div>
                                <div class="mb-3">
                                    <label for="message" class="form-label">{{__t('Message')}}</label>
                                    <textarea class="form-control" name="message" id="message" rows="4" placeholder="Type your message here"></textarea>
                                </div>
                                <button type="submit" class="btn  w-100 text-white" style="background: #7024A8">{{__t('Send Message')}}</button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Contact Info Section -->
                <div class="col-md-6">
                    <div class="bg-white p-4 shadow-lg rounded">
                        <h4 class="mb-4">{{__t('Get in Touch')}}</h4>
                        <p class="mb-3">
                           {{__t(' We are available to assist you with any inquiries. Feel free to contact us through the following details.')}}
                        </p>
                        <div>
                            {!! \App\Models\ConfigDictionary::get('description')??"" !!}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend-layouts>
