<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_PARTIALLY_PAID = 'partially_paid';
    public const STATUS_PAID = 'paid';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'center_id',
        'order_number',
        'total_amount',
        'discount_amount',
        'payable_amount',
        'paid_amount',
        'due_amount',
        'status',
    ];

    public function center()
    {
        return $this->belongsTo(Center::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function transactions()
    {
        return $this->morphMany(Transaction::class, 'payable');
    }
}
