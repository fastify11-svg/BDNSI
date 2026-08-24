<?php

namespace Tests\Feature;

use Tests\TestCase;

class FrontendHomepageTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        \Illuminate\Support\Facades\Cache::flush();
    }

    /**
     * Test if the homepage loads correctly.
     *
     * @return void
     */
    public function test_homepage_loads_correctly()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    /**
     * Test if the contact us page loads.
     */
    public function test_contact_us_page_loads()
    {
        $response = $this->get('/contact-us');

        $response->assertStatus(200);
    }

    /**
     * Test if the all courses page loads.
     */
    public function test_all_courses_page_loads()
    {
        $response = $this->get('/all-course');

        $response->assertStatus(200);
    }
}
