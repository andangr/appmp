<?php

namespace onestopcore\Http\Controllers\Api;

use Illuminate\Http\Request;
use DB;
use onestopcore\PaymentMethod;
use onestopcore\TransPayment;
use onestopcore\Http\Controllers\Controller;

class ApiPaymentMethodController extends Controller
{
   /**
     * Show all payment.
     * 
     * @return Response
     */
    public function index(){

        $paymentmethods = PaymentMethod::all();
        $data = array();
        $i=0;

        return $paymentmethods;
    }
    
   


}
