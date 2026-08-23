@props(['student'])
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="viewport" content="width=1024">
    <link rel="stylesheet" href="{{asset('css/bootstrap.css')}}">
    <script src="{{asset('js/pdf.js')}}"></script>
    <script src="{{mix('js/app.js')}}"></script>
    <x-calculate-gpa-script />
    <title>Transcript  </title>
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
        }

        img {
            width: 100%;
        }

        .admit-card-wrap {
            width: 1170px;
            height: 1650px;
            background-image: url({{asset('images/student/transacpt.png')}});
            margin: auto;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            padding: 90px 130px;
            position: relative;
        }

        .info-btn {
            background: red;
            color: white !important;
            padding: 1px 26px;
            font-size: 28px;
            border-radius: 21px  ;
            border-color: red;
        }

        .admit-card-body {
            padding-top: 35px;
        }

        .data-item-wrap {
            display: flex;
            gap: 12px;
            justify-content: space-between;
            align-items: center;
            font-size: 22px;
            margin-bottom: 20px;
        }

        .data-item-wrap div:last-child {
            width: 68%;
        }

        .data-item-wrap div:first-child {
            width: 27%;
            line-height: 28px;
            font-size: 18px;
        }

        .admit-card-footer {
            position: absolute;
            width: 100%;
            bottom: 273px;
            left: 0;
            top: 63%;
            padding: 20px 130px;
        }

        .footer-sign-wrap {
            display: flex;
            justify-content: space-around;
            align-items: end;
            gap: 20px;
            margin-bottom: 40px;
        }

        .sign-cont hr {
            margin: 0;
            height: 3px;
            background: black;
            opacity: .7;
        }

        .sign-cont p {
            /* font-size: 18px; */
            font-weight: 600;
        }

        .sign-cont {
            flex: 1 1 33%;
        }

        .qr {
            width: 150px;
            height: 150px;
        }

        .w-18 {
            width: 18% !important;
        }

        .w-82 {
            width: 82% !important;
        }

        .print_btn {
            margin-top: 10px;
            text-align: center;
        }

        @media print {
            .print_btn {
                display: none;
            }
        }

        .data-item-wrap div:nth-child(2) {
            width: 5%;
            text-align: center;
        }
        .bold{
             font-weight: 900;

        }
        .border{
            border-color: black!important;
        }


        .button {
            background:  #73731d; /* Gradient background */
            color: white;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 9px; /* Fully rounded corners */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow */
            border: none;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            transition: all 0.3s ease; /* Smooth hover effects */
        }

        .button:hover {
            background: #73731d; /* Darker gradient on hover */
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2); /* Increase shadow on hover */
        }

        .button:active {
            background: #73731d; /* Darker gradient when active */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Slightly pressed shadow */
        }

        .grading-table th,
        .grading-table td {
            padding: 2px;

            text-align: center;
        }


        .result-table-container {
            width: 100%;
            max-width: 800px;
            margin: 20px auto;
            font-family: Arial, sans-serif;
            color: #333;
            text-align: center;
        }

        .result-table {
            width: 100%;
            border-collapse: collapse;
            /* Removed box shadow */
        }

        .result-table th,
        .result-table td {
            padding: 2px;
            border: 1px solid black; /* Changed border color to black */
            text-align: center;
        }

        .result-table thead th {
            /*background-color: #f0f0f0;*/
            font-weight: bold;
            border-bottom: 2px solid black; /* Changed border color to black */
        }

        .result-table tbody tr:nth-child(odd) {
            /*background-color: #f9f9f9; !* Optional for alternating row colors *!*/
        }

        .result-table tfoot td {
            font-weight: bold;
            /*background-color: #f0f0f0;*/
        }

        .pass {
            color: green;
            font-weight: bold;
        }

        .textDeg{
            text-transform: capitalize!important;
        }

        /* 8-Semester Diploma Layout CSS */
        .diploma-grid-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 10px;
            padding: 0 40px; /* To fit within admit-card-wrap padding */
        }
        .semester-card {
            border: 1px solid #333;
            border-radius: 4px;
            overflow: hidden;
            background-color: #fff;
        }
        .semester-title {
            background-color: #f1f5f9;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            padding: 4px;
            border-bottom: 1px solid #333;
        }
        .semester-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }
        .semester-table th, .semester-table td {
            border: 1px solid #ccc;
            padding: 4px;
            text-align: center;
        }
        .semester-table th {
            background-color: #fafafa;
            font-weight: bold;
        }
        .semester-table td.subj-name {
            text-align: left;
        }

        .diploma-header-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            padding: 10px 40px;
            margin-top: -20px; /* adjust from default admit-card spacing */
            font-size: 14px;
            font-weight: bold;
            background-color: #e2e8f0; /* subtle background like the reference */
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #cbd5e1;
        }
        .diploma-header-info div {
            display: flex;
        }
        .diploma-header-info span.label {
            width: 180px;
            color: #334155;
        }
        .diploma-header-info span.value {
            color: #0f172a;
        }
        .diploma-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 30px;
            padding: 0 50px;
            position: absolute;
            bottom: 100px;
            width: 100%;
        }
        .diploma-sign-box {
            text-align: center;
            font-weight: bold;
            font-size: 14px;
        }
        .diploma-sign-box hr {
            border-top: 2px solid #000;
            width: 200px;
            margin-bottom: 5px;
        }    </style>
</head>

<body>
<div class="print_btn">
    <button type="button" class="btn btn-primary px-5 mx-4" onclick="window.print()">Print</button>
    <button onclick="generate_pdf()" class="btn btn-secondary">Download</button>
    <a type="button" class="btn btn-warning px-5 mx-4" href="">Back</a>
</div>
<?php $result = $student->result ?? null; ?>
<div class="admit-card-wrap" id="html2pdf" x-data="{ w: {{ optional($result)->written ?? 0 }}, p: {{ optional($result)->practical ?? 0 }}, v: {{ optional($result)->viva ?? 0 }} }">
    <div class="admit-card-header">
        <div class="d-flex align-items-center ">
            <div class="w-18 text-center ">
                <img src="{{asset('images/student/logo.png')}}" style="width: 140px;margin-top: -4px;" alt="logo" />
            </div>
            <div class="cert-headings w-82" style="margin-top:10px">
                <img src="{{asset('images/student/banner.png')}}" class="w-100" alt="">
                <h5 class="normal-font" style="margin-left: 38px; margin-top: 10px"> Approved By Government of the People's Republic of Bangladesh.</h5>
            </div>
        </div>
    </div>

    @if (isset($student->course_type) && $student->course_type->value == 2)
        {{-- Diploma 8-Semester Layout --}}
        <div class="diploma-header-info mx-5">
            <div><span class="label">Student Name:</span> <span class="value">{{$student->name??'N/A'}}</span></div>
            <div><span class="label">Roll No:</span> <span class="value">{{$student->roll??'N/A'}}</span></div>
            
            <div><span class="label">Campus:</span> <span class="value">{{$student->center->name??'N/A'}}</span></div>
            <div><span class="label">Registration No:</span> <span class="value">{{$student->registration??'N/A'}}</span></div>
            
            <div><span class="label">Degree Program:</span> <span class="value">{{$student->subject->name??'N/A'}}</span></div>
            <div><span class="label">Course Type:</span> <span class="value">Diploma</span></div>
            
            <div><span class="label">Examination:</span> <span class="value">Final Degree Assessment</span></div>
            <div><span class="label">Course Duration:</span> <span class="value">{{$student->course_duration??'4 Years (Eight Semesters)'}}</span></div>
        </div>

        <div class="diploma-grid-container mx-4">
            @php
                $semesterNames = ['First Semester', 'Second Semester', 'Third Semester', 'Fourth Semester', 'Fifth Semester', 'Sixth Semester', 'Seventh Semester', 'Eighth Semester'];
                $semesters = isset($student->semesterResults) ? $student->semesterResults : collect();
            @endphp
            
            @foreach($semesterNames as $index => $semName)
                @php
                    // Try to find the semester data, or use a dummy for preview
                    $semData = $semesters->where('semester_name', $semName)->first();
                    $subjects = $semData ? ($semData->subjects_data ?? []) : [];
                @endphp
                <div class="semester-card">
                    <div class="semester-title">{{$semName}}</div>
                    <table class="semester-table">
                        <thead>
                            <tr>
                                <th>Code No.</th>
                                <th>Subject</th>
                                <th>Cr. Hrs</th>
                                <th>GPA</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($subjects as $subj)
                            <tr>
                                <td>{{$subj['code'] ?? 'N/A'}}</td>
                                <td class="subj-name">{{$subj['subject'] ?? 'N/A'}}</td>
                                <td>{{$subj['credit'] ?? '0'}}</td>
                                <td>{{$subj['gpa'] ?? '0.00'}}</td>
                                <td>{{$subj['grade'] ?? 'F'}}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endforeach
        </div>

        <div class="diploma-footer">
            <div class="diploma-sign-box">
                <hr />
                Prepared by
            </div>
            <div class="diploma-sign-box">
                <img src="{{asset('images/student/Exam-Controller2.png')}}" style="height: 60px; margin-bottom: -15px;" alt="Signature" />
                <hr />
                Checked by
            </div>
        </div>

    @else
        {{-- Existing Layout --}}
    <div style="position: relative;">
        <div style="position: absolute;   left:70%;margin-top:2%;">
            <div class=" text-center pe-2 " >
                <div class="grading-system-container">
                    <strong class="grading-title">Grading System</strong>
                    <table class="grading-table">
                        <thead>
                        <tr>
                            <th>Range of Mark</th>
                            <th>Grade</th>
                            <th>Point</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>80 or above</td>
                            <td>A+</td>
                            <td>4.00</td>
                        </tr>
                        <tr>
                            <td>75 - below 80</td>
                            <td>A</td>
                            <td>3.75</td>
                        </tr>
                        <tr>
                            <td>70 - below 75</td>
                            <td>A-</td>
                            <td>3.50</td>
                        </tr>
                        <tr>
                            <td>65 - below 70</td>
                            <td>B+</td>
                            <td>3.25</td>
                        </tr>
                        <tr>
                            <td>60 - below 65</td>
                            <td>B</td>
                            <td>3.00</td>
                        </tr>
                        <tr>
                            <td>55 - below 60</td>
                            <td>B-</td>
                            <td>2.75</td>
                        </tr>
                        <tr>
                            <td>50 - below 55</td>
                            <td>C+</td>
                            <td>2.50</td>
                        </tr>
                        <tr>
                            <td>45 - below 50</td>
                            <td>C</td>
                            <td>2.25</td>
                        </tr>
                        <tr>
                            <td>40 - below 45</td>
                            <td>D+</td>
                            <td>2.00</td>
                        </tr>
                        <tr>
                            <td>35 - below 40</td>
                            <td>D</td>
                            <td>1.75</td>
                        </tr>
                        <tr>
                            <td>00 - below 32</td>
                            <td>F</td>
                            <td>0.00</td>
                        </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    </div>
    <div class="text-center">
        <button class="button">Academic Transcript</button>
    </div>
    <div class="d-flex justify-content-between px-2">
        <div class="">
            <p>Serial No. : {{\App\Lib\Helper::serialNumber($student->id)}}</p>
        </div>
    </div>


    <div class="admit-card-body textDeg"    >
{{--        <h3 class="me-5 text-center fw-bold mb-4">{{$student->subject->name??'N/A'}}</h3>--}}
        <div class="cert-info fw-bold text-dark w-100 d-flex flex-row justify-content-center mt-2 ps-3 gap-2">
            <div class="w-100" >
                <div class="data-item-wrap">
                    <div class="data-label">Name</div>
                    <div>:</div>
                    <div class="data-value"> {{$student->name??'N/A'}}
                    </div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Father's Name </div>
                    <div>:</div>
                    <div class="data-value"> {{$student->fathers_name??'N/A'}}
                    </div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Mother's Name </div>
                    <div>:</div>
                    <div class="data-value">  {{$student->mothers_name??'N/A'}}
                    </div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Roll </div>
                    <div>:</div>
                    <div class="data-value"> {{$student->roll??''}}</div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Reg Number </div>
                    <div>:</div>
                    <div class="data-value"> {{$student->registration??''}}</div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Course Name </div>
                    <div>:</div>
                    <div class="data-value   line-clamp-1"  > {{$student->subject->name??''}}</div>
                </div>

                <div class="data-item-wrap">
                    <div class="data-label">Course Duration </div>
                    <div>:</div>
                    <div class="data-value">
                        {{$student->course_duration??'N/A'}}
                    </div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Session </div>
                    <div>:</div>
                    <div class="data-value">
                        {{$student->session->name??'N/A'}}
                    </div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Grade Point </div>
                    <div>:</div>
                    <div class="data-value  "    >
                        {{number_format($student->t_written_gpa(),2)}} (In the Scale Of 4.00)
                    </div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Letter Grade </div>
                    <div>:</div>
                    <div class="data-value"  >
                        {{$student->t_written()}}
                    </div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Center Name </div>
                    <div>:</div>
                    <div class="data-value">
                          {{$student->center->name??''}}
                    </div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Center Code </div>
                    <div>:</div>
                    <div class="data-value">
                          {{$student->center->code??''}}
                    </div>
                </div>


            </div>
        </div>

    </div>




    <div class="admit-card-footer">


    <div class="">
        <div class=" ">
            <table class="result-table">
                <thead>
                <tr>
                    <th>Name of Subjects</th>
                    <th>Credit</th>
                    <th>Letter Grade</th>
                    <th>Grade Point</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Written</td>
                    <td>4</td>
                    <td>{{$student->t_written()}}</td>
                    <td>{{$student->t_written_gpa()}}</td>
                </tr>
                <tr>
                    <td>Practical</td>
                    <td>4</td>
                    <td>{{$student->t_practical()}}</td>
                    <td>{{$student->t_practical_gpa()}}</td>
                </tr>
                <tr>
                    <td>Viva</td>
                    <td>4</td>
                    <td>{{$student->t_viva()}}</td>
                    <td>{{$student->t_viva_gpa()}}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="2">GPA:</td>
                    <td colspan="2">4.00</td>
                </tr>
                <tr>
                    <td colspan="2">CGPA:</td>
                    <td colspan="2">{{number_format($student->t_written_gpa(),2)}}</td>
                </tr>
                <tr>
                    <td colspan="2">Result:</td>
                    <td colspan="2" class="pass"> {{$student->t_written_gpa()  > 0 ? 'PASS' : 'Fail'}}</td>
                </tr>
                </tfoot>
            </table>
        </div>

    </div>


            <div class="footer-sign-wrap mt-4"  >
                <div class="sign-cont text-center">
{{--                                    <hr />--}}
{{--                                    <p>Signature of the <br /> Student</p>--}}
                </div>
                <div class="sign-cont text-center">
{{--                                    <hr />--}}
{{--                                    <p>Signature Of The Regional <br /> Director</p>--}}
                </div>
                <div class="sign-cont text-center"  >
                    <img class="text-center" style="width: 200px" src="{{asset('images/student/Exam-Controller2.png')}}" alt="signature" />
                    <hr />
                    <p>Exam Controller <br /> Nhmi</p>
                </div>
            </div>
        </div>


        <div class="fw-semibold">
            <p></p>

        </div>

    </div>
    @endif
</div>
<script type="text/javascript">
    function generate_pdf() {
        var opt = {
            margin: 0,
            filename: "{{ $student->name . '_' . $student->roll }}.pdf",
            image: {
                type: 'jpeg',
                quality: 0.99
            },
            html2canvas: {
                scale: 1,
                width: 1200,
                height: 1660
            },
            jsPDF: {
                unit: 'in',
                format: 'A3',
                orientation: 'portrait'
            }
        };
        // html2pdf().from(document.getElementById('fullpage2')).set(opt).save();
        html2pdf().from(document.getElementById('html2pdf')).set(opt).save().then(function() {
            document.getElementById('fullpage2').classList.add('hidePDFdata');
        });
    }
</script>




</body>

</html>


{{--<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.tailwindcss.com"></script>

</head>
<body>
<style>
    .bg-image {
        background: url({{asset('images/student/transacpt1.jpg')}});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .serial-no {position: absolute; top: 20.5%;left: 41%;}
    .student-name {position: absolute;top: 24%;left: 31%;}
    .father-name {position: absolute;top: 26.2%;left: 31%;}
    .mother-name {position: absolute;top: 27%;left: 31%;}
    .roll-no {position: absolute; top: 29%; left: 31%;}
    .reg-no {position: absolute; top: 30%; left: 31%;}
    .institute-name {position: absolute; top: 31%; left: 31%;}
    .technology {position: absolute; top: 32%; left: 31%;}
    .course-duration {position: absolute; top: 33%; left: 31%;}
    .session {position: absolute; top: 34%; left: 31%;}
    .grade-point {position: absolute; top: 35%; left: 31%;}
    .letter-grade {position: absolute; top: 37%; left: 31%;}


    .written-label { position: absolute; top: 47%; left: 20%; }
    .written-grade { position: absolute; top: 34%; left: 40%; }
    .written-point { position: absolute; top: 36%; left: 50%; }

    .practical-label { position: absolute; top: 85%; left: 20%; }
    .practical-grade { position: absolute; top: 85%; left: 40%; }
    .practical-point { position: absolute; top: 85%; left: 50%; }

    .viva-label { position: absolute; top: 90%; left: 20%; }
    .viva-grade { position: absolute; top: 90%; left: 40%; }
    .viva-point { position: absolute; top: 90%; left: 50%; }

    .gpa-label { position: absolute; top: 95%; left: 20%; }
    .gpa-value { position: absolute; top: 95%; left: 30%; }

    .cgpa-label { position: absolute; top: 100%; left: 20%; }
    .cgpa-value { position: absolute; top: 100%; left: 30%; }

    .result-label { position: absolute; top: 105%; left: 20%; }





    @media screen and (min-width: 768px) {
        .serial-no {position: absolute; top: 20.5%;left: 41%;}
        .student-name {position: absolute;top: 24%;left: 44%;}
        .father-name {position: absolute;top: 25.8%;left: 44%;}
        .mother-name {position: absolute;top: 28%;left: 44%;}
        .roll-no {position: absolute;top: 29%;left: 44%;}
        .reg-no {position: absolute;top: 29%;left: 44%;}
        .institute-name {position: absolute;top: 30%;left: 44%;}
        .technology {position: absolute;top: 31%;left: 44%;}
        .course-duration {position: absolute;top: 32%;left: 44%;}
        .session {position: absolute;top: 33%;left: 44%;}
        .grade-point {position: absolute;top: 34%;left: 44%;}
        .letter-grade {position: absolute;top: 36%;left: 44%;}



        .written-label { position: absolute; top: 47%; left: 20%; }
        .written-grade { position: absolute; top: 34%; left: 40%; }
        .written-point { position: absolute; top: 36%; left: 50%; }

        .practical-label { position: absolute; top: 85%; left: 20%; }
        .practical-grade { position: absolute; top: 85%; left: 40%; }
        .practical-point { position: absolute; top: 85%; left: 50%; }

        .viva-label { position: absolute; top: 90%; left: 20%; }
        .viva-grade { position: absolute; top: 90%; left: 40%; }
        .viva-point { position: absolute; top: 90%; left: 50%; }

        .gpa-label { position: absolute; top: 95%; left: 20%; }
        .gpa-value { position: absolute; top: 95%; left: 30%; }

        .cgpa-label { position: absolute; top: 100%; left: 20%; }
        .cgpa-value { position: absolute; top: 100%; left: 30%; }

        .result-label { position: absolute; top: 105%; left: 20%; }



    }


</style>
<div class="bg-image w-full h-screen relative font-bold text-[8px]">

    <p class="serial-no">Serial No</p>
    <p class="student-name">Student Name</p>
    <p class="father-name">Father's Name</p>
    <p class="mother-name">Mother's Name</p>
    <p class="roll-no">Roll No</p>
    <p class="reg-no">Reg No</p>
    <p class="institute-name">Institute Name</p>
    <p class="technology">Technology</p>
    <p class="course-duration">Course Duration</p>
    <p class="session">Session</p>
    <p class="grade-point">Grade Point</p>
    <p class="letter-grade">Letter Grade</p>

    <p class="written-label">Written</p>
    <p class="written-grade">A+</p>
    <p class="written-point">5.00</p>

    <p class="practical-label">Practical</p>
    <p class="practical-grade">B++</p>
    <p class="practical-point">50</p>

    <p class="viva-label">Viva</p>
    <p class="viva-grade">A+</p>
    <p class="viva-point">50</p>

    <p class="gpa-label">GPA</p>
    <p class="gpa-value">4.50</p>

    <p class="cgpa-label">CGPA</p>
    <p class="cgpa-value">3.25</p>

    <p class="result-label">Result</p>


</div>

</body>
</html>--}}



