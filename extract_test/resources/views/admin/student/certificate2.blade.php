<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    <script src="{{ asset('js/pdf.js') }}"></script>
    <script src="{{ mix('js/app.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/html2pdf.js"></script>
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
            width: 1100px;
            height: 100vh;
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

        }


        /* Absolute positioning of child elements */
        .absolute {
            position: absolute;
        }

        .student-id { top: 15%; left: 15%; font-size: 16px; font-weight: bold; }
        .student-registration { top: 15%; left: 75%; font-size: 16px; font-weight: bold; }
        .student-session { top: 18%; left: 75%; font-size: 14px; }
        .student-name { top: 35%; left: 45%; font-size: 24px; font-weight: bold; }
        .fathers-name { top: 42%; left: 40%; font-size: 18px; text-transform: capitalize; }
        .mothers-name { top: 47%; left: 40%; font-size: 18px; text-transform: capitalize; }
        .center-name { top: 52%; left: 35%; font-size: 18px; }
        .student-roll { top: 58%; left: 30%; font-size: 16px; }
        .student-subject { top: 58%; left: 55%; font-size: 16px; }
        .center-code { top: 62%; left: 80%; font-size: 14px; }
        .exam-date { top: 65%; left: 45%; font-size: 14px; }
        .student-gpa { top: 65%; left: 70%; font-size: 16px; font-weight: bold; }
        .student-result-published { top: 80%; left: 20%; font-size: 14px; }
        .qr { top: 50%; left: 10%; }

        @media screen and (min-width: 740px) {
        .student-id { top: 15%; left: 15%; font-size: 16px; font-weight: bold; }
        .student-registration { top: 15%; left: 75%; font-size: 16px; font-weight: bold; }
        .student-session { top: 18%; left: 75%; font-size: 14px; }
        .student-name { top: 35%; left: 45%; font-size: 24px; font-weight: bold; }
        .fathers-name { top: 42%; left: 40%; font-size: 18px; text-transform: capitalize; }
        .mothers-name { top: 47%; left: 40%; font-size: 18px; text-transform: capitalize; }
        .center-name { top: 52%; left: 35%; font-size: 18px; }
        .student-roll { top: 58%; left: 30%; font-size: 16px; }
        .student-subject { top: 58%; left: 55%; font-size: 16px; }
        .center-code { top: 62%; left: 80%; font-size: 14px; }
        .exam-date { top: 65%; left: 45%; font-size: 14px; }
        .student-gpa { top: 65%; left: 70%; font-size: 16px; font-weight: bold; }
        .student-result-published { top: 80%; left: 20%; font-size: 14px; }
        .qr { top: 50%; left: 10%; }
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
<div x-data="{ hasBackground: true }">
    <div class="w-full flex justify-end gap-1 print:hidden py-5 print:py-0">
        <button onclick="generate_pdf()" class="px-3 py-1 rounded-md bg-green-700 text-slate-100">Download</button>
        <button onclick="window.print()" class="px-3 py-1 rounded-md bg-green-700 text-slate-100">Print</button>
        <a   href="{{route('admin.certificateWithoutBackground',$student->id)}}" class="px-3 py-1 rounded-md bg-green-700 text-slate-100">
            with Out Background
        </a>
    </div>
    <div class="card-body min-h-screen" id="fullpage2">
        <div :class="{ 'no-background': !hasBackground }"
             class="back-img"
             style="background-image:url({{ asset('images/student/certificate.jpg') }}); position: relative; font-weight: bold;">
            <div class="w-[900px] border-[10px] border-[#b89b6a] p-6 bg-[#fffaf2] shadow-xl relative font-serif">

                <!-- Background Seal -->
                <div class="absolute inset-0 flex items-center justify-center opacity-10 select-none">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Seal_of_Bangladesh_%28monochrome%29.svg/2048px-Seal_of_Bangladesh_%28monochrome%29.svg.png"
                         alt="Seal" class="w-[400px]" />
                </div>

                <!-- Header -->
                <div class="text-center mb-2 relative z-10">
                    <h1 class="text-2xl font-bold uppercase text-gray-800">Bangladesh National Skill Institute</h1>
                    <p class="text-sm italic text-gray-600">Under the “Skill Program” Bangladesh National Skill Institute</p>
                </div>

                <div class="flex justify-between text-sm mb-6 relative z-10">
                    <div>
                        <p><strong>Serial No :</strong> 5865485448</p>
                        <p><strong>Roll No :</strong> 568485</p>
                    </div>
                    <div class="text-right">
                        <p><strong>Reg No :</strong> 8845584541</p>
                        <p><strong>Session :</strong> Jan to Dec 2024</p>
                    </div>
                </div>

                <!-- Body -->
                <div class="text-justify leading-relaxed text-[15px] relative z-10">
                    <p>
                        This is to certify that
                        <span class="font-semibold underline decoration-gray-500">Juwel Hossain Nayeem</span>,
                        son/daughter of
                        <span class="font-semibold underline decoration-gray-500">Md Forid Alam</span> and
                        <span class="font-semibold underline decoration-gray-500">Tahamina Akhter</span>,
                        Center
                        <span class="font-semibold underline decoration-gray-500">Bangladesh National Skill Institute</span>,
                        duly passed the National Skill Four Years
                        <span class="font-semibold underline decoration-gray-500">Diploma in Mechanical Engineering</span>
                        Course Examination held in the month of
                        <span class="font-semibold underline decoration-gray-500">December 2024</span>,
                        and he/she secured CGPA
                        <span class="font-semibold underline decoration-gray-500">3.77</span>
                        on the scale of 4.00.
                    </p>
                </div>

                <!-- QR & Footer -->
                <div class="flex justify-between items-end mt-10 relative z-10">
                    <div class="flex flex-col items-center">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Bangladesh%20National%20Skill%20Institute" alt="QR Code" class="w-24 h-24 border" />
                        <p class="text-xs mt-2">Date of Publication Results: <strong>25 June 2025</strong></p>
                    </div>

                    <div class="flex flex-col items-center">
                        <div class="w-40 border-t border-gray-600 mt-12"></div>
                        <p class="text-sm mt-1 font-medium">Exam Controller</p>
                    </div>

                    <div class="flex flex-col items-center">
                        <div class="w-40 border-t border-gray-600 mt-12"></div>
                        <p class="text-sm mt-1 font-medium">Chairman</p>
                    </div>
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

