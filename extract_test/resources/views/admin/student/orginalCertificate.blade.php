<button onclick="window.print()" class="no-print">Print</button>
<a href="{{route('admin.student.show',[$student->id,'orginalcpdf'=>'orginalcpdf'])}}" class="no-print"
   style="padding: 5px; background: green; color: white">C-pdf Download</a>

<div class="container">
    <div class="main-box" id="fullpage2">
        <div style="width: 50px; height: 50px" class="qr-code" id="qrcode_1"></div>
        {{--        <img src="{{asset('images/cetificate qr code.png')}}" alt="" >--}}
        <p class="publish_data">Date of Publication of Results: @if($student->result_publised)
                {{ \Carbon\Carbon::make($student->result_publised)->format('j-F-Y') }}
            @endif</p>

        <p class="website">Website link: www.bdnsi.com</p>

        <div class="box">
            <p class="text-end text-lg position-0">Roll No. <span
                    class="rol-reg-sec position-0">{{ $student->roll ?? '' }}</span></p>
            <div class="inline-block w-full">
                <p class="float-left">Serial No : <span
                        class="rol-reg-sec1">{{ \App\Lib\Helper::certificateSerialNumber($student->id) ?? '' }}</span>
                </p>
                <p class="float-right">Reg No. <span
                        class="rol-reg-sec position-0">{{ $student->registration ?? '' }}</span></p>
            </div>
            <div class="text-end mt-2 text-lg">Session. <span
                    class="rol-reg-sec position-0">{{$student->session->name??''}}</span></div>
            <div class="cat_parent">
                <p class="inline-block float-left text">This is to certify that</p>
                <p class="underlined inline-block float-left position-0 student-name">{{ $student->name ?? '' }}</p>
            </div>
            <div class="cat_parent">
                <p class="inline-block float-left text2">Son/daughter of</p>
                <div class="underlined2 inline-block float-left">
                    <p class="float-left position-0">{{ $student->fathers_name ?? '' }}</p>
                    <p class="float-right position-0">(father)</p>
                </div>
            </div>
            <div class="cat_parent">
                <p class="inline-block float-left text3">and</p>
                <div class="underlined3 inline-block float-left">
                    <p class="float-left position-0">{{ $student->mothers_name ?? '' }}</p>
                    <p class="float-right position-0">(mother)</p>
                </div>
            </div>
            <div class="cat_parent">
                <p class="inline-block float-left text4">of</p>
                <p class="underlined4 inline-block float-left position-0">{{$student->subject->name??''}}</p>
            </div>
            <div class="cat_parent">
                <p class="inline-block float-left">has successfully completed the course of</p>
                <p class="underlined5 inline-block float-left position-0">{{$student->course_duration??''}}</p>
                <p class="inline-block float-left">from the technical training</p>
            </div>
            <div class="cat_parent">
                <p class="inline-block float-left">Center</p>
                <p class="underlined6 inline-block float-left position-0">{{ $student->center->name ?? '' }}</p>
                <p class="inline-block float-left">examination held in the month</p>
            </div>
            <div class="cat_parent">
                <p class="inline-block float-left">of</p>
                <p class="underlined7 inline-block float-left position-0">{{ \Carbon\Carbon::parse($student->exam_date)->format('j-F-Y') }}</p>
                <p class="inline-block float-left">Conducted by the BDNSI. He/She Secured CGPA</p>
                <p class="underlined8 inline-block float-left position-0"> {{ number_format($student->t_written_gpa(),2)?? '' }}</p>
                <p class="inline-block float-left">on a scale of 4.00</p>
            </div>
        </div>
    </div>
</div>
<style>
    @font-face {
        font-family: 'Monotype Corsiva';
        src: url('{{ asset('frontend/fonts/Monotype Corsiva/Monotype-Corsiva-Regular-Italic.ttf') }}') format('truetype');
    }
    * {
        margin: 0;
        padding: 0;
        font-family: Monotype Corsiva;
    }
    .student-name {
        padding-left: 20px;
    }
    p {
        line-height: 26px;
        font-weight: 500;
        font-size: 20px;
    }
    .whitespace-nowrap {
        white-space: nowrap;
    }
    .container {
        /* min-height: 1346px; */

    }
    .position-0 {
        line-height: 18px
    }
    .float-right {
        float: right;
    }
    .w-full {
        width: 100%;
    }
    .cat_parent {
        width: 100%;
        display: inline-block;
    }
    .inline-block {
        display: inline-block;
    }
    .text-lg {
        font-size: 20px;
    }
    .underlined {
        border-bottom: 2px dotted black;
        margin-bottom: 20px;
        width: 75%;
        padding-left: 55px;
    }
    .underlined2 {
        border-bottom: 2px dotted black;
        margin-bottom: 20px;
        width: 78%;
        padding: 0px 6px;
        padding-left: 65px;
    }
    .underlined3 {
        border-bottom: 2px dotted black;
        margin-bottom: 20px;
        width: 82%;
        padding: 0px 6px;
        padding-left: 114px;
    }
    .underlined4 {
        border-bottom: 2px dotted black;
        margin-bottom: 20px;
        width: 85%;
        padding: 0px 6px;
        padding-left: 100px;
    }
    .underlined5 {
        border-bottom: 2px dotted black;
        margin-bottom: 20px;
        width: 45%;
        padding: 0px 6px;
        text-align: center;
    }
    .underlined6 {
        border-bottom: 2px dotted black;
        margin-bottom: 20px;
        width: 64%;
        padding: 0px 6px;
        padding-left: 40px;
    }
    .underlined7 {
        border-bottom: 2px dotted black;
        margin-bottom: 20px;
        width: 22%;
        padding: 0px 6px;
        padding-left: 30px;
    }
    .underlined8 {
        border-bottom: 2px dotted black;
        margin-bottom: 20px;
        width: 18%;
        padding: 0px 6px;
        text-align: center;
    }
    .mt-2 {
        margin-top: 10px;
    }
    .main-box {
        /*margin: 0 auto;*/
        position: relative !important;
        min-height: 100%;
        background: url({{asset('images/student/certificate.jpg')}});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        width: 100%;
        max-width: 1427px;
        aspect-ratio: 14/11;
    }
    .box {
        position: absolute;
        width: 61%;
        bottom: 25%;
        left: 59.5%;
        transform: translateX(-50%);
        /* border: 1px solid black; */
    }

    .qr-code {
        position: absolute;
        bottom: 39%;
        left: 17%;
        width: 91px;
    }

    .publish_data {
        position: absolute;
        bottom: 14%;
        left: 10%;
        font-size: 14px;
    }

    .website {
        position: absolute;
        bottom: 13%;
        left: 50%;
        font-size: 14px;
    }

    .text-end {
        text-align: end;
        margin-bottom: 10px;
    }

    .rol-reg-sec {
        text-align: start;
        padding-left: 20px;
        /* padding-bottom: 3px; */
        display: inline-block;
        width: 130px;
        border-bottom: 2px dotted black;
        margin-bottom: 0px;
        line-height: 16px;
    }
    .rol-reg-sec1 {
        text-align: start;
        padding-left: 6px;
        /* padding-bottom: 3px; */
        display: inline-block;
        width: 130px;
    }
    .float-right {
        float: right !important;
    }
    .float-left {
        float: left !important;
    }
    #qrcode_1 canvas img {
        width: 50px;
    }
</style>
<style>

    @media print{

        .container {
            /* min-height: 558px; */
        }
        .text-lg {
            font-size: 18px;
        }
        p {
            line-height: 22px;
            font-size: 18px;
        }
        .no-print {
            display: none;
        }

        .qr-code {
            position: absolute;
            bottom: 330px;
            left: 16%!important;
            width: 81px;
        }

        .qr-code canvas img {
            width: 80px;
        }

        .main-box {
            width: 100%;
            height: 100%;

        }


        .box {
            width: 61%;
            bottom: 197px;
            left: 60%;
        }

        .underlined {
            width: 72.2%; /* 71.2 + 1 */
            padding-left: 50px;
            margin-bottom: 11px;
        }
        .underlined2 {
            border-bottom: 2px dotted black !important;
            margin-bottom: 10px;
            width: 74%; /* 73 + 1 */
            padding-left: 60px;
        }
        .underlined3 {
            border-bottom: 2px dotted black !important;
            margin-bottom: 10px;
            width: 77.40%; /* 76.40 + 1 */
            padding-left: 110px;
        }
        .underlined4 {
            border-bottom: 2px dotted black !important;
            margin-bottom: 10px;
            width: 80.36%; /* 79.38 + 1 */
            padding-left: 100px;
        }
        .underlined5 {
            border-bottom: 2px dotted black !important;
            margin-bottom: 10px;
            width: 38%; /* 37.8 + 1 */
            text-align: center;
        }
        .underlined6 {
            border-bottom: 2px dotted black !important;
            margin-bottom: 10px;
            width: 57.58%; /* 56.58 + 1 */
            padding: 0px 6px;
            padding-left: 50px;
        }
        .underlined7 {
            border-bottom: 2px dotted black !important;
            margin-bottom: 10px;
            width: 19%; /* 18 + 1 */
            padding-left: 35px;
        }
        .underlined8 {
            border-bottom: 2px dotted black !important;
            margin-bottom: 10px;
            width: 8.38%; /* 7.38 + 1 */
            padding: 0px 6px;
        }


        .publish_data {
            bottom: 125px;
            left: 100px;
        }
    }
</style>

<script type="text/javascript" src="{{ asset('js/qrcode.js') }}"></script>
<script src="{{ asset('js/pdf.js') }}"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://printjs-4de6.kxcdn.com/print.min.js"></script>

<script>
    function generate_pdf() {
        const node = document.getElementById('fullpage2');
        domtoimage.toPng(node)
            .then(function (dataUrl) {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'pt',
                    format: [816, 1020],
                });
                const img = new Image();
                img.src = dataUrl;
                img.onload = function () {
                    pdf.addImage(img, 'PNG', 0, 0);
                    pdf.save("{{ $student->name . '_' . $student->roll }}.pdf");
                }
            });
    }
</script>

{{--<script type="text/javascript">
    function generate_pdf() {
        const element = document.getElementById('fullpage2');
        const options = {
            margin: 0,
            filename: "{{ $student->name . '_' . $student->roll }}.pdf",
            image: { type: 'jpeg', quality: 0.99 },
            html2canvas: { scale: 3 ,useCORS: true,},
            jsPDF:        { unit: 'pt', format: [816, 1020], orientation: 'landscape' }
        };
        html2pdf().set(options).from(element).save();
    }
</script>--}}

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
    document.querySelector('#qrcode_1 img').style.width = "87px";
</script>
