import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import VoucherRow from './VoucherRow';
import VoucherNew from './VoucherNew';
import TopUp from './TopUp';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class VouchermgPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            "balance": {},
            "vouchers": {}
        }
    }
    loadVouchersData(token){
		fetch(backend.url + `/api/voucher`, { 
                headers: {
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(vouchers=>this.setState({vouchers}))
        //http://172.19.16.127:8011/app_dev.php/api/getbalance
	}
    componentWillMount() {
            var token = cookie.load('token');
			this.loadVouchersData(token);
            //this.loadBalanceData(token);
		
	}
    renderTable (key){
		return <VoucherRow details={this.state.vouchers[key]} key={this.state.vouchers[key].id} />
	}
	render (){
        console.log(this.state);
		return (
                <div>            
                    <div className="row wrapper border-bottom white-bg page-heading">
                        <div className="col-lg-10">
                            <h2>Voucher Management</h2>
                            
                        </div>
                        <div className="col-lg-2">

                        </div>
                    </div>
                    <div className="wrapper wrapper-content animated fadeInRight">

                        <div className="row">
                            <div className="col-lg-12">
                                <div className="ibox float-e-margins">
                                    <div className="ibox-title text-center">
                                        <h3><i className="fa fa-pencil"></i> Vouchers List </h3>
                                        
                                    </div>
                                    
                                    <div className="ibox-content">
                                        <VoucherNew />

                                        <table className="footable table table-stripped toggle-arrow-tiny" data-page-size="8">
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
                                                {Object.keys(this.state.vouchers).map(this.renderTable)}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan="5">
                                                    <ul className="pagination pull-right"></ul>
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
		)
	}
};

export default VouchermgPane;

/*
@foreach ($vouchers as $voucher)
                        <tr>
                            <td>{{ $voucher->code }}</td>
                            <td>{{ $voucher->name }}</td>
							<td>{{ $voucher->disc }}</td>
                            <td>{{ $voucher->startdate }}</td>
                            <td>{{ $voucher->enddate }}</td>
                            <td>{{ $voucher->maxclaim }}</td>
                            <td>
                                <a href="/vouchermg/edit/{{ $voucher->id }}" ><i className="fa fa-edit text-navy"></i></a>  
                                <a href='/vouchermg/delete/{{ $voucher->id }}'><i className="fa fa-trash text-navy"></i></a></td>
                        </tr>
                        @endforeach */
