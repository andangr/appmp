<?php

namespace onestopcore;

use Illuminate\Database\Eloquent\Model;

class Balance extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'balance';
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
}
