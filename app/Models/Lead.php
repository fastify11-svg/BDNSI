<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'source',
        'team_id',
        'center_id',
        'status',
        'notes',
        'follow_up_date',
        'created_by',
    ];

    protected $casts = [
        'follow_up_date' => 'date',
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
