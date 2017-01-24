<?php

namespace onestopcore\Http\Controllers\Lib\Payment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use onestopcore\PaymentMethod;
use onestopcore\Product;
use onestopcore\Voucher;
use onestopcore\TransPayment;
use onestopcore\Http\Controllers\Controller;

class TransactionData extends Controller
{
   public $product_id;
   public $product_name;
   public $image;
   public $price;
   public $payment_method;
   public $payment_method_name;
   public $voucher_code;
   public $voucher_name;
   public $disc = 0;
   public $total_amount;
   public $currency;
   public $payment_target;
   public $url_callback;
   public $max = 3;
   public $status;
   public $user_id;
   public $token;
   public $times_download;
   public $detail_id;
   public $trans_id;
   public $urldownload;

   public function getDetailsData(){
        
        switch ($this->payment_target) {
            case '01':
                $product = array();
                try {

                    $product = Product::findOrFail($this->product_id);
                    $getImage = $product->images;

                    /* assigning variable */

                    $this->product_name = $product['product_name'];
                    $this->price = $product['price'];
                    $this->urldownload = $product['urldownload'];
                    $this->image = $product->images[0]->image_url;
                    $this->user_id = Auth::user()->id;
                    $this->payment_method_name = $this->_getPaymentMethodName();

                    $response = array(
                        'error' => false,
                        'product' => $product
                    );
                    
                } catch ( ModelNotFoundException $ex ) {
                    $response = array(
                        'error' => true,
                        'message' => $ex->getMessage(),
                    );
                } 

                break;
            case '02':
                $response = VoucherTopUp::findOrFail($id);
                break;
        }
        return $response;
    }

    public function normalizePrice(){

        $this->currency = 'IDR';
        $price = $this->price;
        if($this->payment_method == '01'){
            $price = $this->_convertPrice();
            $this->currency = 'USD';
        }
        
        if(!empty($this->voucher_code)){
            
            $voucherData = $this->_validateVoucher();
            if($voucherData['error']){
                return $voucherData;
            }
            
            $discData = $voucherData['data']->disc;
            $disc = $price * $discData / 100;

            $price = $price - $disc;
            
        }

        $this->total_amount = $price;

        return array( 
                    'code' => 200,
                    'error' => false,
                    'price' => $price,

                );
    }
    protected function _convertPrice(){

        if($this->price == 0){
            return 0.00;
        }

        /*$dataCurrency = $this->httpGet('http://www.apilayer.net/api/live?access_key=3f822d3be55448c63d82e90b9c765d27&currencies=IDR');
        $oDataCurrency = json_decode($dataCurrency);
        $exchangRate = (array)$oDataCurrency->quotes;*/
        $idrRate = 13290; //$exchangRate['USDIDR']; //

        $usd = $this->price / $idrRate;

        return number_format((float)$usd, 2, '.', '');
    }

    protected function _getVoucherDetails(){
        try {
            $voucherData = Voucher::where('code', $this->voucher_code)->firstOrFail();
        } catch ( ModelNotFoundException $ex ) {
            $response = array(
                'error' => true,
                'message' => $ex->getMessage(),
            );
            return $response;
        }
        return array(
                'error' => false,
                'data' => $voucherData,
            );;
    }
    
    protected function _validateVoucher(){

        $voucherData = $this->_getVoucherDetails();
        if($voucherData['error']){
            return $voucherData;
        }
        
        $voucherData = $voucherData['data'];
        $this->voucher_name = $voucherData['nama'];
        $this->disc = $voucherData['disc'];

        $trans_payment = TransPayment::where([
                                        ['voucher_code', '=', $this->voucher_code],
                                        ['user_id', '=', $this->user_id],
                                        ['status', '=', 1]
                                    ])->get();

        $transCount = count($trans_payment);
        $startdate = strtotime($voucherData->start_date)->format('YmdHis');
        $enddate = $voucherData->end_date->format('YmdHis');
        $datenow = new \DateTime("now");
        $now = $datenow->format('YmdHis');

        if(empty($voucherData)){
            return array( 
                    'error' => true,
                    'message' => 'Invalid Voucher Code'
                );
        } elseif($now > $enddate){
            return array( 
                    'error' => true,
                    'message' => 'Expired Voucher Code'
                );
        }elseif($now < $startdate){
            return array( 
                    'error' => true,
                    'message' => 'Voucher Code id Not Ready Yet.'
                );
        }elseif($transCount > $voucherData->max_claim){
            return array( 
                    'error' => true,
                    'message' => 'You reach maximum number to claim this Voucher.'
                );
        }elseif($now > $startdate && $now < $enddate && $transCount < $voucherData->max_claim) {
            return array( 
                        'error' => false,
                        'data' => $voucherData,
                        'trans_payment' => $transCount
                );
        }else{
            return array( 
                    'error' => true,
                    'message' => 'You got some error. Please ask Administrator about this issue'
                );
        }
    }
    private function _getPaymentMethodName(){
        $pm = PaymentMethod::where('code', $this->payment_method)
                            ->first();
        return $pm['name'];
    }
}
