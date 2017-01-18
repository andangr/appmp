<?php

namespace onestopcore;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_image';

    protected $fillable = [
        'id',
        'product_id',
        'image_url',
        'image',
        'image_type_id'
    ];


    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the product that owns the comment.
     */
    public function product()
    {
        return $this->belongsTo('onestopcore\Product');
    }
}
