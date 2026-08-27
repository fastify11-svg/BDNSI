@props(['student'])


<div class="students-card">
    <div class="students-card-img">

        <img src="{{$student->picture??''}}" alt="Student" />
    </div>
    <div class="students-card-info">
        <h4><a class="text-white" href="{{route('successStudentDetails',$student->id)}}"> {{$student->name??''}}</a></h4>

    </div>
</div>

