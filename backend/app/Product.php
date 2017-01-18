<?php

namespace onestopcore;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product';
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    protected $fillable = [
        'id', 
        'product_name', 
        'package_code', 
        'price', 
        'description', 
        'compatibility', 
        'urldownload', 
        'status', 
        'created', 
        'category_id', 
        'sub_category_id', 
        'is_active'
    ];

    /**
     * Get the images.
     */
    public function images()
    {
        return $this->hasMany('onestopcore\ProductImage');
    }
}
