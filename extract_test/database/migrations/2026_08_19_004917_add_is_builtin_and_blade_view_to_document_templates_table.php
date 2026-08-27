<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsBuiltinAndBladeViewToDocumentTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('document_templates', 'is_builtin')) {
            Schema::table('document_templates', function (Blueprint $table) {
                $table->boolean('is_builtin')->default(false)->after('status');
                $table->string('blade_view')->nullable()->after('is_builtin');
            });

            $builtins = [
                ['name' => 'Admit Card (Built-in)', 'type' => 'admit_card', 'blade_view' => 'admin.student.admitCard'],
                ['name' => 'Transcript (Built-in)', 'type' => 'transcript', 'blade_view' => 'admin.student.transcript'],
                ['name' => 'Registration Form (Built-in)', 'type' => 'registration_card', 'blade_view' => 'admin.student.registrationForm'],
                ['name' => 'ID Card (Built-in)', 'type' => 'id_card', 'blade_view' => 'admin.student.idcard'],
                ['name' => 'Certificate (Built-in)', 'type' => 'certificate', 'blade_view' => 'admin.student.certificate2'],
                ['name' => 'Certificate PDF (Built-in)', 'type' => 'certificate_pdf', 'blade_view' => 'admin.student.cpdf'],
                ['name' => 'Original Certificate (Built-in)', 'type' => 'original_certificate', 'blade_view' => 'admin.student.orginalCertificate'],
                ['name' => 'Original Certificate PDF (Built-in)', 'type' => 'original_c_pdf', 'blade_view' => 'admin.student.originalCpdf'],
            ];

            foreach ($builtins as $builtin) {
                \App\Models\DocumentTemplate::create([
                    'name' => $builtin['name'],
                    'type' => $builtin['type'],
                    'width' => '800px', // Dummy
                    'height' => '600px', // Dummy
                    'status' => 1,
                    'is_builtin' => true,
                    'blade_view' => $builtin['blade_view']
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \App\Models\DocumentTemplate::where('is_builtin', true)->delete();

        Schema::table('document_templates', function (Blueprint $table) {
            $table->dropColumn('is_builtin');
            $table->dropColumn('blade_view');
        });
    }
}
