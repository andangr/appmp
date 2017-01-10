<?php

namespace onestopcore\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Paypalpayment;
use onestopcore\VoucherTopUp;
use onestopcore\PaymentMethod;
use onestopcore\Product;
use onestopcore\TransPayment;

class PaymentPaypalController extends Controller
{
    /**
     * object to authenticate the call.
     * @param object $_apiContext
     */
    private $_apiContext;

    /*
     *   These construct set the SDK configuration dynamiclly,
     *   If you want to pick your configuration from the sdk_config.ini file
     *   make sure to update you configuration there then grape the credentials using this code :
     *   $this->_cred= Paypalpayment::OAuthTokenCredential();
    */
    public function __construct()
    {

        // ### Api Context
        // Pass in a `ApiContext` object to authenticate
        // the call. You can also send a unique request id
        // (that ensures idempotency). The SDK generates
        // a request id if you do not pass one explicitly.

        $this->_apiContext = Paypalpayment::ApiContext(config('paypal_payment.Account.ClientId'), 
                            config('paypal_payment.Account.ClientSecret'));

    }

    /*
        Use this call to get a list of payments. 
        url:payment/
    */
    public function index()
    {
        echo "<pre>";

        $payments = Paypalpayment::getAll(array('count' => 1, 'start_index' => 0), $this->_apiContext);

        return (array) json_decode($payments);

        dd($payments);
    }

    /*
        Use this call to get details about payments that have not completed, 
        such as payments that are created and approved, or if a payment has failed.
        url:payment/PAY-3B7201824D767003LKHZSVOA
    */

    public function show($payment_id)
    {
       $payment = Paypalpayment::getById($payment_id,$this->_apiContext);

       return (array) json_decode($payment);

       dd($payment);
    }


    public function create(Request $request)
    {
        $response = array (
                'code' => '2002',
                'message'   => 'Invalid parameter.'
            );

            
        $mandatoryParams = array('id', 'return_url', 'pm_code', 'target');
        
        $validParams = $this->_validateParameters($request->all(), $mandatoryParams);
        if ($validParams == 0){
            return $response;
        }

        $id = $request->input('id');
        $pmcode = $request->input('pm_code');
        $target = $request->input('target');
        $voucherCode = $request->input('vouchercode');
        $returnUrl = $request->input('return_url');

        if($target !== '02'){
            $id = (int)$id;            
        }

        $detailsData = $this->_getDetailsData($target, $id);
        if(!$detailsData){
            return $response;
        }

        if(!empty($voucherCode)){
            $voucherData = '';
            // = $this->_getVoucherDetails($voucherCode);
             //if($voucherData['code'] !== 200){

                //return $voucherData;
             //}
        }
         
        $aImagesData = $detailsData['images'];
        if(!empty($aImagesData)){
            $image = $aImagesData[0];
        }
        
        $price = $this->_normalizePrice($detailsData['product']['price'], $pmcode, $voucherCode);
        
            
            $aData = $this->_createPaypalPayment();
            $token = $aData['token'];
            $paymentId = $aData['payment_id'];
            $this->_savePaymentTransaction(
                    $detailsData['product'], 
                    $returnUrl, 
                    $id, 
                    $pmcode, 
                    $token,
                    $paymentId,
                    $target, 
                    $price['price'],
                    $voucherCode,
                    $request
                );   
            //save transaction
            $paymentData = Paypalpayment::getById($aData['payment_id'], $this->_apiContext);

            $redirectUrl = $aData['urlredirect'];
       
            
            $response = array (
                'code' => '0000',
                'message'   => 'Success Create Payment.',
                'urlredirect' => $redirectUrl,
                'token' =>  $aData['token'],
                'transactionData' => (array) json_decode($paymentData)
                
            );

            return $response;
    }

    protected function _createPaypalPayment(){

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

    protected function _getQueryString($url)
    {
        $parts = parse_url($url);
        parse_str($parts['query'], $query);

        return $query;
    }

    protected function _savePaymentTransaction($detailsData, $returnUrl, $detailsId, $pmCode, $token, $paymentId, $target, $price, $voucherCode, Request $request){

        
        $user = $request->user();
        $userid = $user['id'];
        $id = $this->getNextStatementId();

        $trans_payment = new TransPayment;
        $datenow = new \DateTime("now");
        $token_download = $this->_generateToken($detailsData['id']);
        $trans_payment->id=$id;
        $trans_payment->detail_id = $detailsId;
        $trans_payment->price = $price ;
        $trans_payment->payment_method = $pmCode;
        $trans_payment->payment_target = $target;
        $trans_payment->created = $datenow;
        $trans_payment->user_id = $userid;
        $trans_payment->trans_id = $paymentId;
        $trans_payment->voucher_code = (!empty($voucherCode)) ? $voucherCode : '' ;
        $trans_payment->urldownload = ($target == '01') ? $detailsData['getUrldownload'] : '' ; 
        $trans_payment->url_callback=$returnUrl;
        $trans_payment->status=0;
        $trans_payment->token = $token;
        $trans_payment->save();



         return $token;
    }

    /**
    * @return int
    */
    protected function getNextStatementId()
    {
        $next_id = \DB::select("select nextval('voucher_id_seq')");
        return intval($next_id['0']->nextval);
    }

    protected function _generateToken($id){
        $secretKey = "kataspec1aL";
        $datetime  = date('ymdhis', time());

        $hash = md5($id.$secretKey.$datetime);

        return $hash;
    }

    /*
    * payment response
    * @param  Request $request
    */
    public function paymentResponse(Request $request){
        $input = $request->all();


        $statusPayment = $input['success'];
        /*$payer_id = $input['PayerID'];
        $token = $input['token'];
        $paymentId = $input['paymentId'];
        */
        if($statusPayment == "true" ){
            $this->getConfirmpayment($input);
        }else  {
            $this->getCancelpayment($input);
        }

        //return array( $statusPayment);


    }
    /*
    * Confirmed Payment
    */
    public function getConfirmpayment($input)
    {
        //$payer_id = Input::get('PayerID');
        $payer_id = $input['PayerID'];
        $token = $input['token'];
        $paymentId = $input['paymentId'];
        
        $payment = Paypalpayment::getById($paymentId, $this->_apiContext);

        $paymentExecution = Paypalpayment::PaymentExecution();

        $paymentExecution->setPayerId( $payer_id );

        $trans_payment = TransPayment::where('token', $token)
                                        ->first();
        
        try{
        
            $executePayment = $payment->execute($paymentExecution, $this->_apiContext);
        } 
        catch(\Exception $e){
        
            
            if($trans_payment->status == 0){
                $trans_payment->status = -1;
                $trans_payment->save();
            }
            $returnUrl = $trans_payment->url_callback;

            $returnUrl .= '?success=false&status=failed&token='.$trans_payment->token;
            
            header('Location: '.$returnUrl);
            exit;
        }

        $trans_payment->status = 1;
        $trans_payment->save();

        $returnUrl = $trans_payment->url_callback;

        $returnUrl .= '?success=true&status=success&token='.$trans_payment->token;
        
        header('Location: '.$returnUrl); 
        exit;
        
    }

    public function getCancelpayment($input)
    {
        $token = $input['token'];

        $trans_payment = TransPayment::where('token', $token)
                                        ->first();
        
        if($trans_payment->status == 0){
            $trans_payment->status = -1;
            $trans_payment->save();
        }
        $returnUrl = $trans_payment->url_callback;

        $returnUrl .= '?success=false&status=cancelled&token='.$trans_payment->token;
        
        header('Location: '.$returnUrl);
        exit;
    }

    /**
    * Post product pm
     * @return array
     * @param Request $request
     *
     */
    public function createSumaryAction(Request $request) 
    {
        $response = array (
                'code' => '2002',
                'message'   => 'Invalid parameter.'
            );

        $input = $request->input();

        $mandatoryParams = array('id', 'return_url', 'pm_code', 'target');
        
        $validParams = $this->_validateParameters($request->input(), $mandatoryParams);
        if ($validParams == 0){
            return $response;
        }

        $id = $request->input('id');
        $pmcode = $request->input('pm_code');
        $target = $request->input('target');
        $voucherCode = $request->input('vouchercode');
        $returnUrl = $request->input('return_url');

        if($target !== '02'){
            $id = (int)$id;            
        }

        $detailsData = $this->_getDetailsData($target, $id);
        
        if(!$detailsData){
            return $response;
        }

        if(!empty($voucherCode)){
            $voucherData = '';
            // = $this->_getVoucherDetails($voucherCode);
             //if($voucherData['code'] !== 200){

                //return $voucherData;
             //}
        }
         
        $aImagesData = $detailsData['images'];
	
        if(!empty($aImagesData)){
            $image = $aImagesData[0];
        }
        
        $price = $this->_normalizePrice($detailsData['product']['price'], $pmcode, $voucherCode);
        

        $aDataResponse = array(
                'image' => $image['image_url'],
		        'product_id' => $id,
                'product_name' => $detailsData['product']['product_name'],
                'price' => $detailsData['product']['price'],
                'payment_method' => $this->_getPaymentMethodName($pmcode),
		        'paymentcode' => $pmcode,
                'voucher_code' => $voucherCode,
                'voucher_name' => (!empty($voucherCode)) ? $voucherData['data']->getName() : '',
                'disc' => (!empty($voucherCode)) ? $voucherData['data']->getDisc() : '0',
                'total_amount' => $price['price'],
                'currency' => ($pmcode=='01') ? 'USD' : 'IDR',
            );
	
        $response = array (
                'code' => '200',
                'message'   => 'Get sumary payment success.',
                'data' => $aDataResponse

            );

        return $response;
    }

    protected function _validateParameters($params, $mandatoryParams){
        $aData = array();
        $listParams = array();
        if($params){
            foreach($params as $key => $val){
                $aData[$key] = $val;
                array_push($listParams, $key);
            }
        }else{
            return 0;
        }

        foreach($mandatoryParams as $val){
            if(in_array($val, $listParams)){
                
                if(!$aData[$val]){
                    return 0;
                }
            }else{
                return 0;
            }
        }

        return $aData;
    }

    protected function _getDetailsData($target, $id){
        if($target){
            switch ($target) {
                case '01':

                    $product = array();
                    $product = Product::find($id);
                    
                    $details = array(
                        'product' => $product,
                        'images' => $product->images
                    );

                    break;

                case '02':
                    $details = VoucherTopUp::find($id); 
                    
                    break;
            }
            return $details;
        }else{
            return false;
        }
        

        
    }

    protected function _normalizePrice($price, $pmcode, $voucherCode){

        if($pmcode == '01'){
            $price = $this->_convertPrice($price);
        }
        /*
        if(!empty($voucherCode)){
            
            $voucherData = $this->_getVoucherDetails($voucherCode);
            if($voucherData['code'] == 200){
                $discData = $voucherData['data']->getDisc();
                $disc = $price * $discData / 100;

                $price = $price - $disc;

            }else{

                return $voucherData;

            }
            
        }*/

        return array( 
                        'code' => 200,
                        'message' => 'Normalize price success',
                        'price' => $price,

                    );
    }

    protected function _convertPrice($price){

        if($price == 0){
            return 0.00;
        }

        //$dataCurrency = $this->httpGet('http://www.apilayer.net/api/live?access_key=3f822d3be55448c63d82e90b9c765d27&currencies=IDR');
        //$oDataCurrency = json_decode($dataCurrency);
        //$exchangRate = (array)$oDataCurrency->quotes;
        $idrRate = 13290; //$exchangRate['USDIDR'];

        $usd = $price / $idrRate;

        return number_format((float)$usd, 2, '.', '');
    }

    private function _getPaymentMethodName($code){
        $pm = PaymentMethod::where('code', $code)
                            ->first();
        return $pm['name'];
    }

    
    /*
    * Process payment using credit card
    */
    public function store_cc()
    {
        // ### Address
        // Base Address object used as shipping or billing
        // address in a payment. [Optional]
        $addr= Paypalpayment::address();
        $addr->setLine1("3909 Witmer Road");
        $addr->setLine2("Niagara Falls");
        $addr->setCity("Niagara Falls");
        $addr->setState("NY");
        $addr->setPostalCode("14305");
        $addr->setCountryCode("US");
        $addr->setPhone("716-298-1822");

        // ### CreditCard
        $card = Paypalpayment::creditCard();
        $card->setType("visa")
            ->setNumber("4758411877817150")
            ->setExpireMonth("05")
            ->setExpireYear("2019")
            ->setCvv2("456")
            ->setFirstName("Joe")
            ->setLastName("Shopper");

        // ### FundingInstrument
        // A resource representing a Payer's funding instrument.
        // Use a Payer ID (A unique identifier of the payer generated
        // and provided by the facilitator. This is required when
        // creating or using a tokenized funding instrument)
        // and the `CreditCardDetails`
        $fi = Paypalpayment::fundingInstrument();
        $fi->setCreditCard($card);

        // ### Payer
        // A resource representing a Payer that funds a payment
        // Use the List of `FundingInstrument` and the Payment Method
        // as 'credit_card'
        $payer = Paypalpayment::payer();
        $payer->setPaymentMethod("credit_card")
            ->setFundingInstruments(array($fi));

        $item1 = Paypalpayment::item();
        $item1->setName('Ground Coffee 40 oz')
                ->setDescription('Ground Coffee 40 oz')
                ->setCurrency('USD')
                ->setQuantity(1)
                ->setTax(0.3)
                ->setPrice(7.50);

        $item2 = Paypalpayment::item();
        $item2->setName('Granola bars')
                ->setDescription('Granola Bars with Peanuts')
                ->setCurrency('USD')
                ->setQuantity(5)
                ->setTax(0.2)
                ->setPrice(2);


        $itemList = Paypalpayment::itemList();
        $itemList->setItems(array($item1,$item2));


        $details = Paypalpayment::details();
        $details->setShipping("1.2")
                ->setTax("1.3")
                //total of items prices
                ->setSubtotal("17.5");

        //Payment Amount
        $amount = Paypalpayment::amount();
        $amount->setCurrency("USD")
                // the total is $17.8 = (16 + 0.6) * 1 ( of quantity) + 1.2 ( of Shipping).
                ->setTotal("20")
                ->setDetails($details);

        // ### Transaction
        // A transaction defines the contract of a
        // payment - what is the payment for and who
        // is fulfilling it. Transaction is created with
        // a `Payee` and `Amount` types

        $transaction = Paypalpayment::transaction();
        $transaction->setAmount($amount)
            ->setItemList($itemList)
            ->setDescription("Payment description")
            ->setInvoiceNumber(uniqid());

        // ### Payment
        // A Payment Resource; create one using
        // the above types and intent as 'sale'

        $payment = Paypalpayment::payment();

        $payment->setIntent("sale")
            ->setPayer($payer)
            ->setTransactions(array($transaction));

        try {
            // ### Create Payment
            // Create a payment by posting to the APIService
            // using a valid ApiContext
            // The return object contains the status;
            $payment->create($this->_apiContext);
        } catch (\PPConnectionException $ex) {
            return  "Exception: " . $ex->getMessage() . PHP_EOL;
            exit(1);
        }

        dd($payment);
    }

    /*
    * Process payment using paypal
    */
    public function store_paypal()
    {
        // ### Payer
        // A resource representing a Payer that funds a payment
        // For paypal account payments, set payment method
        // to 'paypal'.
        $payer = Paypalpayment::payer();
        $payer->setPaymentMethod("paypal");

        // ### Itemized information
        // (Optional) Lets you specify item wise
        // information
        $item1 = Paypalpayment::item();
        $item1->setName('Ground Coffee 40 oz')
                ->setDescription('Ground Coffee 40 oz')
                ->setCurrency('USD')
                ->setQuantity(1)
                ->setTax(0.3)
                ->setPrice(7.50);

        $item2 = Paypalpayment::item();
        $item2->setName('Granola bars')
                ->setDescription('Granola Bars with Peanuts')
                ->setCurrency('USD')
                ->setQuantity(5)
                ->setTax(0.2)
                ->setPrice(2);

        $itemList = Paypalpayment::itemList();
        $itemList->setItems(array($item1, $item2));

        $details = Paypalpayment::details();
        $details->setShipping('1.2')
                ->setTax('1.3')
                //total of items prices
                ->setSubtotal('17.5');
/*
        // ### Additional payment details
        // Use this optional field to set additional
        // payment information such as tax, shipping
        // charges etc.
        $details = Paypalpayment::details();
        $details->setShipping(1.2)
            ->setTax(1.3)
            ->setSubtotal(17.50);
*/
        // ### Amount
        // Lets you specify a payment amount.
        // You can also specify additional details
        // such as shipping, tax.
        $amount = Paypalpayment::amount();
        $amount->setCurrency("USD")
            ->setTotal(20)
            ->setDetails($details);

        // ### Transaction
        // A transaction defines the contract of a
        // payment - what is the payment for and who
        // is fulfilling it. 
        $transaction = Paypalpayment::transaction();
        $transaction->setAmount($amount)
            ->setItemList($itemList)
            ->setDescription("Payment description")
            ->setInvoiceNumber(uniqid());

        // ### Redirect urls
        // Set the urls that the buyer must be redirected to after 
        // payment approval/ cancellation.
        $baseUrl = "http://localhost:8000";
        $redirectUrls = Paypalpayment::redirectUrls();
        $redirectUrls->setReturnUrl("{$baseUrl}/callback?success=true")
            ->setCancelUrl("{$baseUrl}/callback?success=false");

        // ### Payment
        // A Payment Resource; create one using
        // the above types and intent set to 'sale'
        $payment = Paypalpayment::payment();
        $payment->setIntent("sale")
            ->setPayer($payer)
            ->setRedirectUrls($redirectUrls)
            ->setTransactions(array($transaction));

        // ### Create Payment
        // Create a payment by calling the 'create' method
        // passing it a valid apiContext.
        // (See bootstrap.php for more on `ApiContext`)
        // The return object contains the state and the
        // url to which the buyer must be redirected to
        // for payment approval
        try {
            $payment->create($this->apiContext);
        } catch (\Exception $ex) {
            \Log::error($ex);
        }

        // ### Get redirect url
        // The API response provides the url that you must redirect
        // the buyer to. Retrieve the url from the $payment->getApprovalLink()
        // method
        $approvalUrl = $payment->getApprovalLink();
        echo "Created Payment Using PayPal. Please visit the URL to Approve.Payment <a href={$approvalUrl}>{$approvalUrl}</a>";
        var_dump($payment);
    }



    
}
