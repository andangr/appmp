import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import SweetAlert from 'sweetalert-react';
import axios from 'axios';

import GetProduct from './GetProduct';

import backend from '../configs/backend';
import frontend from '../configs/frontend';


class PaymentConfirmationPane extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            product: {
                id: 0,
                product_name: '',
                package_code: '',
                price: '',
                description: '',
                category_id: '',
                sub_category_id: '',
                compatibility: '',
                urldownload: '',
                status: '',
                created: '',
                imagePreviewUrl: '',
                category: '',
                subcategory: '',
                paymentcode: '',
                vouchercode: '',
            },
            swal: {
                show: false,
                title: '',
                message: '',
                type: 'info',
                confirm_button: true,
            }
        }
    }
    componentWillMount() {
        this.setState({ product: this.props.location.state.payment.data });
    }
    _create() {
        

    }
    _onSubmit(e) {
        e.preventDefault();
        var token = cookie.load('token');

        this.setState({
            swal: {
                show: true,
                title: 'Please wait...',
                text: 'We are preparing your payment',
                type: 'info',
                confirm_button: false,
            }
        });
        var token = cookie.load('token');
        axios.create({
            baseURL: backend.url,
            timeout: 1000,
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).post('/api/payment/create', {
            id: this.state.product.product_id,
            return_url: frontend.url + '/#/payment/thankyou/' + this.state.product.product_id,
            pm_code: this.state.product.paymentcode,
            target: '01',
            vouchercode: this.state.product.vouchercode
        }).then(response => {
            let swal = this.state.swal;
            if (response.data.error) {
                swal.title = 'Error';
                swal.type = 'error';
                //swal.text = 'Something error on this page. Please contact administrator for any help';
                swal.text = response.data.message;
                this.setState({ swal: swal });
            } else {
                this.dismissSwal();
                window.location = response.data.urlredirect;
            }
        }).catch(error => {
            let swal = this.state.swal;

            swal.confirm_button = true;
            swal.title = 'Error';
            swal.type = 'error';
            swal.text = 'Please check your connection';
            this.setState({ swal: swal });
            console.log(error);
        });
    }
    _onSuccess(data, replace) {
        console.log(data);
        console.log("success");
        if (data.code == "0000") {
            window.location = data.urlredirect;
        } else if (data.code == 401) {
            alert("Token expired, please re-login");
        } else {
            alert("there are some error on your payment process, please contact administrator");
        }

    }
    _onError(data) {
        console.log(data);
        console.log("error");
        var message = "Failed to login";
        var res = data.responseJSON;
        if (res.message) {
            message = data.responseJSON.message;
        }
        if (res.errors) {
            this.setState({
                errors: res.errors
            });
        }
    }
    _onChange(e) {
        var state = {};
        state[e.target.name] = $.trim(e.target.value);
        this.setState(state);
    }
    dismissSwal() {
        let swal = this.state.swal;
        swal.show = false;
        this.setState({ swal: swal });
        if (this.state.swal.type == 'success') {
            location.reload();
        }
    }
    render() {
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
                            <h2><i className="fa fa-gift" ></i> {this.state.product.product_name}</h2>
                        </div>
                        <p>Your product payment summary.</p>
                        <div className="col-md-4 b-r">
                            <div>
                                <div className="ibox-content no-padding image-imitation">
                                    <img src={this.state.product.image} className="img-responsive" />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <form role="form" name="summaryForm" onSubmit={(e) => this._onSubmit(e)} className="css-form" >
                                <div className="row" >
                                    <div className="form-group ">
                                        <label className="col-md-3 control-label">Product Name </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.product.product_name} className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group ">
                                        <label className="col-md-3 control-label">Price </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.product.price} className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group" >
                                        <label className="col-md-3 control-label">Payment Method </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.product.payment_method} className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Voucher Code </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.product.voucher_code} placeholder="-" className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Voucher Name </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.product.voucher_name} placeholder="-" className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Discount  </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.product.disc + " %"} placeholder="Input your voucher here..." className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Total Amount </label>
                                        <div className="col-md-9">
                                            <input type="text" onChange={this._onChange} disabled="disabled" value={this.state.product.currency + ' ' + this.state.product.total_amount} className="form-control" />
                                        </div>
                                    </div>
                                    <br />
                                    <p></p>
                                    <div className="form-group">
                                        <button onClick={(e) => this._onSubmit(e)} className="btn btn-sm btn-success pull-right m-t-n-xs" type="submit" value="save">
                                            <i className="fa fa-dollar" ></i>
                                            <strong> Pay Now</strong>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>


                </div>
                <SweetAlert
                    show={this.state.swal.show}
                    title={this.state.swal.title}
                    text={this.state.swal.text}
                    type={this.state.swal.type}
                    showConfirmButton={this.state.swal.confirm_button}
                    onConfirm={this.dismissSwal}
                    onOutsideClick={this.dismissSwal}
                    />

            </div>
        )
    }
};

export default PaymentConfirmationPane;

