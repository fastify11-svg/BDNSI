@props(['student', 'style' => '', 'route'=>''])

<div id="qrcode_1"></div>

<style>
    @if(empty($style))
    #qrcode_1 img {
        width: 100px;
        margin-left: 45px;
    }
    @else
    #qrcode_1 img {
    {{$style}}
}
    @endif
</style>

<script type="text/javascript" src="{{ mix('js/app.js') }}"></script>
<script type="text/javascript" src="{{ asset('js/qrcode.js') }}"></script>
<script type="text/javascript">
    // Adjusted for high-quality QR code generation
    var qrcode = new QRCode(document.getElementById("qrcode_1"), {
        text: "{{   route('successStudentDetails',$student->id)     }}",
        width: 500,  // Increased width for high resolution
        height: 500, // Increased height for high resolution
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H, // High error correction for better readability
    });

    // Optional: Scale down the QR code display size with CSS if required
    document.querySelector('#qrcode_1 img').style.width = "100px";
</script>
