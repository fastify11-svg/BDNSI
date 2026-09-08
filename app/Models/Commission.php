<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_id',
        'order_id',
        'transaction_id',
        'commission_policy_id',
        'calculated_revenue',
        'amount',
        'status',
    ];

    const STATUS_PENDING = 'Pending';
    const STATUS_EARNED = 'Earned';
    const STATUS_APPROVED = 'Approved';
    const STATUS_PAID = 'Paid';
    const STATUS_CANCELLED = 'Cancelled';
    const STATUS_REVERSED = 'Reversed';

    public function scopeEarned($query)
    {
        return $query->where('status', self::STATUS_EARNED);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopePaid($query)
    {
        return $query->where('status', self::STATUS_PAID);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function policy()
    {
        return $this->belongsTo(CommissionPolicy::class, 'commission_policy_id');
    }
}
