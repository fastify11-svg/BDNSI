@props(['student'])
<script src="{{asset('js/pdf.js')}}"></script>
<style>
    .textDeg{
        text-transform: capitalize!important;
    }

</style>
<div class="flex items-center justify-center space-x-4 print:hidden mt-4">
    <button
        type="button"
        class="px-4 py-2 rounded-md bg-green-800 text-white hover:bg-green-700 transition"
        onclick="window.print()">
        Print
    </button>
    <button
        onclick="generate_pdf()"
        class="px-4 py-2 rounded-md bg-green-800 text-white hover:bg-green-700 transition">
        Download
    </button>
    <a
        type="button"
        class="px-4 py-2 rounded-md bg-green-800 text-white hover:bg-green-700 transition"
        href="">
        Back
    </a>
</div>

<div class="md:p-10">
    <div class="flex w-full flex-wrap textDeg" id="html2pdf">
        <div class=" p-2 w-1/2">
            <div
                class="relative h-[600px] w-full rounded-md p-2"
                style="
                    background-image: url({{asset('images/student/IdCardfast.jpg')}});
                    background-position: center center;
                    background-size: contain;
                    background-repeat: no-repeat;
                "
            >
                <div class="absolute inset-0 left-5 top-[9%] flex items-center justify-center ">
                    <div class="text-center">
                        <img class="mx-auto h-32 w-32 mt-7 rounded-full border-[4px] border-[#6aa84f]" src="{{$student->picture ?? ''}}" alt="" />

                        <div class="mt-5 flex justify-center">
                            <table class="mx-auto w-full font-semibold text-xs text-left">
                                <tr>
                                    <td class="px-2 py-3">Reg No</td>
                                    <td class="px-2 py-3">:</td>
                                    <td class="px-2 py-3">{{$student->registration??''}}</td>
                                </tr>
                                <tr>
                                    <td class="px-2 py-3">Student Name</td>
                                    <td class="px-2 py-3">:</td>
                                    <td class="px-2 py-3">{{$student->name ?? ''}}</td>
                                </tr>
                                <tr>
                                    <td class="px-2 py-3">Father's Name</td>
                                    <td class="px-2 py-3">:</td>
                                    <td class="px-2 py-3">{{$student->fathers_name ?? ''}}</td>
                                </tr>
                                <tr>
                                    <td class="px-2 py-3">Center</td>
                                    <td class="px-2 py-3">:</td>
                                    <td class="px-2 py-3 "> <div class="w-[200px] break-words whitespace-normal">{{$student->center->name ?? ''}}</div></td>
                                </tr>
                                <tr>
                                    <td class="px-2 py-3">Phone</td>
                                    <td class="px-2 py-3">:</td>
                                    <td class="px-2 py-3">{{$student->phone ?? ''}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>


            </div>
        </div>

        <!-- Page Break -->
        <div class=" p-2 w-1/2">
            <div
                class="relative h-[600px] w-full rounded-md p-2"
                style="
                    background-image: url({{asset('images/student/idcard-back.jpg')}});
                    background-position: center center;
                    background-size: contain;
                    background-repeat: no-repeat;
                "
            >
                <div class="absolute top-[74%] left-[37%]">
                    <x-qr-code :student="$student"/>
                </div>
            </div>
        </div>
    </div>
</div>


<script type="text/javascript">
    function generate_pdf() {
        var opt = {
            margin: 0,
            filename: 'idcard.pdf',
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





