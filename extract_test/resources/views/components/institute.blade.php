@props(['institute'])

<div class="school-commite-card text-white"  >
    <div class="school-commite-card-img">

        <img src="{{$institute->director_image??''}}" alt=" Image" />
    </div>
    <div class="school-commite-card-info">
        <h4 class="s-commite-member-name "><a class="text-white" href="{{route('institute.details',$institute->id)}}">{{\Illuminate\Support\Str::limit($institute->name,20,$end='...')}}</a></h4>



    </div>
</div>




