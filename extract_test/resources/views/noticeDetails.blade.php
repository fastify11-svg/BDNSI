<x-frontend-layouts>


    <div class="container py-4">
        <!-- Header -->
        <div class="text-center mb-4">
            <h1>{{__t('Notice Details')}}</h1>
        </div>

        <div class="card shadow-lg mb-4">
            <img
                src=" {{$data->image}}"
                alt="News Image"
                class="card-img-top">
            <div class="card-body">

                <p class="text-muted mb-2">
                    {{__t('Published on')}} <strong>{{$data->created_at->diffForHumans()}}</strong>
                </p>
                <hr>
                <p class="">

                {{translateField($data,'details')}}
                </p>

            </div>
        </div>
    </div>




</x-frontend-layouts>
