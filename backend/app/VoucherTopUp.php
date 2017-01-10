<?php

namespace onestopcore;

use Illuminate\Database\Eloquent\Model;

class VoucherTopUp extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'top_up_voucher';
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
}
