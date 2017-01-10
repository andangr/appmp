<?php

namespace onestopcore\Http\Controllers\Api;

use Illuminate\Http\Request;
use DB;
use onestopcore\SubCategory;
use onestopcore\Http\Controllers\Controller;

class ApiSubCategoryController extends Controller
{
    /**
     * Show all Categories.
     * 
     * @return Response
     */
    public function index(){

        $aData = array();

        $aData = SubCategory::all();
        
        $response = $this->__generateListOptions($aData);
        
        return $response;
    }

    private function __generateListOptions($aData){

        $response = array(
                'code' => 404,
                'message' => 'No Sub Category Found',
                'data' => []
            );
        $aResponse = array();
        if($aData){
            
            foreach ($aData as $key => $value) {
                $aResponse[$key]['id'] = $value['id'];
                $aResponse[$key]['text'] = $value['name'];
            }

            $response = array(
                'code' => 200,
                'message' => 'Data Subcategory success loaded',
                'data' => $aResponse
            );

            return $response;
        }
        return $response;
    }

    /**
     * Show all Subcategories by cat id.
     * 
     * @return Response
     */
    public function getByCatId($id){

        $aData = array();

        $aData = SubCategory::where('category_id', $id)
                            ->get();
        //where('category_id', $id); where($column , '=', $id)->first();
        
        $response = $this->__generateListOptions($aData);
        
        return $response;
    }


}
