<?php

namespace onestopcore\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use DB;
use onestopcore\PaymentMethod;
use onestopcore\TransPayment;
use onestopcore\Product;
use onestopcore\Http\Controllers\Controller;

class ApiProductDownloadController extends Controller
{

    public function testt(Request $request){
        return $request->id;
    }

    /**
    * generate download url
     * @param Request $request
     */
    public function generateDownloadUrl(Request $request){
        $url = '';
        $response = array(
                    'code' => 400,
                    'downloadurl' => $url
                );
        
        $getid = $request->input('id');;
        $id = (int)$getid;
        $token = $request->input('token');
        
        
        if($this->_isValidToken($token)){
            $params = array(
                    'id' => $id,
                    'token' => $token
                );

            $url = 'http://172.19.16.156:8000/product/download?'.http_build_query($params);

            $response = array(
                    'code' => 200,
                    'downloadurl' => $url
                );

            return $response;
        }

        return $response;
    }

    protected function _isValidToken($token){
        $transactionData = TransPayment::where('token',$token)
                                        ->first();

        $max = $transactionData['max'];
        $times = $transactionData['times_download'];

        if($times < $max){
            return true;
        }
        return true;

    }

    /**
    * Get product (download)
     * 
     * @param Request $request
     *
     */
    public function downloadAction(Request $request){

        $getid = $request->input('id');
        $id = (int)$getid;
        $sToken = $request->input('token');
        $aToken = explode('?', $sToken);
        $token = $aToken[0];

        

        $product = Product::find($id);

        $url = $product->urldownload;    //'http://www.example.com/path/somefile.ext';
        

        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_HEADER, true); 
        curl_setopt($ch, CURLOPT_NOBODY, true); // make it a HEAD request
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); 
        curl_setopt($ch, CURLOPT_URL, $url); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE); 

        $head = curl_exec($ch);
        
        $mimeType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        $size = curl_getinfo($ch, CURLINFO_CONTENT_LENGTH_DOWNLOAD);
        $path = parse_url($url, PHP_URL_PATH);
        $filename = substr($path, strrpos($path, '/') + 1);
        
        curl_close($ch); 

        header('Content-Type: '.$mimeType);
        header('Access-Control-Allow-Origin: *');
        header('Content-Disposition: attachment; filename="'.$filename. '";' );
        header('Content-Length: '.$size);

        $transactionData = TransPayment::where('token', $token)
                                        ->first();
        
        $currentTimes = $transactionData->times_download;
        $newTimes = $currentTimes+1;
        $transactionData->times_download = $newTimes;
        $transactionData->save();
        
        return readfile($url);
    }

}
