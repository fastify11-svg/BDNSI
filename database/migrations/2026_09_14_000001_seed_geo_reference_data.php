<?php

use App\Lib\Geo;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach (Geo::divisions() as $id => $division) {
            DB::table('divisions')->updateOrInsert(
                ['id' => $id],
                ['name' => $division['name']]
            );
        }

        foreach (Geo::districts() as $id => $district) {
            DB::table('districts')->updateOrInsert(
                ['id' => $id],
                [
                    'division_id' => $district['division_id'],
                    'name' => $district['name'],
                ]
            );
        }

        foreach (Geo::upazillas() as $id => $upazila) {
            DB::table('upazilas')->updateOrInsert(
                ['id' => $id],
                [
                    'district_id' => $upazila['district_id'],
                    'name' => $upazila['name'],
                ]
            );
        }
    }

    public function down(): void
    {
        // Geographic master data is reference data used by persisted Center and
        // Student records. Do not delete it automatically during a rollback.
    }
};
