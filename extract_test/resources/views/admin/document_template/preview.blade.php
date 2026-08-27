<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview: {{ $template->name }}</title>
    <!-- Include html2pdf.bundle.min.js for Advanced PDF Generation -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <style>
        @page {
            size: {{ $template->width }} {{ $template->height }};
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
            width: {{ $template->width }};
            height: {{ $template->height }};
            position: relative;
            background-color: {{ $template->background_color ?? '#ffffff' }};
            background-image: url('{{ $template->background_image ? asset('storage/' . $template->background_image) : "" }}');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            font-family: Arial, sans-serif;
        }
        .dynamic-field {
            position: absolute;
            white-space: nowrap;
        }
        
        /* Toolbar styles for advanced engine */
        .advanced-toolbar {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            display: flex;
            gap: 10px;
        }
        .btn-download {
            background: #4f46e5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
        }
        .btn-download:hover { background: #4338ca; }
        
        .page-container {
            width: {{ $template->width }};
            height: {{ $template->height }};
            position: relative;
            background-color: {{ $template->background_color ?? '#ffffff' }};
            background-image: url('{{ $template->background_image ? asset('storage/' . $template->background_image) : "" }}');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            page-break-after: always;
            margin: 0 auto;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .page-container:last-child {
            page-break-after: auto;
        }
        
        /* Print optimization */
        @media print {
            body {
                background-color: transparent;
                -webkit-print-color-adjust: exact;
            }
            .page-container {
                box-shadow: none;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="advanced-toolbar" id="adv-toolbar">
        <button class="btn-download" onclick="downloadPDF()">Download as PDF</button>
        <button class="btn-download" style="background:#10b981;" onclick="window.print()">Print</button>
    </div>

    <div id="document-container">
        @php
            $loopPages = isset($pages) ? $pages : (isset($mappedFields) ? [$mappedFields] : [$template->fields]);
        @endphp

        @foreach($loopPages as $pageFields)
        <div class="page-container">
            @foreach($pageFields as $item)
                @php
                $isMapped = isset($item['value']);
                $field = $isMapped ? $item['field'] : $item;
                $val = $isMapped ? $item['value'] : '[' . $field->variable_key . ']';
                $type = $isMapped ? $item['type'] : ($field->element_type ?? 'text');
                
                if (!$isMapped) {
                    if ($field->variable_key === 'qr_code') $type = 'qrcode_dummy';
                    if ($field->variable_key === 'student_image') $type = 'image_dummy';
                }

                if ($type === 'static_text') {
                    $val = $field->content ?? '';
                } elseif ($type === 'static_image') {
                    $val = $field->content ?? '';
                }
            @endphp
            <div class="dynamic-field" style="
                left: {{ $field->position_x }};
                top: {{ $field->position_y }};
                z-index: {{ $field->z_index ?? 1 }};
                font-size: {{ $field->font_size ?? '16px' }};
                font-family: {{ $field->font_family ?? 'Arial' }};
                font-weight: {{ $field->font_weight ?? 'normal' }};
                color: {{ $field->color ?? '#000000' }};
                text-align: {{ $field->text_align ?? 'left' }};
                letter-spacing: {{ $field->letter_spacing ?? 'normal' }};
                text-transform: {{ $field->text_transform ?? 'none' }};
                text-shadow: {{ $field->text_shadow ?? 'none' }};
            ">
                @if($type === 'qrcode')
                    <img src="data:image/svg+xml;base64,{{ $val }}" style="width:{{ $field->width ?? '100px' }}; height:{{ $field->height ?? '100px' }};" alt="QR Code" />
                @elseif($type === 'qrcode_dummy')
                    <div style="width:{{ $field->width ?? '100px' }}; height:{{ $field->height ?? '100px' }}; border:2px dashed #333; display:flex; align-items:center; justify-content:center;">[QR]</div>
                @elseif($type === 'image')
                    <img src="{{ $val }}" style="width:{{ $field->width ?? '120px' }}; height:{{ $field->height ?? '150px' }}; object-fit:cover;" alt="Student Photo" />
                @elseif($type === 'image_dummy')
                    <div style="width:{{ $field->width ?? '120px' }}; height:{{ $field->height ?? '150px' }}; border:2px dashed #333; display:flex; align-items:center; justify-content:center;">[PHOTO]</div>
                @elseif($type === 'static_image')
                    @if($val)
                        <img src="{{ $val }}" style="width:{{ $field->width ?? '100px' }}; height:{{ $field->height ?? '100px' }}; object-fit:cover;" alt="Static Asset" />
                    @else
                        <div style="width:{{ $field->width ?? '100px' }}; height:{{ $field->height ?? '100px' }}; border:2px dashed #333; display:flex; align-items:center; justify-content:center;">[STATIC IMG]</div>
                    @endif
                @elseif($type === 'html')
                    {!! $val !!}
                @else
                    {!! nl2br(e($val)) !!}
                @endif
            </div>
        @endforeach
        </div>
        @endforeach
    </div>

    <script>
        function downloadPDF() {
            document.getElementById('adv-toolbar').style.display = 'none';
            var element = document.getElementById('document-container');
            var opt = {
                margin:       0,
                filename:     '{{ $template->name }}.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'px', format: [{{ (int)str_replace('px','',$template->width) }}, {{ (int)str_replace('px','',$template->height) }}], orientation: '{{ (int)str_replace("px","",$template->width) > (int)str_replace("px","",$template->height) ? "landscape" : "portrait" }}' },
                pagebreak:    { mode: ['css', 'legacy'] }
            };
            html2pdf().set(opt).from(element).save().then(function() {
                document.getElementById('adv-toolbar').style.display = 'flex';
            });
        }
    </script>
</body>
</html>
