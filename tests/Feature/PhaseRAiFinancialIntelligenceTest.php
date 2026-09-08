<?php
namespace Tests\Feature;
use Tests\TestCase;
class PhaseRAiFinancialIntelligenceTest extends TestCase {
    public function test_ai_analyzes_revenue() {
        $service = new \App\Services\AiFinancialIntelligenceService();
        $result = $service->analyzeRevenue();
        $this->assertEquals(10000, $result['expected_collection']);
    }
}
