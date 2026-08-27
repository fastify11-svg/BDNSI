<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    <script src="{{ asset('js/pdf.js') }}"></script>
    <script src="{{ mix('js/app.js') }}"></script>

    <style>



        [x-cloak] {
            display: none !important;
        }

        @font-face {
            font-family: 'Monotype Corsiva';
            src: url('{{ asset('frontend/fonts/Monotype Corsiva/Monotype-Corsiva-Regular-Italic.ttf') }}') format('truetype');
        }

        body {
            font-family: 'Monotype Corsiva';
            font-weight: normal!important;
        }

        @media print {
            .no-print, .no-print * {
                display: none !important;
            }

            body {
                -webkit-print-color-adjust: exact;
            }
        }

        @page {
            size: A4 landscape;
            margin: 0;
        }

        .card-body {
            /*width: 1100px;*/
            height: 151vh;
            display: flex;
            justify-content: center;
        }

        .back-img {
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center center;
            font-size: 22px;
        }

        .student-id,
        .student-registration,
        .student-session,
        .student-name,
        .fathers-name,
        .mothers-name,
        .center-name,
        .student-roll,
        .student-subject,
        .center-code,
        .exam-date,
        .student-gpa,
        .student-result-published {
            font-weight: normal !important;
            font-size: 27px!important;

        }


        /* Absolute positioning of child elements */
        .absolute {
            position: absolute;
        }

        .student-id { top: 39%; left: 33%; }
        .student-registration { top: 38.4%; left: 81.2%; }
        .student-session { top: 42.2%; left: 81%;font-size: 18px }
        .student-name { top: 46.2%; left: 44.5%; }
        .fathers-name { top: 50.7%; left: 43.5%; text-transform: capitalize  ; }
        .mothers-name { top: 55%; left: 41.5%; text-transform: capitalize  ; }
        .center-name { top: 59.3%; left: 40%; }
        .student-roll { top: 64%; left: 38.5%; }
        .student-subject { top: 63.7%; left: 57.5%; }
        .center-code { top: 66%; left: 87%; }
        .exam-date { top: 68.2%; left: 48%; font-size: 24px!important;}
        .student-gpa { top: 68.5%; left: 75%; }
        .student-result-published { top: 85%; left: 24%; }
        .qr { top: 57%; left: 13.3%; }

        @media screen and (min-width: 740px) {
            .student-id { top: 37.8%; left: 33%; }
            .student-registration { top: 37.2%; left: 81.5%; }
            .student-session { top: 40.5%; left: 80.5%; font-size: 18px; }
            .student-name { top: 45.7%; left: 44.5%; }
            .fathers-name { top: 50.5%; left: 43.5%; text-transform: capitalize !important; }
            .mothers-name { top: 54.5%; left: 41.5%; text-transform: capitalize; }
            .center-name { top: 58.8%; left: 40%; }
            .student-roll { top: 63.5%; left: 38.5%; }
            .student-subject { top: 63.2%; left: 57.5%; }
            .center-code { top: 66.5%; left: 87%; }
            .exam-date { top: 68.3%; left: 48%; font-size: 24px!important; }
            .student-gpa { top: 68.3%; left: 75%; }
            .student-result-published { top: 85.3%; left: 24%; }
            .qr { top: 57%; left: 13.3%; }


        }
        .no-background {
            background-image: none !important;
        }
        /* If you need custom capitalization */
        .text {
            text-transform: capitalize !important;
        }

    </style>
</head>
<body>
<div  >
    <div class="w-full flex justify-end gap-1 print:hidden py-5 px-1 print:py-0">
        <button onclick="generate_pdf()" class="px-3 py-1 rounded-md bg-green-700 text-slate-100">Download</button>
    </div>
    <div class="card-body min-h-screen"   id="fullpage2" >
        <div    class="back-img" style="background-image:url({{ asset('images/student/C-PDF.webp') }}); position: relative; font-weight: bold;">
            <div >
                <div class="absolute student-id" style="  font-size:18px">
                    {{ \App\Lib\Helper::certificateSerialNumber($student->id) ?? '' }}
                </div>
                <div class="absolute student-registration">{{ $student->registration ?? '' }}</div>
                <div class="absolute student-session text"  >{{ $student->session->name ?? '' }}</div>
                <div class="absolute student-name">{{ ucwords(strtolower($student->name)) ?? '' }}</div>
                <div class="absolute fathers-name">{{ ucwords(strtolower($student->fathers_name ?? '')) }}</div>
                <div class="absolute mothers-name">{{ ucwords(strtolower($student->mothers_name ?? '')) }}</div>
                <div class="absolute center-name">{{ ucwords(strtolower($student->center->name ?? '')) }}</div>
                <div class="absolute student-roll">{{ ucwords(strtolower($student->roll ?? '')) }}</div>
                <div class="absolute student-subject">{{  $student->subject->name ?? '' }}</div>
                <div style="width: 100px; height: 100px"  class="absolute qr" id="qrcode_1"></div>

                <div class="absolute exam-date capitalize">
                    {{ \Carbon\Carbon::parse($student->exam_date)->format('j-F-Y') }}
                </div>
                <div class="absolute student-gpa">
                    {{ number_format($student->t_written_gpa(),2) }}
                </div>
                <div class="absolute student-result-published capitalize" >
                    @if($student->result_publised)
                        {{ \Carbon\Carbon::make($student->result_publised)->format('j-F-Y') }}
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    function generate_pdf() {
        const element = document.getElementById('fullpage2');
        const options = {
            margin: 0,
            filename: "{{ $student->name . '_' . $student->roll }}.pdf",
            image: { type: 'jpeg', quality: 0.99 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'A3', orientation: 'landscape' }
        };
        html2pdf().set(options).from(element).save();
    }
</script>

<script type="text/javascript" src="{{ asset('js/qrcode.js') }}"></script>
<script type="text/javascript">
    // Adjusted for high-quality QR code generation
    var qrcode = new QRCode(document.getElementById("qrcode_1"), {
        text: "{{   route('result',['roll'=>$student->roll])     }}",
        width: 500,  // Increased width for high resolution
        height: 500, // Increased height for high resolution
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H, // High error correction for better readability
    });

    // Optional: Scale down the QR code display size with CSS if required
    document.querySelector('#qrcode_1 img').style.width = "100px";
</script>


</body>
</html>

