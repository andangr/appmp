<?php

namespace onestopcore\Http\Controllers\Lib\Payment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use onestopcore\PaymentMethod;
use onestopcore\Product;
use onestopcore\Voucher;
use onestopcore\Balance;
use onestopcore\TransPayment;
use onestopcore\Http\Controllers\Controller;
Use onestopcore\Http\Controllers\Lib\Payment\Payment;

class TransactionData extends Payment
{
   public $product_id;
   public $product_name;
   public $image;
   public $price;
   public $payment_method;
   public $payment_method_name;
   public $voucher_code;
   public $voucher_name = "";
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
        $this->voucher_name = $voucherData['name'];
        $this->disc = $voucherData['disc'];

        $trans_payment = TransPayment::where([
                                        ['voucher_code', '=', $this->voucher_code],
                                        ['user_id', '=', $this->user_id],
                                        ['status', '=', 1]
                                    ])->get();

        $transCount = count($trans_payment);
        $startdate = date("YmdHis", strtotime($voucherData->start_date));
        $enddate = date("YmdHis", strtotime($voucherData->end_date));
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
                        'start_date' => $startdate,
                        'enddate' => $enddate,
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

    public function _balancePaymentAction(){
        
        $balanceData = Balance::where('user_id', $this->user_id)->firstOrFail();
        
        $leftBalance = $balanceData->balance - $this->price;
        
        if($leftBalance < 0){

            $response = array (
                'code' => '2001',
                'error' => true,
                'message'   => 'Insuficient Balance',
                'currentBalance' => $balanceData->balance,
                'price' => $this->price,
                'leftBalance' => $leftBalance
            );

        } else {
            $datenow = new \DateTime("now");
            $balanceData->last_balance = $balanceData->balance;
            $balanceData->balance = $leftBalance;
            $balanceData->last_usage = $datenow;
            
            $status_payment =  '1';

            $token = $this->_generateToken($this->product_id);
            $token_download = $this->_savePaymentTransaction($token);

            $trans_payment = TransPayment::where('token', $token)->firstOrFail();

            $trans_payment->status = $status_payment;
            
            $trans_payment->save();
            $balanceData->save();
            
            $response = array (
                'code' => '0000',
                'error' => false,
                'message'   => 'Payment Success',
                'urlredirect' => $this->_generateUrlBalanceDone($token)
            );
        }

        return $response;


    }

    private function _generateUrlBalanceDone($token){
        $baseDomain = config('backend.url');
        $response = $baseDomain.'/donebalance?token='.$token;

        return $response;
    }

    protected function _generateToken($id){
        $secretKey = "kataspec1aL";
        $datetime  = date('ymdhis', time());

        $hash = md5($id.$secretKey.$datetime);

        return $hash;
    }

    /**
    * @return int
    */
    protected function _getNextStatementId($table)
    {
        $next_id = \DB::select("select nextval('".$table."')");
        return intval($next_id['0']->nextval);
    }

    protected function _savePaymentTransaction($token){

        
        $trans_payment = new TransPayment;
        $datenow = new \DateTime("now");
        $next_id = $this->_getNextStatementId('balance_id_seq');
        $token_download = $this->_generateToken($this->product_id);
        $trans_payment->id = $next_id;
        $trans_payment->detail_id = $this->product_id;
        $trans_payment->price = $this->price ;
        $trans_payment->payment_method = $this->payment_method;
        $trans_payment->payment_target = $this->payment_target;
        $trans_payment->created = $datenow;
        $trans_payment->user_id = $this->user_id;
        $trans_payment->trans_id = 0;
        $trans_payment->voucher_code =  (!empty($this->voucher_code)) ? $this->voucher_code : '' ;
        $trans_payment->urldownload = ($this->payment_target == '01') ? $this->urldownload : '' ; //=========================================
        $trans_payment->url_callback = $this->url_callback;
        $trans_payment->status = 0;
        $trans_payment->token = $token;
        $trans_payment->save();

         return $token;
    }

    protected function _createPaypalPaymentPaypal(){

        $payer = Paypalpayment::Payer();
        $payer->setPaymentMethod("paypal");

        $item1 = Paypalpayment::Item();
        $item1->setName('Ground Coffee 40 oz')
                ->setDescription('Ground Coffee 40 oz')
                ->setCurrency('USD')
                ->setQuantity(1)
                ->setTax(0.3)
                ->setPrice(7.50);

        $itemList = Paypalpayment::ItemList();
        $itemList->setItems(array($item1));

        $details = Paypalpayment::Details();
        $details->setShipping('1.2')
                ->setTax('1.3')
                //total of items prices
                ->setSubtotal('8.50');


        $amount = Paypalpayment:: Amount();
        $amount->setCurrency("USD");
        $amount->setTotal("7.50");

        $transaction = Paypalpayment:: Transaction();
        $transaction->setAmount($amount);
        $transaction->setItemList($itemList);
        $transaction->setDescription("This is the payment description.");

        $baseUrl = "http://172.19.16.156:8000";
        $redirectUrls = Paypalpayment:: RedirectUrls();
        $redirectUrls->setReturnUrl("{$baseUrl}/paymentpaypal/callback?success=true")
                ->setCancelUrl("{$baseUrl}/paymentpaypal/callback?success=false");

        $payment = Paypalpayment:: Payment();
        $payment->setIntent("sale");
        $payment->setPayer($payer);
        $payment->setRedirectUrls($redirectUrls);
        $payment->setTransactions(array($transaction));


        $createPayment = $payment->create($this->_apiContext);

        //set the trasaction id , make sure $_paymentId var is set within your class
        $this->_paymentId = $createPayment->id;

        //dump the repose data when create the payment
        $redirectUrl = $createPayment->links[1]->href;
        $query = $this->_getQueryString($redirectUrl);
        
        $aData = array(
                'urlredirect' => $redirectUrl,
                'payment_id' => $payment->getId(),
                'token' => $query['token']
                );

        return $aData;
    }
}
