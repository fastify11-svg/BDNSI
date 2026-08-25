<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateCertificateAssets implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $result;

    public function __construct(\App\Models\Result $result)
    {
        $this->result = $result;
    }

    public function handle(
        \App\Services\CertificateGenerationService $generationService
    ) {
        $generationService->generateCertificateSerial($this->result);
    }
}
