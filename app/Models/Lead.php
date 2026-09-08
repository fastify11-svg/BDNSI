<?php

namespace App\Models;

use App\Scopes\CenterScope;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{

    protected static function booted()
    {
        static::addGlobalScope(new CenterScope);
    }

    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'source',
        'team_id',
        'center_id',
        'status',
        'proposed_price',
        'last_contacted_at',
        'notes',
        'follow_up_date',
        'created_by',
    ];

    protected $casts = [
        'follow_up_date' => 'date',
        'last_contacted_at' => 'datetime',
        'proposed_price' => 'float',
    ];

    /**
     * The sales team assigned to this lead.
     */
    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * The center this lead was converted to (nullable until converted).
     */
    public function center()
    {
        return $this->belongsTo(Center::class);
    }

    /**
     * The admin/agent who created this lead.
     */
    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * Valid lead status transitions.
     */
    public static array $statuses = [
        'New', 'Contacted', 'Negotiating', 'Converted', 'Lost', 'Follow-up',
    ];
}

