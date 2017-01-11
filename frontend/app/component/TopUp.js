import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import { Router, hashHistory } from 'react-router';

import { Link } from 'react-router';
import NeedLoginDialog from './NeedLoginDialog';
import RegisterPane from './RegisterPane';
import RadioOptions from './helper/RadioOptions';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class TopUp extends React.Component {
    
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            "showModal": false,
            "vouchercode": '',
            "paymentcode": '',
            "balance": {},
            "pm": {},
            "vouchers": {},
            
        }
    }
      
    close() {
        this.setState({ showModal: false });
    }
    closeLogin() {
        this.setState({ showModalLogin: false });
    }
    show(){
        var token = cookie.load('token');
        if(token){
            this.open();
            console.log('token exist');
        }else{
             this.setState({ showModalLogin: true});
             console.log('no token');
        }
    }
    open() {
        var token = cookie.load('token');
        this.loadPaymentMethod(token);
        this.loadVoucherTopUp(token);
        this.setState({ showModal: true });
    }
    loadPaymentMethod(token){
		fetch(backend.url + `/api/getpaymenttopup`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(pm=>this.setState({pm}))
        
	}
    loadVoucherTopUp(token){
		fetch(backend.url + `/api/getvouchertopup`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(vouchers=>this.setState({vouchers}))
        
	}
    loadBalanceData(token){
		fetch(backend.url + `/api/getbalance`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(balance=>this.setState({balance}))
        
	}
    componentWillMount() {
        var token = cookie.load('token');
         this.loadBalanceData(token);
	}
    renderRadioOptionsVoucher(key){
        return <div key={key}><label> 
                <input  type="radio" onChange={this._onChange} 
                        id="vouchercode" name="vouchercode" value={this.state.vouchers[key].code}
                        required />{this.state.vouchers[key].name}</label>
            </div>
    }
    renderRadioOptionsVoucherv(key){
        return  <RadioOptions id={this.state.vouchers[key].id} 
                text={this.state.vouchers[key].name} name="voucher_topup" 
                key={this.state.vouchers[key].id} />
    }
    renderRadioOptions(key){
        return <div key={key}><label> 
                <input  type="radio" onChange={this._onChange} 
                        id="paymentcode" name="paymentcode" value={this.state.pm[key].code}
                        required />{this.state.pm[key].name}</label>
            </div>
    }
    renderRadioOptionsv(key){
		return <RadioOptions id={this.state.pm[key].id} 
                text={this.state.pm[key].name} name="payment_method" 
                key={this.state.pm[key].id} />
    }
    _create () {
        var token = cookie.load('token');
        return $.ajax({
        url: backend.url + '/api/createpayment',
        type: 'POST',
        data: {
            id : this.state.vouchercode,
            return_url : frontend.url + '/#/myroom',
            pm_code : this.state.paymentcode,
            target : '02',
            vouchercode : ''
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
            this.setState({loading: true});
        }.bind(this)
        })
    }
    _onSubmit(e){
        e.preventDefault();
        
        var xhr = this._create();
        xhr.done(this._onSuccess)
        .fail(this._onError)
        .always(this.hideLoading)
    }
    _onSuccess (data, replace) {
        console.log(data);
        console.log("success");
        if(data.code == "0000"){
            console.log(data.urlredirect);
            window.location.href = data.urlredirect;
        }
        
    }
    _onError (data) {
        console.log(data);
        
        var message = "Top Up Failed with Internal Error";
        console.log(message);
        
    }
    _onChange (e) {
        var state = {};
        state[e.target.name] =  $.trim(e.target.value);
        this.setState(state);
    }
	render (){
        /*<button className="btn btn-success btn-sm" onClick={this.show}>
                        <i className="fa fa-download" ></i> Top Up
                    </button>*/
		return (
             <div className="col-lg-12">
                <label className="col-lg-6 control-label">Your Current Ballance :  </label>
                                <div className="col-lg-9">
                                    Rp. {this.state.balance.balance} <button className="button btn-primary pull-right" onClick={this.show}>
                                    <i className="fa fa-credit-card"></i> Topup</button>
                                </div>
                                <div className="input-group"></div>
                <div className="col-sm-12">
                    
                    
                </div>
                <Modal aria-labelledby="contained-modal-title-lg" show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Top Up 1stopWallet Balance</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row" >
                            <div className="col-sm-12">
                                <p>You can top up your 1stopWallet balance using your paypal account. Select voucher below</p>
                                <hr />
                                <form role="form" ref="topupForm" onSubmit={(e)=>this._onSubmit(e)} className="css-form" >
                                    
                                    <div className="row">
                                        <div className="form-group" >
                                            <label className="col-lg-3 control-label">Voucher Top Up :
                                            </label>
                                            <div className="col-sm-9">
                                                  {Object.keys(this.state.vouchers).map(this.renderRadioOptionsVoucher)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row"  >
                                        <div className="form-group">
                                            <label className="col-sm-4 control-label">Choose payment method:  
                                            </label>

                                            <div className="col-sm-8">
                                                {Object.keys(this.state.pm).map(this.renderRadioOptions)}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="btn btn-sm btn-primary pull-right m-t-n-xs" type="submit" value="save"><strong>Next</strong></button>
                                    </div>
                                </form>
                                
                            </div>
                            
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={(e)=>this._onSubmit(e)} bsStyle="success"><i className="fa fa-dollar" ></i> Pay</Button>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </div>
		)
	}
};
//<Button onClick={this.deleteNow} bsStyle="danger">Delete</Button>

export default TopUp;

