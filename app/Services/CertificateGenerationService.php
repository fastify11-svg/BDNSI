<?php

namespace App\Services;

use App\Models\Result;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CertificateGenerationService
{
    /**
     * Generate a unique certificate serial and associate it with a result.
     * This method is idempotent.
     */
    public function generateCertificateSerial(Result $result)
    {
        if ($result->certificate_serial) {
            return $result; // Idempotency
        }

        return DB::transaction(function () use ($result) {
            do {
                $serial = strtoupper(Str::random(10));
            } while (Result::withoutGlobalScopes()->where('certificate_serial', $serial)->exists());

            $result->certificate_serial = $serial;
            // $result->qr_code_path = $this->generateQrCode($serial); // Placeholder for G7
            $result->save();

            return $result;
        });
    }
}
