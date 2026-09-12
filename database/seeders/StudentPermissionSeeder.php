<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class StudentPermissionSeeder extends Seeder
{
    /**
     * Creates the student-full-edit and student-status-edit permissions
     * and assigns them to the correct roles without truncating any existing data.
     */
    public function run(): void
    {
        // 1. Ensure both permissions exist (idempotent — safe to re-run)
        $fullEditPermission = Permission::firstOrCreate(
            ['name' => 'student-full-edit'],
            [
                'display_name' => 'Full Edit Student',
                'description'  => 'Allows full edit of all student fields including financial data.',
            ]
        );

        $statusEditPermission = Permission::firstOrCreate(
            ['name' => 'student-status-edit'],
            [
                'display_name' => 'Status Edit Student',
                'description'  => 'Allows editing only the status field of a student.',
            ]
        );

        $this->command->info('✅ Permissions created: student-full-edit, student-status-edit');

        // 2. Attach student-full-edit to super-admin role
        $superAdminRole = Role::where('name', 'super-admin')
            ->orWhere('name', 'super_admin')
            ->orWhere('name', 'admin')
            ->first();

        if ($superAdminRole) {
            $superAdminRole->permissions()->syncWithoutDetaching([$fullEditPermission->id, $statusEditPermission->id]);
            $this->command->info("✅ Attached student-full-edit to role: {$superAdminRole->name}");
        } else {
            $this->command->warn('⚠️  No super-admin role found. Creating one.');
            $superAdminRole = Role::firstOrCreate(
                ['name' => 'super-admin'],
                ['display_name' => 'Super Admin', 'description' => 'Full system access']
            );
            $superAdminRole->permissions()->syncWithoutDetaching([$fullEditPermission->id, $statusEditPermission->id]);
        }

        // 3. Attach student-status-edit to all other roles
        $otherRoles = Role::where('name', '!=', $superAdminRole->name)->get();
        foreach ($otherRoles as $role) {
            $role->permissions()->syncWithoutDetaching([$statusEditPermission->id]);
            $this->command->info("   Attached student-status-edit to role: {$role->name}");
        }

        // 4. Attach super-admin role to Admin #1 (the root account) — idempotent
        $rootAdmin = Admin::find(1);
        if ($rootAdmin) {
            // Use syncRoles to avoid duplicate key constraint errors
            $existingRoleIds = $rootAdmin->roles()->pluck('roles.id')->toArray();
            if (!in_array($superAdminRole->id, $existingRoleIds)) {
                $rootAdmin->addRole($superAdminRole);
                $this->command->info("✅ Attached super-admin role to Admin ID 1");
            } else {
                $this->command->info("ℹ️  Admin ID 1 already has the super-admin role.");
            }
        }

        $this->command->info('✅ StudentPermissionSeeder complete.');
    }
}
