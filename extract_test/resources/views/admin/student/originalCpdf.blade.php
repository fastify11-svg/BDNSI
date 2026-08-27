<div  style="margin: 4px">
    <div class="no-print" > C-pdf</div>
    <button onclick="generate_pdf()" class="no-print" style="padding: 5px; background: green; color: white">Download</button>

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
        margin: 0 auto;
        position: relative !important;
        min-height: 98%;
        background: url({{asset('images/student/certificate.jpg')}});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        width: 100%;
        max-width: 1400px;
        aspect-ratio: 15/11;
    }
    .box {
        position: absolute;
        width: 61%;
        bottom: 23%;
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
            bottom: 320px;
            left: 120px;
            width: 81px;
        }
        .qr-code canvas img {
            width: 80px;
        }
        .main-box {
            width:100%;
            height: 100%;
        }
        .box {
            width: 669px;
            bottom: 200px;
            left: 630px;
        }
        .underlined {
            width: 74.2%;
            padding-left: 50px;
            margin-bottom: 11px;
        }
        .underlined2 {
            border-bottom: 2px dotted black!important;
            margin-bottom: 10px;
            width: 76%;
            padding-left: 60px;
        }
        .underlined3 {
            border-bottom: 2px dotted black!important;
            margin-bottom: 10px;
            width: 79.40%;
            padding-left: 110px;
        }
        .underlined4 {
            border-bottom: 2px dotted black!important;
            margin-bottom: 10px;
            width: 82.38%;
            padding-left: 100px;
        }
        .underlined5 {
            border-bottom: 2px dotted black!important;
            margin-bottom: 10px;
            width: 40.8%;
            text-align: center
        }
        .underlined6 {
            border-bottom: 2px dotted black!important;
            margin-bottom: 10px;
            width: 59.58%;
            padding: 0px 6px;
            padding-left: 50px;
        }
        .underlined7 {
            border-bottom: 2px dotted black!important;
            margin-bottom: 10px;
            width: 22.5%;
            padding-left: 35px;
        }
        .underlined8 {
            border-bottom: 2px dotted black!important;
            margin-bottom: 10px;
            width: 11.38%;
            padding: 0px 6px;
        }
        .publish_data {
            bottom: 125px;
            left: 100px;
        }
    }
</style>
<div class="container" >
    <div class="main-box" id="fullpage2">
        <div style="width: 50px; height: 50px"  class="qr-code"  id="qrcode_1"></div>
        {{--        <img src="{{asset('images/cetificate qr code.png')}}" alt="" >--}}
        <p class="publish_data">Date of Publication of Results:      @if($student->result_publised)
                {{ \Carbon\Carbon::make($student->result_publised)->format('j-F-Y') }}
            @endif</p>
        <p class="website">Website link: www.bdnsi.com</p>
        <div class="box">
            <p class="text-end text-lg position-0">Roll No. <span class="rol-reg-sec position-0">{{ $student->roll ?? '' }}</span></p>
            <div class="inline-block w-full">
                <p class="float-left">Serial No : <span class="rol-reg-sec1">{{ \App\Lib\Helper::certificateSerialNumber($student->id) ?? '' }}</span></p>
                <p class="float-right">Reg No. <span class="rol-reg-sec position-0">{{ $student->registration ?? '' }}</span></p>
            </div>
            <div class="text-end mt-2 text-lg">Session. <span class="rol-reg-sec position-0">{{$student->session->name??''}}</span></div>
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

<div style="border: none;">
    <svg width="100%" height="2" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="1" x2="100%" y2="1" stroke="black" stroke-dasharray="4,4" />
    </svg>
</div>


<script type="text/javascript" src="{{ asset('js/qrcode.js') }}"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

<script>
    function generate_pdf() {
        const element = document.getElementById('fullpage2');

        const opt = {
            margin:       0,
            filename:     '{{ $student->name . "_" . $student->roll }}.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 7 },
            jsPDF:        { unit: 'pt', format: [1020, 816], orientation: 'landscape' }
        };

        html2pdf().set(opt).from(element).save();
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
