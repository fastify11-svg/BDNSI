<x-frontend-layouts>
    <style>
        .search-bar {
            border: 2px solid #7024A8; /* Green border */
            border-radius: 50px; /* Rounded edges */
            padding: 5px 15px; /* Padding for better spacing */
            display: flex;
            align-items: center;
            background-color: #fff; /* White background */
        }
        .search-bar input {
            border: none; /* Remove input border */
            outline: none; /* Remove input focus border */
            box-shadow: none; /* Remove input shadow */
            width: 100%; /* Full width */
            margin-left: 10px; /* Space between icon and input */
        }
        .serc button {
            background-color: #7024A8; /* Green background */
            color: #fff; /* White text */
            border: none; /* Remove button border */
            border-radius: 50px; /* Rounded edges */
            padding: 5px 15px; /* Adjust button size */
            transition: background-color 0.3s ease;
        }
        .serc button:hover {
            background-color: #7024A8; /* Darker green on hover */
        }
    </style>

    <section id="courses">
        <div class=" container p-3">
            <div>
                <form action="{{ route('all_course') }}" method="get">
                    <div class="card-body">
                  <div class="d-flex serc " style="gap: 3px">
                      <div class="search-bar shadow w-100">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#28a745" viewBox="0 0 16 16">
                              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85a1.007 1.007 0 0 0-.115-.098zm-5.442.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                          </svg>
                          <input type="text" style="background: transparent" name="course_name" placeholder="Search" class="form-control">
                      </div>
                      <button class="btn">{{__t('Search')}}</button>
                  </div>

                    </div>
                </form>
            </div>
        </div>

        <div class="container courses-list">
            <div class="row">
                @forelse($courses as $course)
                    <div class="col-lg-3 flip-box p-2 ">
                        <x-course :subject="$course" />
                    </div>
                @empty
                    <div class="font-bold text-red-500">
                        {{__t('Not Found')}}
                    </div>
                @endforelse

            </div>
            <div class="py-3 d-flex justify-content-end">
                {{$courses->links()}}
            </div>
        </div>
    </section>








</x-frontend-layouts>
