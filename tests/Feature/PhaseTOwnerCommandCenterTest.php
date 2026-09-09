<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PhaseTOwnerCommandCenterTest extends TestCase {
    use RefreshDatabase;
    public function test_command_center_loads() {
        $controller = new \App\Http\Controllers\Admin\CommandCenterController();
        $response = $controller->index();
        $this->assertEquals(200, $response->getStatusCode());
    }
}
