import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import GetProduct from './GetProduct';

import backend from '../configs/backend';
import frontend from '../configs/frontend';


class PaymentConfirmationPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            "product_id": 0,
            "product_name": "",
            "package_code": "",
            "price": "",
            "description": "",
            "category_id": 4,
            "sub_category_id": 0,
            "compatibility": "",
            "urldownload": "",
            "status": "",
            "created": "",
            "imagePreviewUrl": "",
            "category": "",
            "subcategory": "",
            "paymentcode": "",
            "vouchercode": "",
        }
    }
    loadProductData(token, id){
		fetch(backend.url + `/api/landing/product/`+id+`/detail`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(resp=>this.setState(resp))
        
	}
    componentWillMount() {
        console.log(this.props.location.state)
        this.setState(this.props.location.state.payment.data);
        this.setState({paymentcode: this.props.location.state.paymentcode});
        console.log(this.state)
	}
    _create () {
        var token = cookie.load('token');
        return $.ajax({
        url: backend.url + '/api/payment/create',
        type: 'get',
        data: {
            id : this.state.product_id,
            return_url : frontend.url + '/#/payment/thankyou/'+this.state.product_id,
            pm_code : this.state.paymentcode,
            target : '01',
            vouchercode : this.state.vouchercode
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
            this.setState({loading: true});
        }.bind(this)
        })
    }
    _onSubmit(e){
        e.preventDefault();
        console.log('ID '+this.state.product_id+' PM '+this.state.paymentcode+' VCODE '+this.state.vouchercode);
        var xhr = this._create();
        xhr.done(this._onSuccess)
        .fail(this._onError)
        .always(this.hideLoading)
    }
    _onSuccess (data, replace) {
        console.log(data);
        console.log("success");
        if(data.code == "0000" ){
            window.location = data.urlredirect;
        }else if(data.code == 401) {
            alert("Token expired, please re-login");
        } else{
            alert("there are some error on your payment process, please contact administrator");
        }
        //return hashHistory.push({pathname: '/confirmation',  query:{test:0}, state:{product: this.state, payment: data}  }); 
        
    }
    _onError (data) {
        console.log(data);
        console.log("error");
        var message = "Failed to login"; 
        var res = data.responseJSON;
        if(res.message) {
        message = data.responseJSON.message;
        }
        if(res.errors) {
        this.setState({
            errors: res.errors
        });
        }
    }
    _onChange (e) {
        var state = {};
        state[e.target.name] =  $.trim(e.target.value);
        this.setState(state);
    }
	render (){
        console.log(this.state);
		return (  
             <div className="row white-bg">
                
                <div className="col-sm-12">
                    <div className="row wrapper border-bottom  page-heading">
                        <h4 className="m-t-none m-b">
                            <i className="fa fa-check" ></i> Product Payment summary
                        </h4>
                    </div>
                    
                    <div className="col-md-9">
                        <div className="text-center">
                            <h2><i className="fa fa-gift" ></i> {this.state.product_name }</h2>
                        </div>
                         <p>Your product payment summary.</p>
                        <div className="col-md-4 b-r">
                            <div>
                                <div className="ibox-content no-padding image-imitation">
                                    <img src={this.state.image} className="img-responsive" />
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <form role="form" name="summaryForm" onSubmit={(e)=>this._onSubmit(e)} className="css-form" >
                                <div className="row" >
                                    <div className="form-group ">
                                        <label className="col-md-3 control-label">Product Name </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.product_name} className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group ">
                                        <label className="col-md-3 control-label">Price </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.price} className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group" >
                                        <label className="col-md-3 control-label">Payment Method </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.payment_method} className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Voucher Code </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.voucher_code} placeholder="-" className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Voucher Name </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.voucher_name} placeholder="-" className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Discount  </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.disc+" %"} placeholder="Input your voucher here..." className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Total Amount </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.currency+' '+this.state.total_amount}  className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <p></p>
                                    <div className="form-group">
                                        <button onClick={(e)=>this._onSubmit(e)} className="btn btn-sm btn-success pull-right m-t-n-xs" type="submit" value="save">
                                            <i className="fa fa-dollar" ></i>
                                            <strong> Pay Now</strong>
                                        </button>
                                    </div>    
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    
                </div>
                
            </div>
		)
	}
};

export default PaymentConfirmationPane;

