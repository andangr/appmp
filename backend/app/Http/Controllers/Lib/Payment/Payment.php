<?php

namespace onestopcore\Http\Controllers\Lib\Payment;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Paypalpayment;
use onestopcore\Product;
use onestopcore\Voucher;
use onestopcore\TransPayment;
use onestopcore\PaymentMethod;
use onestopcore\Http\Controllers\Controller;

class Payment extends Controller
{
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
}
