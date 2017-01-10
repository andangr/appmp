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
                    <h5>Vouchers Table List</h5>

                    <button class="btn btn-primary btn-sm pull-right"  onclick="window.location='{{ url("vouchermg/create") }}'" >
                        <i class="fa fa-plus"></i> New
                    </button>
                </div>
                <div class="ibox-content">

                    <table class="footable table table-stripped toggle-arrow-tiny" data-page-size="8">
                        <thead>
                        <tr>

                            <th >Code</th>
                            <th>Name</th>
							<th>Disc %</th>
                            <th>Startdate</th>
                            <th>Enddate</th>
                            <th>MaxClaim</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach ($vouchers as $voucher)
                        <tr>
                            <td>{{ $voucher->code }}</td>
                            <td>{{ $voucher->name }}</td>
							<td>{{ $voucher->disc }}</td>
                            <td>{{ $voucher->startdate }}</td>
                            <td>{{ $voucher->enddate }}</td>
                            <td>{{ $voucher->maxclaim }}</td>
                            <td>
                                <a href="/vouchermg/edit/{{ $voucher->id }}" ><i class="fa fa-edit text-navy"></i></a>  
                                <a href='/vouchermg/delete/{{ $voucher->id }}'><i class="fa fa-trash text-navy"></i></a></td>
                        </tr>
                        @endforeach
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colspan="5">
                                <ul class="pagination pull-right"></ul>
                            </td>
                        </tr>
                        </tfoot>
                    </table>

                </div>
            </div>
        </div>
    </div>
</div>
@endsection