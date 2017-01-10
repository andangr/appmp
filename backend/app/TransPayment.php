<?php

namespace onestopcore;

use Illuminate\Database\Eloquent\Model;

class TransPayment extends Model
{
    //

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'trans_payment';
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
}
