<?php

namespace App\Services;

use App\Models\Price;

class PricingService
{
    /**
     * Resolve the final price for a given product and center.
     *
     * @param string $productType
     * @param int|null $centerId
     * @return array ['base_price' => float, 'discount' => float, 'final_price' => float]
     */
    public function resolvePrice(string $productType, ?int $centerId = null): array
    {
        // 1. Try to find a center-specific active price
        if ($centerId) {
            $centerPrice = Price::where('center_id', $centerId)
                ->where('product_type', $productType)
                ->where('status', true)
                ->where(function ($query) {
                    $query->whereNull('effective_from')
                          ->orWhere('effective_from', '<=', now()->toDateString());
                })
                ->orderBy('effective_from', 'desc')
                ->first();

            if ($centerPrice) {
                return $this->formatPrice($centerPrice);
            }
        }

        // 2. Fall back to default system price
        $defaultPrice = Price::whereNull('center_id')
            ->where('product_type', $productType)
            ->where('status', true)
            ->where(function ($query) {
                $query->whereNull('effective_from')
                      ->orWhere('effective_from', '<=', now()->toDateString());
            })
            ->orderBy('effective_from', 'desc')
            ->first();

        if ($defaultPrice) {
            return $this->formatPrice($defaultPrice);
        }

        // 3. Absolute fallback if no prices are configured at all
        return [
            'base_price' => 0.00,
            'discount' => 0.00,
            'final_price' => 0.00
        ];
    }

    private function formatPrice(Price $price): array
    {
        $base = (float) $price->base_price;
        $discount = (float) $price->discount;
        return [
            'base_price' => $base,
            'discount' => $discount,
            'final_price' => max(0, $base - $discount)
        ];
    }
}
