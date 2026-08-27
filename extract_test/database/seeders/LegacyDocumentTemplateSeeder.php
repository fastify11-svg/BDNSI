<?php

namespace Database\Seeders;

use App\Models\DocumentTemplate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class LegacyDocumentTemplateSeeder extends Seeder
{
    public function run()
    {
        // Copy images to storage
        $publicImageDir = public_path('images/student');
        $storageDir = storage_path('app/public/document_templates');

        if (! File::exists($storageDir)) {
            File::makeDirectory($storageDir, 0755, true);
        }

        $templates = [
            [
                'name' => 'Legacy Admit Card',
                'type' => 'admit_card',
                'width' => '1185px',
                'height' => '835px',
                'background_image' => 'AdmitCard.jpg',
                'fields' => [
                    ['variable_key' => 'center_code', 'position_x' => '400px', 'position_y' => '400px'],
                    ['variable_key' => 'center_name', 'position_x' => '400px', 'position_y' => '440px'],
                    ['variable_key' => 'name', 'position_x' => '400px', 'position_y' => '480px'],
                    ['variable_key' => 'fathers_name', 'position_x' => '400px', 'position_y' => '520px'],
                    ['variable_key' => 'mothers_name', 'position_x' => '400px', 'position_y' => '560px'],
                    ['variable_key' => 'roll', 'position_x' => '400px', 'position_y' => '600px'],
                    ['variable_key' => 'registration', 'position_x' => '400px', 'position_y' => '640px'],
                    ['variable_key' => 'student_image', 'position_x' => '850px', 'position_y' => '350px'],
                    ['variable_key' => 'qr_code', 'position_x' => '860px', 'position_y' => '530px'],
                ],
            ],
            [
                'name' => 'Legacy Registration Card',
                'type' => 'registration_card',
                'width' => '1170px',
                'height' => '1660px',
                'background_image' => 'registration-card.jpg',
                'fields' => [
                    ['variable_key' => 'name', 'position_x' => '400px', 'position_y' => '600px'],
                    ['variable_key' => 'fathers_name', 'position_x' => '400px', 'position_y' => '640px'],
                    ['variable_key' => 'mothers_name', 'position_x' => '400px', 'position_y' => '680px'],
                    ['variable_key' => 'roll', 'position_x' => '400px', 'position_y' => '720px'],
                    ['variable_key' => 'registration', 'position_x' => '400px', 'position_y' => '760px'],
                    ['variable_key' => 'center_name', 'position_x' => '400px', 'position_y' => '800px'],
                    ['variable_key' => 'student_image', 'position_x' => '850px', 'position_y' => '550px'],
                    ['variable_key' => 'qr_code', 'position_x' => '860px', 'position_y' => '750px'],
                ],
            ],
            [
                'name' => 'Legacy Transcript',
                'type' => 'transcript',
                'width' => '1170px',
                'height' => '1650px',
                'background_image' => 'transacpt.png',
                'fields' => [
                    ['variable_key' => 'name', 'position_x' => '400px', 'position_y' => '600px'],
                    ['variable_key' => 'roll', 'position_x' => '400px', 'position_y' => '640px'],
                    ['variable_key' => 'registration', 'position_x' => '400px', 'position_y' => '680px'],
                ],
            ],
            [
                'name' => 'Legacy Certificate',
                'type' => 'certificate',
                'width' => '1123px',
                'height' => '794px',
                'background_image' => 'certificate.jpg',
                'fields' => [
                    ['variable_key' => 'name', 'position_x' => '400px', 'position_y' => '300px'],
                    ['variable_key' => 'roll', 'position_x' => '400px', 'position_y' => '350px'],
                ],
            ],
            [
                'name' => 'Legacy Original Certificate',
                'type' => 'original_certificate',
                'width' => '1123px',
                'height' => '794px',
                'background_image' => 'certificate.jpg',
                'fields' => [
                    ['variable_key' => 'name', 'position_x' => '400px', 'position_y' => '300px'],
                ],
            ],
            [
                'name' => 'Legacy Original C-Pdf',
                'type' => 'original_c_pdf',
                'width' => '1123px',
                'height' => '794px',
                'background_image' => 'certificate.jpg',
                'fields' => [
                    ['variable_key' => 'name', 'position_x' => '400px', 'position_y' => '300px'],
                ],
            ],
            [
                'name' => 'Legacy Certificate PDF',
                'type' => 'certificate_pdf',
                'width' => '1123px',
                'height' => '794px',
                'background_image' => 'certificate.jpg',
                'fields' => [
                    ['variable_key' => 'name', 'position_x' => '400px', 'position_y' => '300px'],
                ],
            ],
            [
                'name' => 'Legacy ID Card',
                'type' => 'id_card',
                'width' => '600px',
                'height' => '1000px',
                'background_image' => 'IdCardfast.jpg',
                'fields' => [
                    ['variable_key' => 'name', 'position_x' => '200px', 'position_y' => '500px'],
                    ['variable_key' => 'roll', 'position_x' => '200px', 'position_y' => '550px'],
                    ['variable_key' => 'student_image', 'position_x' => '250px', 'position_y' => '200px'],
                ],
            ],
        ];

        foreach ($templates as $tmpl) {
            // Check if template already exists
            $exists = DocumentTemplate::where('type', $tmpl['type'])->first();
            if ($exists) {
                continue;
            }

            // Copy background image if it exists in public
            $sourceFile = $publicImageDir.'/'.$tmpl['background_image'];
            $destFile = $storageDir.'/'.$tmpl['background_image'];

            if (File::exists($sourceFile)) {
                File::copy($sourceFile, $destFile);
            }

            $template = DocumentTemplate::create([
                'name' => $tmpl['name'],
                'type' => $tmpl['type'],
                'width' => $tmpl['width'],
                'height' => $tmpl['height'],
                'background_image' => 'document_templates/'.$tmpl['background_image'],
                'status' => 1,
            ]);

            foreach ($tmpl['fields'] as $field) {
                $template->fields()->create([
                    'variable_key' => $field['variable_key'],
                    'position_x' => $field['position_x'],
                    'position_y' => $field['position_y'],
                    'font_size' => '18px',
                    'font_family' => 'Arial',
                    'font_weight' => 'normal',
                    'color' => '#000000',
                ]);
            }
        }
    }
}
