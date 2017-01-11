<?php

namespace onestopcore\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use DB;
use onestopcore\Product;
use onestopcore\ProductImage;
use onestopcore\Prdposition;
use onestopcore\Category;
use onestopcore\SubCategory;
use onestopcore\Http\Controllers\Controller;

class ApiHomeController extends Controller
{
    /**
     * Show all products.
     * 
     * @return Response
     */
    public function getHome(){

        $categories = Category::all();
        foreach($categories as $category){

            $products = Product::where('category_id', $category->id)->get();
            foreach($products as $product){
                $images = $product->images;
                $positions = $product->positions;
                $subcategory =  $product->subcategory;
            }
            $category->products = $products;
        }

        return $categories;

        $products = Product::all();
        $data = array();
        $i=0;

        if($products){
            foreach($products as $product){
                $data[$i]['product'] = $product;
                $data[$i]['images'] = $product->images;
                $i++;
            }
        }
        return $products;
    }
}