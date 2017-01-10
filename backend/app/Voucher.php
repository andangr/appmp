<?php

namespace onestopcore;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'voucher';
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
}
