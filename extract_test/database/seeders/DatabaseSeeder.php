<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // User::factory(10)->create();
        //        tap(
        //            User::create([
        //                'name' => 'User',
        //                'username' => 'user',
        //                'phone' => '01777777777',
        //                'email' => 'user@gmail.com',
        //                'password' => Hash::make('password')
        //            ])
        //        )->markEmailAsVerified()->markPhoneAsVerified();

        $admin = Admin::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'Admin', 'password' => Hash::make('12345678')]
        );

        $this->call(LaratrustSeeder::class);
        $this->call(ConfigSeeder::class);
        $this->call(SiteConfigSeeder::class);
        $this->call(DemoDataSeeder::class);

        $admin->syncRoles([Role::whereName('admin')->first()]);
    }
}
