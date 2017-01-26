<?php

namespace onestopcore\Http\Controllers\Api\Payment;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Paypalpayment;
use Validator;
Use DB;
Use onestopcore\Http\Controllers\Lib\Payment\TransactionData;
use onestopcore\PaymentMethod;
use onestopcore\Product;
use onestopcore\TransPayment;
use onestopcore\Http\Controllers\Controller;

class ApiPaymentController extends Controller
{
    /**
    * Create Summary Payment
     * @return array
     * @param Request $request
     *
     */
    public function createSumaryAction(Request $request) 
    {
        $input = $request->input();

        $validator = Validator::make($request->all(), $this->fieldRules());
        if ($validator->fails()) {
            return array (
                'code' => '200',
                'error' => true,
                'message'   => 'Invalid parameters ',
            );
        }

        $transactionData = new TransactionData;
        $transactionData->product_id = $request->input('id');
        $transactionData->payment_method = $request->input('pm_code');
        $transactionData->payment_target = $request->input('target');
        $transactionData->voucher_code = $request->input('vouchercode');
        $transactionData->url_callback = $request->input('return_url');
        
        if($transactionData->payment_target !== '02'){
            $transactionData->product_id = (int)$transactionData->product_id;
        } 

        /* get product or voucher details data */
        $detailsData = $transactionData->getDetailsData();

        if($detailsData['error']){
            return array (
                'code' => '200',
                'error' => true,
                'message'   => 'Product Not Found',
            );  
        }
        /* -- end -- */

        /* start normalize price */
        $normalPrice = $transactionData->normalizePrice();
        if($normalPrice['error']){
            return $normalPrice;   
        }
        /* -- end of normalize price -- */

        $aDataResponse = array(
                'image' => $transactionData->image,
		        'product_id' => $transactionData->product_id,
                'product_name' => $transactionData->product_name,
                'price' => $transactionData->price,
                'payment_method' => $transactionData->payment_method_name,
		        'paymentcode' => $transactionData->payment_method,
                'voucher_code' => $transactionData->voucher_code,
                'voucher_name' => $transactionData->voucher_name,
                'disc' => $transactionData->disc,
                'total_amount' => $transactionData->total_amount,
                'currency' => $transactionData->currency,
            );
	
        $response = array (
                'code' => '200',
                'error' => false,
                'message'   => 'Get sumary payment success.',
                'data' => $aDataResponse

            );

        return $response;
    }

     /**
     * Get the parameters validation rules.
     *
     * @return array
     */
    protected function fieldRules()
    {
        return [
            'id' => 'required',
            'return_url' => 'required|url',
            'pm_code' => 'required',
            'target' => 'required' 
        ];
    }

    /**
    * Create Summary Payment
     * @return array
     * @param Request $request
     *
     */
    public function create(Request $request) 
    {
        $input = $request->input();

        $validator = Validator::make($request->all(), $this->fieldRules());
        if ($validator->fails()) {
            return array (
                'code' => '200',
                'error' => true,
                'message'   => 'Invalid parameters ',
            );
        }

        $transactionData = new TransactionData;
        $transactionData->product_id = $request->input('id');
        $transactionData->payment_method = $request->input('pm_code');
        $transactionData->payment_target = $request->input('target');
        $transactionData->voucher_code = $request->input('vouchercode');
        $transactionData->url_callback = $request->input('return_url');
        
        if($transactionData->payment_target !== '02'){
            $transactionData->product_id = (int)$transactionData->product_id;
        } 

        /* get product or voucher details data */
        $detailsData = $transactionData->getDetailsData();

        if($detailsData['error']){
            return array (
                'code' => '200',
                'error' => true,
                'message'   => 'Product Not Found',
            );  
        }
        /* -- end -- */

        /* start normalize price */
        $normalPrice = $transactionData->normalizePrice();
        if($normalPrice['error']){
            return $normalPrice;   
        }
        /* -- end of normalize price -- */

        $response = $transactionData->_balancePaymentAction();

        return $response;
    }
    public function doneBalanceAction(Request $request){
        
        $token =$request->input('token');
        $trans_payment = TransPayment::where('token', $token)->firstOrFail();

        $urlCallback = $trans_payment->url_callback;
        $token = $trans_payment->token;

        return redirect($urlCallback.'?token='.$token.'&success=true');

    }

}

