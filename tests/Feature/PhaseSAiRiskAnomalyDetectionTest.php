<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PhaseSAiRiskAnomalyDetectionTest extends TestCase {
    use RefreshDatabase;
    public function test_ai_detects_anomalies() {
        $service = new \App\Services\AiRiskAnomalyDetectionService();
        $result = $service->detectAnomalies();
        $this->assertEquals(0, $result['anomalies_detected']);
    }
}
