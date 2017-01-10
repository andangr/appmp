<?php

namespace onestopcore\Http\Controllers;

use Illuminate\Http\Request;
use onestopcore\Voucher;
use onestopcore\Http\Controllers\Controller;

class VoucherapiController extends Controller
{
    /**
     * Show all vouchers.
     * 
     * @return Response
     */
    public function index(){

        $vouchers = Voucher::all();

        return $vouchers;
    }

    /**
     * Create a Promo Voucher.
     * 
     * @return Response
     */
    public function create(Request $request){
        
      $vouchercode = $request->input('vouchercode');
      $vouchername = $request->input('vouchername'); 
      $disc = $request->input('disc'); 
      $maxclaim = $request->input('maxclaim'); 
      $startdate= $request->input('startdate'); 
      $enddate = $request->input('enddate'); 
      $status = true; 
      
      $id = $this->getNextStatementId();
      //2016-10-31 18:05:00
      $testString = 'TEST';
      $testInt = 12;
      $testDatetime = date("Y-m-d h:i:s");
      
      $voucher = new Voucher;
      $voucher->id = $id;
      $voucher->code = $vouchercode;
      $voucher->name = $vouchername;
      $voucher->startdate = $startdate;
      $voucher->enddate = $enddate;
      $voucher->maxclaim = $maxclaim;
      $voucher->disc = $disc;
      $voucher->target_type = 1;
      $voucher->is_active = true;
      $voucher->save();
      

      return $this->successResponse('Voucher is successfuly saved.', $voucher);
   }

   /**
    * @return int
    */
    protected function getNextStatementId()
    {
        $next_id = \DB::select("select nextval('voucher_id_seq')");
        return intval($next_id['0']->nextval);
    }


    /**
     * Edit a Promo Voucher.
     * 
     * @return Response
     */
    public function edit($id){
       
       $voucher = Voucher::find($id);
       //echo $id;
       return $this->successResponse('Get detail voucher', $voucher);
   }

   /**
     * Update the given user.
     *
     * @param  Request  $request
     * @param  string  $id
     * @return Response
     */
   public function update(Request $request, $id){
       $input = $request->all();
       
      $vouchercode = $input['vouchercode'];
      $vouchername = $input['vouchername']; 
      $disc = $input['disc']; 
      $maxclaim = $input['maxclaim']; 
      $startdate= $input['startdate']; 
      $enddate = $input['enddate']; 
      $status = true; 
    
      $testString = 'TEST';
      $testInt = 12;
      $testDatetime = date("Y-m-d h:i:s");
      
      $voucher = Voucher::find($id);
     
      $voucher->code = $vouchercode;
      $voucher->name = $vouchername;
      $voucher->startdate = $startdate;
      $voucher->enddate = $enddate;
      $voucher->maxclaim = $maxclaim;
      $voucher->disc = $disc;
      $voucher->target_type = 1;
      $voucher->is_active = true;
      $voucher->save();
      
      return $this->successResponse('Voucher is successfuly updated.', $voucher);
   }

    public function destroy($id) {

        Voucher::destroy($id);
      //DB::delete('delete from voucher where id = ?',[$id]);

        return $this->successResponse('Voucher is successfuly deleted');
   }

}
