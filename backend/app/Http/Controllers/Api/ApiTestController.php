<?php

namespace onestopcore\Http\Controllers\Api;

use Illuminate\Http\Request;
use DB;
use onestopcore\UserSurya;
use onestopcore\Http\Controllers\Controller;

class ApiTestController extends Controller
{
    /**
     * Show all products.
     * 
     * @return Response
     */
    public function index(){
        
        if(DB::connection()->getDatabaseName())
        {
            echo "connected successfully to database ".DB::connection()->getDatabaseName();
        }
    }
}
