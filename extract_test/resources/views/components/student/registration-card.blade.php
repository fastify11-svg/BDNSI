@props(['student'])
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="viewport" content="width=1024">
    <link rel="stylesheet" href="{{asset('css/bootstrap.css')}}">
    <script src="{{asset('js/pdf.js')}}"></script>
    <title>Registration Card</title>
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
        }

        img {
            width: 100%;
        }
        .textDeg{
            text-transform: capitalize!important;
        }

        .admit-card-wrap {
            width: 1170px;
            height: 1660px;
            background-image: url({{asset('images/student/registration-card.jpg')}});
            margin: auto;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            padding: 90px 130px;
            position: relative;
        }

        .info-btn {
            border: 3px solid green;
            background: red;
            color: white !important;
            padding: 1px 26px;
            font-size: 28px;
            border-radius: 21px;
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
            bottom: 80px;
            left: 0;
            padding: 31px 130px;
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


        .button {
            background: linear-gradient(to bottom, #b8031e, #ac0b18); /* Gradient background */
            color: white;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 25px; /* Fully rounded corners */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow */
            border: none;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            transition: all 0.3s ease; /* Smooth hover effects */
        }

        .button:hover {
            background: linear-gradient(to bottom, #c10816, #af052c); /* Darker gradient on hover */
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2); /* Increase shadow on hover */
        }

        .button:active {
            background: linear-gradient(to bottom, #ac0b18, #b30835); /* Darker gradient when active */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Slightly pressed shadow */
        }

    </style>
</head>

<body>
<div class="print_btn">
    <button type="button" class="btn btn-primary px-5 mx-4" onclick="window.print()">Print</button>
    <button onclick="generate_pdf()" class="btn btn-secondary">Download</button>
    <a type="button" class="btn btn-warning px-5 mx-4" href="">Back</a>
</div>
<div class="admit-card-wrap" id="html2pdf">
    <div class="admit-card-header">
        <div class="d-flex align-items-center ">
            <div class="w-18 text-center ">
                <img src="{{asset('images/student/logo.png')}}" style="width: 140px;margin-top: -4px;" alt="logo" />
            </div>
            <div class="cert-headings w-82" style="margin-top: 20px">
                <img src="{{asset('images/student/banner.png')}}" class="w-100" alt="">
                <h5 class="normal-font" style="margin-left: 38px;"> Approved By Government of the People's Republic of Bangladesh.</h5>
            </div>
        </div>
    </div>
    <div class="text-center">
        <button class="button">Registration Card</button>
    </div>
    <div class="d-flex justify-content-between px-2">
        <div class="">
            <p>Serial No. : {{\App\Lib\Helper::serialNumber($student->id)}}</p>
        </div>
    </div>
    <div class="admit-card-body textDeg">
        <h3 class="me-5 text-center fw-bold mb-4">{{$student->subject->name??'N/A'}}</h3>
        <div class="cert-info fw-bold text-dark w-100 d-flex flex-row justify-content-center mt-2 ps-3 gap-2">
            <div class="w-75">
                <div class="data-item-wrap">
                    <div class="data-label">Registration Number</div>
                    <div>:</div>
                    <div class="data-value"> {{$student->registration??'N/A'}}
                    </div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Name of Student</div>
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
                    <div class="data-label">Gender </div>
                    <div>:</div>
                    <div class="data-value"> {{\App\Enums\Gender::fromValue(  $student->gender??'N/A')->key}}</div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Center Name </div>
                    <div>:</div>
                    <div class="data-value">
                        {{$student->center->name??'N/A'}}
                    </div>
                </div>

                <!--<div class="data-item-wrap">-->
                <!--    <div class="data-label">Institute District </div>-->
                <!-- <div>:</div> -->
                <!--    <div class="data-value">  Chattogram</div>-->
                <!--</div>-->
                <div class="data-item-wrap">
                    <div class="data-label">Student Thana </div>
                    <div>:</div>
                    <div class="data-value">
                        {{$student->permanent_address??''}}

                    </div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Student District </div>
                    <div>:</div>
                    <div class="data-value">
                        {{$student->present_address??''}}
                    </div>
                </div>

                <div class="data-item-wrap">
                    <div class="data-label">Course Name </div>
                    <div>:</div>
                    <div class="data-value">{{$student->subject->name??'N/A'}}</div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Course Duration </div>
                    <div>:</div>
                    <div class="data-value">{{$student->course_duration??'N/A'}}</div>
                </div>
                <div class="data-item-wrap">
                    <div class="data-label">Session </div>
                    <div>:</div>
                    <div class="data-value"> {{$student->session->name??'N/A'}}</div>
                </div>
            </div>


            <div class="w-25 text-center pe-2">
                <div style="/*margin-top: -175px;*/">
                    <img src="{{$student->picture}}" style="width: 150px; margin-bottom: 55px;" alt="portrait" />
                </div>
                <div>
                    <div class="visible-print  text-center">
                        <x-student.registration-qr :student="$student"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="admit-card-footer">
        <div class="footer-sign-wrap">
            <div class="sign-cont text-center">
                <hr />
                <p>Signature of the <br /> Student</p>
            </div>
            <div class="sign-cont text-center">
                <hr />
                <p>Signature Of The Regional <br /> Director</p>
            </div>
            <div class="sign-cont text-center">
                <img class="text-center" style="width: 200px" src="{{asset('images/student/Exam-Controller2.png')}}" alt="signature" />
                <hr />
                <p>Exam Controller <br /> nhml</p>
            </div>
        </div>

        <div class="fw-semibold">
            <p></p>
            <ol>
                <li>This Registration card is valid till 8 Consecutive years</li>
                <li>For All Correspondence with the nhmi, Institute code, registration number and session are to be mentioned
                </li>
                <li>Scan the QR code and follow the link in the QR code to verify the Registration card from   </li>
            </ol>
        </div>
    </div>
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


