<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Center;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        if (\DB::connection()->getDriverName() === 'mysql') {
            \DB::statement("SET SESSION sql_mode=''");
        }
        \Schema::disableForeignKeyConstraints();
    }

    public function test_center_user_cannot_access_other_centers_students()
    {
        $this->seed();

        $session = new Session;
        $session->name = '2023';
        $session->duration = '1 Year';
        $session->start_date = '2023-01-01';
        $session->end_date = '2023-12-31';
        $session->save();

        $subject = new Subject;
        $subject->name = 'Math';
        $subject->code = 'M101';
        $subject->save();

        $center1 = new Center;
        $center1->name = 'Center 1';
        $center1->code = 'C1';
        $center1->owner_name = 'Owner 1';
        $center1->director_name = 'Dir 1';
        $center1->mobile = '01234567891';
        $center1->email = 'c1@example.com';
        $center1->status = 1;
        $center1->save();

        $center2 = new Center;
        $center2->name = 'Center 2';
        $center2->code = 'C2';
        $center2->owner_name = 'Owner 2';
        $center2->director_name = 'Dir 2';
        $center2->mobile = '01234567892';
        $center2->email = 'c2@example.com';
        $center2->status = 1;
        $center2->save();

        $user1 = new User;
        $user1->name = 'Center User 1';
        $user1->username = 'center1';
        $user1->phone = '01234567891';
        $user1->email = 'c1_user@example.com';
        $user1->password = Hash::make('password');
        $user1->center_id = $center1->id;
        $user1->save();

        $student1 = new Student;
        $student1->name = 'Student 1';
        $student1->fathers_name = 'F1';
        $student1->mothers_name = 'M1';
        $student1->phone = '01234567891';
        $student1->date_of_birth = '2000-01-01';
        $student1->gender = 1;
        $student1->religion = 1;
        $student1->session_id = $session->id;
        $student1->subject_id = $subject->id;
        $student1->center_id = $center1->id;
        $student1->status = 1;
        $student1->save();

        $student2 = new Student;
        $student2->name = 'Student 2';
        $student2->fathers_name = 'F2';
        $student2->mothers_name = 'M2';
        $student2->phone = '01234567892';
        $student2->date_of_birth = '2000-01-01';
        $student2->gender = 2;
        $student2->religion = 1;
        $student2->session_id = $session->id;
        $student2->subject_id = $subject->id;
        $student2->center_id = $center2->id;
        $student2->status = 1;
        $student2->save();

        $this->actingAs($user1);

        $response = $this->get('/student');
        $response->assertStatus(200);

        // Attempting to view student 2 should fail
        $response = $this->get('/student/'.$student2->id.'/edit');

        $this->assertTrue(in_array($response->status(), [403, 404]), 'Should be forbidden or not found');

        $studentsCount = Student::count();
        $this->assertEquals(1, $studentsCount, 'CenterScope should isolate the student count to 1');
    }

    public function test_admin_can_access_all_students()
    {
        $this->seed();

        $session = new Session;
        $session->name = '2023';
        $session->duration = '1 Year';
        $session->start_date = '2023-01-01';
        $session->end_date = '2023-12-31';
        $session->save();

        $subject = new Subject;
        $subject->name = 'Math';
        $subject->code = 'M101';
        $subject->save();

        $center1 = new Center;
        $center1->name = 'Center 1';
        $center1->code = 'C1_admin';
        $center1->owner_name = 'Owner 1';
        $center1->director_name = 'Dir 1';
        $center1->mobile = '01234567891';
        $center1->email = 'c1_admin@example.com';
        $center1->status = 1;
        $center1->save();

        $center2 = new Center;
        $center2->name = 'Center 2';
        $center2->code = 'C2_admin';
        $center2->owner_name = 'Owner 2';
        $center2->director_name = 'Dir 2';
        $center2->mobile = '01234567892';
        $center2->email = 'c2_admin@example.com';
        $center2->status = 1;
        $center2->save();

        $admin = new Admin;
        $admin->name = 'Admin User';
        $admin->email = 'admin@example.com';
        $admin->password = \Hash::make('password');
        $admin->save();

        $student1 = new Student;
        $student1->name = 'Student 1';
        $student1->fathers_name = 'F1';
        $student1->mothers_name = 'M1';
        $student1->phone = '01234567891';
        $student1->date_of_birth = '2000-01-01';
        $student1->gender = 1;
        $student1->religion = 1;
        $student1->session_id = $session->id;
        $student1->subject_id = $subject->id;
        $student1->center_id = $center1->id;
        $student1->status = 1;
        $student1->save();

        $student2 = new Student;
        $student2->name = 'Student 2';
        $student2->fathers_name = 'F2';
        $student2->mothers_name = 'M2';
        $student2->phone = '01234567892';
        $student2->date_of_birth = '2000-01-01';
        $student2->gender = 2;
        $student2->religion = 1;
        $student2->session_id = $session->id;
        $student2->subject_id = $subject->id;
        $student2->center_id = $center2->id;
        $student2->status = 1;
        $student2->save();

        $this->actingAs($admin, 'admin');

        $studentsCount = Student::count();
        $this->assertEquals(Student::withoutGlobalScopes()->count(), $studentsCount, 'Admin should see all students');
    }
}
