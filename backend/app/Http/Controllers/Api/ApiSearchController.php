<?php

namespace onestopcore\Http\Controllers\Api;

use Illuminate\Http\Request;
use onestopcore\Http\Controllers\Controller;
use onestopcore\Product;
use onestopcore\Category;

class ApiSearchController extends Controller
{

	public function getCategories() {
		$categories = Category::orderBy('id', 'ASC')->get();

		return $categories;
	}

    public function search(Request $request) {
    	$category_id = $request->get('category_id');
    	$keywords = $request->get('keywords');

    	\Log::info($request->all());

    	/*$results = Product::where('category_id', '=', $category_id)->where('product_name', 'like', '%'.$keywords.'%')->with('images')->get();*/

    	$results = Product::where('category_id', '=', $category_id)->where(function($query) use ($keywords) {
    		$query->where('product_name', 'ilike', '%'.$keywords.'%');
    		$query->orWhere('description', 'ilike', '%'.$keywords.'%');
    	})->with('images')->get();

    	return $results;

    }
}
