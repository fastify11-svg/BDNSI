<x-frontend-layouts>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script src="{{mix('js/app.js')}}"></script>
    <!-- Hero Area -->
    <div class="w-100">
        <div class="container mt-1" style="background-color: var(--primary-color);">
            <div class="topbar-left">
                <div class="topbar-update-notice text-white">
                    <marquee behavior="" direction="left">{{\App\Models\ConfigDictionary::get('notice','coming soon')}}</marquee>
                </div>
            </div>
        </div>

    </div>

    <section class="students-area section-padding">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="section-head">
                        <h3 class="section-head-title">
                            {{__t('Approved')}} <span class="title-line style-2"></span>
                        </h3>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="students-slider">
                        @forelse(\App\Models\Slider::where('type',\App\Enums\SliderType::Sponsor)->take(30)->get() as $sponsor)
                            <div class=" w-100 h-25 card ">
                                <img style="height: 170px" class="w-full " src="{{$sponsor->photo??''}}" alt="">
                                <div class="p-1 h6 text-center">
                                    {{$sponsor->title??''}}
                                </div>
                            </div>
                        @empty
                            <div>{{__t('Not Found')}}</div>
                        @endforelse
                    </div>
                </div>
            </div>
            {{--     <div class="row">
                     <div class="col-12">
                         <div class="section-bottom-btn">
                             <a href="{{route('successStudent')}}" class="theme-btn secondary">see more<i
                                     class="fi-rr-arrow-right"></i></a>
                         </div>
                     </div>
                 </div>--}}
        </div>
    </section>
    <!-- End Students Area -->
    {{--<!-- End Hero Area -->
        <section class="container d-md-none py-2" >
            <div class="d-flex justify-content-between">
                <a href="{{route('all_course')}}" class="theme-btn">{{__t('Courses')}}</a>
                <a href="{{route('result')}}" class="theme-btn">{{__t('Result')}}</a>
            </div>
        </section>--}}

<!-- Gallery Area -->
    <section class="gallery-area section-padding" id="gallary">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="section-head">
                        <h3 class="section-head-title">
                            {{__t('Video Gallery')}} <span class="title-line style-3"></span>
                        </h3>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="gallery-slider">

                        @forelse($youtube_videos as $video )
                            <div class="single-gallery">
                                <iframe width="100%" height="315"
                                        src="https://www.youtube.com/embed/{{ $video->video_id }}"
                                        frameborder="0"
                                        allowfullscreen>
                                </iframe>
                            </div>
                        @empty
                            <div class="single-gallery">
                                 <div>Not Found</div>
                            </div>

                        @endforelse



                    </div>
                </div>
            </div>
            {{--            <div class="row">--}}
            {{--                <div class="col-12">--}}
            {{--                    <div class="section-bottom-btn">--}}
            {{--                        <a href="" class="theme-btn secondary">{{__t('see more')}}<i class="fi-rr-arrow-right"></i></a>--}}
            {{--                    </div>--}}
            {{--                </div>--}}
            {{--            </div>--}}
        </div>
    </section>
    <!-- End Gallery Area -->

    <section class="students-area section-padding">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="section-head">
                        <h3 class="section-head-title">
                            {{__t('Our Courses')}} <span class="title-line style-2"></span>
                        </h3>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="students-slider">
                        @forelse(\App\Models\Subject::take(8)->get() as $course)
                            <div class="">
                                <div class="card shadow">
                                    <div class="card-image">
                                        <img src="{{$course->photo}}" alt="">
                                    </div>
                                    <div class="card-body">
                                        <div class="card-title">
                                            {{$course->name??''}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div>Not Found</div>
                        @endforelse

                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-2 py-2">
                <a href="{{route('all_course')}}" class="theme-btn">All Course</a>
            </div>
        </div>
    </section>


    <!-- Page Main Area -->
    <section class="home-page-main-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-12">
                    <div class="" x-data="{about:false}">
                        <h3 class="about-cont-title">{{__t('About Us')}}</h3>
                        <span class="title-seperetor"></span>
                        <p>
                        @if(App::getLocale()==='bn')
                            <div x-show="about==false">
                                <p   >{!! \Illuminate\Support\Str::limit(\App\Models\ConfigDictionary::get('bn_main_about_us','Coming Soon'), 500 , '...') !!}</p>
                            </div>

                            <div x-show="about==true">
                                {!!    \App\Models\ConfigDictionary::get('bn_main_about_us','Coming Soon') !!}
                            </div>
                        @elseif(App::getLocale()==='ar')
                            <div x-show="about==false">
                                <p   >{!! \Illuminate\Support\Str::limit(\App\Models\ConfigDictionary::get('ar_main_about_us','Coming Soon'), 500 , '...') !!}</p>
                            </div>

                            <div x-show="about==true">
                                {!!    \App\Models\ConfigDictionary::get('ar_main_about_us','Coming Soon') !!}
                            </div>
                        @else
                            <div x-show="about==false">
                                <p   >{!! \Illuminate\Support\Str::limit(\App\Models\ConfigDictionary::get('main_about_us','Coming Soon'), 500 , '...') !!}</p>
                            </div>

                            <div x-show="about==true">
                                {!!    \App\Models\ConfigDictionary::get('main_about_us','Coming Soon') !!}
                            </div>
                        @endif

                        <div class="corner-message-btn">
                            <button x-on:click="about =! about" class="theme-btn secondary">{{__t('see more')}}<i class="fi-rr-arrow-right"></i></button>
                        </div>
                    </div>
{{--                    <a href="{{route('center-request.create')}}" class="theme-btn secondary mt-2">Branch Registration</a>--}}
                </div>

                <div class="col-lg-4 col-12">
                    <div class="home-page-main-right">
                        <!-- Single Sidebar Widget -->
                        <div class="home-sidebar-widget notice-board">
                            <img src="{{asset('images/about.jpg')}}" alt="">
                        </div>
                    </div>
                </div>
            </div>





            <!-- Teachers Area -->
        </div>
    </section>
    <!-- End Page Main Area -->
    <!-- Total School Area -->
    <section class="total-students-area section-padding">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="section-head">
                        <h3 class="section-head-title">
                            {{__t('Counter')}}<span class="title-line"></span>
                        </h3>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="total-students-group" id="section_counter">

                        <!-- Single Total Student -->
               {{--         <div class="total-students-card">
                            <h3  class="total-students-number counter">216</h3>
                            <p class="total-students-text">{{__t('Total Institute')}}</p>

                        </div>--}}
                        <div class="total-students-card">
                            <h3  class="total-students-number counter">232</h3>
                            <p class="total-students-text">{{__t('Total Course')}}</p>

                        </div>
                        <div class="total-students-card">
                            <h3  class="total-students-number counter">198</h3>
                            <p class="total-students-text">{{__t('Total Exam')}}</p>

                        </div>
                        <div class="total-students-card">
                            <h3  class="total-students-number counter">32,974</h3>
                            <p class="total-students-text">{{__t('Total Students')}}</p>

                        </div>
                        <div class="total-students-card">
                            <h3  class="total-students-number counter">206</h3>
                            <p class="total-students-text">{{__t('Total Session')}}</p>

                        </div>


                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- End School Committe Area -->



{{--
    <!-- School Committe Area -->
    <section class="school-committe-area section-padding">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="section-head">
                        <h3 class="section-head-title">
                            {{__t('Institute')}}<span class="title-line"></span>
                        </h3>
                    </div>
                </div>
            </div>
            <div class="row  justify-content-center school-committe-group">
                @forelse(\App\Models\Center::where('status',\App\Enums\CenterStatus::Approved)->take(10)->get() as $institute)
                    <div class="col-lg-4 col-xl-3 col-md-6 col-12">
                        <x-institute :institute="$institute"/>
                    </div>
                @empty
                    <div>{{__t('Not Found')}}</div>
                @endforelse

            </div>
            <div class="row">
                <div class="col-12">
                    <div class="section-bottom-btn">
                        <a href="{{route('verifiedInstitute')}}" class="theme-btn secondary">{{__t('See More')}}<i
                                class="fi-rr-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- End School Committe Area -->
--}}



    <!-- Students Area -->
    <section class="students-area section-padding">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="section-head">
                        <h3 class="section-head-title">
                           {{__t('Success Students')}} <span class="title-line style-2"></span>
                        </h3>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="students-slider">
                        @forelse(\App\Models\Student::where('status',\App\Enums\StudentStatus::Approved)->take(30)->get() as $student)
                            <x-student :student="$student"/>
                        @empty
                            <div>Not Found</div>
                        @endforelse
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="section-bottom-btn">
                        <a href="{{route('successStudent')}}" class="theme-btn secondary">{{__t('See More')}}<i
                                class="fi-rr-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
   <div class="container">
       <div class="corner-message-area">
           <div class="row">
               <div class="col-12">
                   <div class="section-head">
                       <h3 class="section-head-title">
                           {{__t('Our Team')}}<span class="title-line style-4"></span>
                       </h3>
                   </div>
               </div>
           </div>


           <div class=" py-5">
               <div>
                   <div class="row   ">
                       <div class="col-12">
                           <div class="corner-message-slider">
                               @forelse($teams as $team)
                                   <div class="single-corner-message">
                                       <div class="corner-message-top">
                                           <div class="corner-message-img">
                                               <img
                                                   src="{{$team->image??''}}"
                                                   alt="#"/>

                                           </div>
                                           <div class="corner-message-info">
                                               <img
                                                   src="{{asset('frontend/svg/img/team.png')}}"
                                                   alt="#"/>
                                               <h4 class="corner-message-info-title">
                                                   {{ translateField($team,'designation')}}
                                               </h4>
                                               <span class="c-message-title-seperetor"></span>
                                               <p class="corner-message-info-name">
                                                   {{ translateField($team,'name')}}
                                               </p>
                                           </div>
                                       </div>
                                       <div   x-data="{description:false}" >
                                           <div x-show="description==false">
                                               <p   >
                                                   {!! \Illuminate\Support\Str::limit(translateField($team,'description'), 500 , '...') !!}

                                               </p>
                                           </div>
                                           <div x-show="description==true">
                                               <p   >
                                                   {!! translateField($team,'description') !!}

                                               </p>
                                           </div>
                                           <div class="corner-message-btn">
                                               <button x-on:click="description =! description" class="theme-btn secondary">{{__t('see more')}}<i class="fi-rr-arrow-right"></i></button>
                                           </div>
                                       </div>
                                   </div>
                               @empty
                                     <div>
                                         Not Found
                                     </div>
                               @endforelse
                           </div>
                       </div>
                   </div>
               </div>
           </div>

       </div>
   </div>


    <script>
        let section_counter = document.querySelector('#section_counter');
        let counters = document.querySelectorAll('.counter');

        // Scroll Animation

        let CounterObserver = new IntersectionObserver(
            (entries, observer) => {
                let [entry] = entries;
                if (!entry.isIntersecting) return;

                let speed = 20;
                counters.forEach((counter, index) => {


                    function UpdateCounter() {
                        const targetNumber = +counter.dataset.target;
                        const initialNumber = +counter.innerText;
                        const incPerCount = targetNumber / speed;
                        if (initialNumber < targetNumber) {
                            counter.innerText = Math.ceil(initialNumber + incPerCount);
                            setTimeout(UpdateCounter, 50);
                        }
                    }

                    UpdateCounter();

                    if (counter.parentElement.style.animation) {
                        counter.parentElement.style.animation = '';
                    } else {
                        counter.parentElement.style.animation = `slide-up 0.3s ease forwards ${
                            index / counters.length + 0.5
                        }s`;
                    }

                });
                observer.unobserve(section_counter);
            },
            {
                root: null,
                threshold: window.innerWidth > 768 ? 0.4 : 0.3,
            }
        );

        CounterObserver.observe(section_counter);
    </script>
</x-frontend-layouts>
