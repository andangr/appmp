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
    }

    /**
     * Show all products in specific category.
     * 
     * @return Response
     */
    public function getCategoryProducts($id, $page = 0){

        $subcategories = SubCategory::where('category_id', $id)->get();

        foreach($subcategories as $subcategory){

            $products = Product::where('sub_category_id', $subcategory->id)->get();
            foreach($products as $product){
                $images = $product->images;
                $positions = $product->positions;
                //$subcategory =  $product->subcategory;
            }
            $subcategory->products = $products;
        }

        return $subcategories;
    }
}