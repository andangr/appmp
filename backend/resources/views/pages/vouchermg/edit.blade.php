@extends('layout.master')
@section('title', 'Product')


@section('content')
<div class="row wrapper border-bottom white-bg page-heading">
   <div class="col-lg-10">
        <h2>Voucher Management</h2>
        
    </div>
    <div class="col-lg-2">

    </div>
</div>

<div class="wrapper wrapper-content animated fadeInRight">

    <div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-title">
                    <h5>Edit Voucher</h5>
                </div>
                <div class="ibox-content">
                    

                        <form role="form" action='/vouchermg/update' class="css-form" style="margin-top:20px">
                            <input type = "hidden" name = "_token" value = "<?php echo csrf_token(); ?>">
                            <input type = "hidden" name = "id" value = "{{$voucher['id']}}">
                            <div class="row" style="margin-top:10px">
                                <div class="form-group col-lg-9">
                                    <label class="col-lg-3 control-label">Voucher Code </label>
                                    <div class="col-lg-9">
                                        <input type="text" name="vouchercode" value="{{$voucher['code']}}" placeholder="CODE01" value="" class="form-control">
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin-top:10px">
                                <div class="form-group col-lg-9">
                                    <label class="col-lg-3 control-label">Voucher Name </label>
                                    <div class="col-lg-9">
                                        <input type="text" name="vouchername" value="{{$voucher['name']}}" placeholder="Voucher Name" value="" class="form-control">
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin-top:10px">
                                <div class="form-group col-lg-9">
                                    <label class="col-lg-3 control-label">Disc in % </label>
                                    <div class="col-lg-9">
                                        <input type="number" value="{{$voucher['disc']}}" name="disc" placeholder="10" value="" class="form-control">
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin-top:10px">
                                <div class="form-group col-lg-9">
                                    <label class="col-lg-3 control-label">Max Claim </label>
                                    <div class="col-lg-9">
                                        <input type="number" value="{{$voucher['maxclaim']}}" name="maxclaim" placeholder="1" value="" class="form-control">
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin-top:10px">
                                <div class="form-group col-lg-3" id="startdate">
                                    <label class="font-normal">Start date</label>

                                    <div class="input-group date">
                                        <input type="datetime" value="{{$voucher['startdate']}}" name="startdate" class="form-control" date-time view="month" auto-close="true">
                                        <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                                    </div>
                                </div>
                                <div class="form-group col-lg-3" id="enddate">
                                    <label class="font-normal">End date</label>

                                    <div class="input-group date">
                                        <input type="datetime" value="{{$voucher['enddate']}}" name="enddate" class="form-control" date-time view="month" auto-close="true">
                                        <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin-top:10px">
                                <div class="form-group col-lg-9">
                                    <label class="font-normal">Status</label>
                                    <div class="switch">
                                        <div class="onoffswitch">
                                            <input type="checkbox" name="status" value="{{$voucher['status']}}" checked class="onoffswitch-checkbox" id="status">
                                            <label class="onoffswitch-label" for="status">
                                                <span class="onoffswitch-inner"></span>
                                                <span class="onoffswitch-switch"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin-top:10px">
                                <div class="form-group col-lg-9">
                                    <button class="btn btn-sm btn-success pull-right m-t-n-xs" type="submit" value="save">
                                        <strong>Save</strong>
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                    

                </div>
            </div>
        </div>
    </div>
</div>
@endsection