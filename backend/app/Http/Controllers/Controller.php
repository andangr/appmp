<?php

namespace onestopcore\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function successResponse($message, $data = null){
        $response = array(
            'code' => 200,
            'message' => $message
        );
        
        if($data){
            $response['data'] = $data;
        }

        return $response;
    }
}
