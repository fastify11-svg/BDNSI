<?php
namespace Tests\Feature;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PhasePAiSalesIntelligenceTest extends TestCase {
    use RefreshDatabase;
    public function test_ai_scores_lead() {
        $service = new \App\Services\AiSalesIntelligenceService();
        $result = $service->scoreLead(null);
        $this->assertEquals(85, $result['score']);
    }
}
