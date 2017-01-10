<?php

namespace onestopcore\Http\Controllers\Api;

use Illuminate\Http\Request;
use DB;
use onestopcore\Category;
use onestopcore\Http\Controllers\Controller;

class ApiCategoryController extends Controller
{
    /**
     * Show all Categories.
     * 
     * @return Response
     */
    public function index(){

        $aData = array();
        $response = array(
                'code' => 404,
                'message' => 'No Category Found',
                'data' => []
            );

        $aData = Category::all();
        
        $i=0;

        if($aData){
            
            foreach ($aData as $key => $value) {
                $aResponse[$key]['id'] = $value['id'];
                $aResponse[$key]['text'] = $value['name'];
            }

            $response = array(
                'code' => 200,
                'message' => 'Data category success loaded',
                'data' => $aResponse
            );

            return $response;
        }

        
        return $response;
    }
}
