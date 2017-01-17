<?php

namespace onestopcore;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model {

    protected $table = 'voucher';
    public $timestamps = false;
    protected $fillable = [
        'id', 'code', 'name', 'start_date', 'end_date', 'max_claim', 'target_type', 'is_active', 'disc', 'created_at', 'updated_at',
    ];
}
