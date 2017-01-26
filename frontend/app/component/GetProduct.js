import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import { Router, hashHistory } from 'react-router';
import { Link } from 'react-router';
import SweetAlert from 'sweetalert-react';
import axios from 'axios';


import NeedLoginDialog from './NeedLoginDialog';
import RegisterPane from './RegisterPane';

import backend from '../configs/backend';
import frontend from '../configs/frontend';


class GetProduct extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            showModal: false,
            paymentcode: '',
            vouchercode: '',
            pm: {},
            swal: {
                show: false,
                title: '',
                message: '',
                type: 'info',
                confirm_button: true,
            }
        }

    }

    close() {
        this.setState({ showModal: false });
    }
    closeLogin() {
        this.setState({ showModalLogin: false });
    }
    show() {
        var token = cookie.load('token');
        if (token) {
            this.open();
            console.log('token exist');
        } else {
            this.setState({ showModalLogin: true });
            console.log('no token');
        }
    }
    open() {
        var token = cookie.load('token');
        this.loadPaymentMethod(token);
        this.setState({ showModal: true });
    }
    loadPaymentMethod(token) {
        fetch(backend.url + `/api/paymentmethod`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(result => result.json())
            .then(pm => this.setState({ pm }))

    }
    componentWillMount() {

    }
    renderRadioOptions(key) {
        return <div key={key}><label>
            <input type="radio" onChange={this._onChange}
                id="paymentcode" name="paymentcode" value={this.state.pm[key].code}
                required />{this.state.pm[key].name}</label>
        </div>
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
        }).post('/api/sumarypayment', {
            id: this.props.details.id,
            return_url: frontend.url + '/#/payment/thankyou/' + this.props.details.id,
            pm_code: this.state.paymentcode,
            target: '01',
            vouchercode: this.state.vouchercode
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
                hashHistory.push({
                    pathname: '/confirmation',
                    query: { test: 0 },
                    state: {
                        paymentcode: this.state.paymentcode,
                        payment: response.data
                    }
                });
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
        return (
            <div className="col-lg-12">

                <div className="col-sm-12">
                    <button className="btn btn-success btn-sm" onClick={this.show}>
                        <i className="fa fa-download" ></i> Get It
                    </button>
                </div>
                <Modal aria-labelledby="contained-modal-title-lg" show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Get Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row  text-center">
                            <h1>{this.props.details.product_name}</h1>
                            <div className="col-md-4  text-center">
                            </div>
                            <div className="col-md-4  text-center">
                                <div className="m-b-sm">
                                    <img src={this.props.details.imagePreviewUrl} className="img-responsive" />

                                </div>
                            </div>
                        </div>
                        <p>You're about to get this {this.props.details.category}. Now select details method you preferred.</p>
                        <form role="form" name="paymentForm" onSubmit={(e) => this._onSubmit(e)} className="css-form" >
                            <div className="row"  >
                                <div className="form-group">
                                    <label className="col-lg-3 control-label">Product Name </label>
                                    <div className="col-lg-9">
                                        <input type="text" disabled="" onChange={this._onChange} value={this.props.details.product_name} className="form-control" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="col-lg-3 control-label">Price </label>
                                    <div className="col-lg-9">
                                        <input type="text" disabled="" onChange={this._onChange} value={this.props.details.price}
                                            className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="row"  >
                                <div className="form-group">
                                    <label className="col-sm-4 control-label">Choose payment method
                                    </label>

                                    <div className="col-sm-8">
                                        {Object.keys(this.state.pm).map(this.renderRadioOptions)}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label className="col-lg-3 control-label">Voucher Code (optional) </label>
                                    <div className="col-lg-9">
                                        <input type="text" id="vouchercode" name="vouchercode"
                                            onChange={this._onChange} placeholder="Input your voucher here..."
                                            className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div  >
                                <button className="btn btn-sm btn-primary pull-right m-t-n-xs" type="submit" value="save"><strong>Next</strong></button>

                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <Modal aria-labelledby="contained-modal-title-lg" show={this.state.showModalLogin} onHide={this.closeLogin}>
                    <Modal.Header closeButton>
                        <Modal.Title>Need login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row text-center">
                            <h4>You have to login to access this request. </h4>
                            <div className="col-md-6 b-r">
                                <h4>Already have an account ?</h4>
                                <p>Please login by click this button </p>
                                <p className="text-center">
                                    <Link to={'/login'} ><i className="fa fa-sign-in big-icon"></i></Link>
                                </p>
                            </div>
                            <div className="col-md-6">
                                <h4>Not a member?</h4>

                                <p>You can create an account:</p>
                                <p className="text-center">
                                    <Link to={'/register'} ><i className="fa fa-pencil big-icon"></i></Link>
                                </p>
                            </div>
                        </div>
                        <div className="col-md-12"></div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeLogin}>Close</Button>
                    </Modal.Footer>
                </Modal>
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
//<Button onClick={this.deleteNow} bsStyle="danger">Delete</Button>

export default GetProduct;

