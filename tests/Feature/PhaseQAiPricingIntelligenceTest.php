<?php
namespace Tests\Feature;
use Tests\TestCase;
class PhaseQAiPricingIntelligenceTest extends TestCase {
    public function test_ai_suggests_price() {
        $service = new \App\Services\AiPricingIntelligenceService();
        $result = $service->suggestPrice(null, null);
        $this->assertEquals(500, $result['suggested_price']);
    }
}
