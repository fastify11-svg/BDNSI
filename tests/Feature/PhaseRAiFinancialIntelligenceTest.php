<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PhaseRAiFinancialIntelligenceTest extends TestCase {
    use RefreshDatabase;
    public function test_ai_analyzes_revenue() {
        $service = new \App\Services\AiFinancialIntelligenceService();
        $result = $service->analyzeRevenue();
        $this->assertEquals(10000, $result['expected_collection']);
    }
}
