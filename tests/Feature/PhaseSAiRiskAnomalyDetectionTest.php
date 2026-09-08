<?php
namespace Tests\Feature;
use Tests\TestCase;
class PhaseSAiRiskAnomalyDetectionTest extends TestCase {
    public function test_ai_detects_anomalies() {
        $service = new \App\Services\AiRiskAnomalyDetectionService();
        $result = $service->detectAnomalies();
        $this->assertEquals(0, $result['anomalies_detected']);
    }
}
