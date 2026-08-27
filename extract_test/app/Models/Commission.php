<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    use HasFactory;

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
