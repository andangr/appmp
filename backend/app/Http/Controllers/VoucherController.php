<?php

namespace onestopcore\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use onestopcore\Voucher;
use onestopcore\Http\Requests;
use onestopcore\Http\Controllers\Controller;

class VoucherController extends Controller
{
    

    public function index(){

        $vouchers = Voucher::all();

        return view('pages/vouchermg/list',['vouchers'=>$vouchers]);
    }

    public function getallvoucher(){

        $vouchers = Voucher::all();

        return $vouchers;
    }


    public function destroy($id) {
      DB::delete('delete from voucher where id = ?',[$id]);
      echo "Record deleted successfully.<br/>";
      echo '<a href="/vouchermg">Click Here</a> to go back.';
   }

    /**
    * @return int
    */
    protected function getNextStatementId()
    {
        $next_id = \DB::select("select nextval('voucher_id_seq')");
        return intval($next_id['0']->nextval);
    }

    public function insert(Request $request){
        $data = array();
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
      
      echo "Record inserted successfully.<br/>";
      echo '<a href = "/vouchermg">Click Here</a> to go back.';
   }

   public function edit($id){
       
       $voucher = Voucher::find($id);
       //echo $id;
       return view('pages/vouchermg/edit',['voucher'=>$voucher]);
   }

   public function update(Request $request){
       
      $vouchercode = $request->input('vouchercode');
      $vouchername = $request->input('vouchername'); 
      $disc = $request->input('disc'); 
      $maxclaim = $request->input('maxclaim'); 
      $startdate= $request->input('startdate'); 
      $enddate = $request->input('enddate'); 
      $status = true; 
    
      $id = $request->input('id');
      //2016-10-31 18:05:00
      $testString = 'TEST';
      $testInt = 12;
      $testDatetime = date("Y-m-d h:i:s");
      
      $voucher = Voucher::find($id);
      //$voucher->id = $id;
      $voucher->code = $vouchercode;
      $voucher->name = $vouchername;
      $voucher->startdate = $startdate;
      $voucher->enddate = $enddate;
      $voucher->maxclaim = $maxclaim;
      $voucher->disc = $disc;
      $voucher->target_type = 1;
      $voucher->is_active = true;
      $voucher->save();
      
      echo "Record updated successfully.<br/>";
      echo '<a href = "/vouchermg">Click Here</a> to go back.';
   }
}
