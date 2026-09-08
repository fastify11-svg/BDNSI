<?php
namespace Tests\Feature;
use Tests\TestCase;
class PhaseTOwnerCommandCenterTest extends TestCase {
    public function test_command_center_loads() {
        $controller = new \App\Http\Controllers\Admin\CommandCenterController();
        $response = $controller->index();
        $this->assertEquals(200, $response->getStatusCode());
    }
}
