import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import SweetAlert from 'sweetalert-react';
import axios from 'axios';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';


import backend from '../../configs/backend';

import 'sweetalert/dist/sweetalert.css';

class VoucherNew extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            voucher: {
                code: '',
                name: '',
                disc: 0,
                max_claim: 1,
                start_date: {
                    value: new Date().toISOString(),
                    formattedValue: ''
                },
                end_date: {
                    value: new Date().toISOString(),
                    formattedValue: ''
                },
                is_active: false,
            },
            swal: {
                show: false,
                title: '',
                message: '',
                type: 'info',
                confirm_button: true,
            },
            showModal: false,
        };

        this.validatorTypes = strategy.createSchema(
            {
                code: 'required',
                name: 'required',
                disc: 'required',
                max_claim: 'required',
            },
            {

            }
        );
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    componentWillMount() {
        var token = cookie.load('token');
        console.log(token);
    }

    _submitHandler(e) {
        e.preventDefault();
        this.props.validate(error => {
            if (!error) {
                this.createVoucher();
            }
        });

    }

    createVoucher() {
        this.setState({
            swal: {
                show: true,
                title: 'Please wait...',
                text: 'We are saving your data',
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
        }).post('/api/vouchers', {
            code: this.state.voucher.code,
            name: this.state.voucher.name,
            disc: this.state.voucher.disc,
            max_claim: this.state.voucher.max_claim,
            start_date: this.state.voucher.start_date.value,
            end_date: this.state.voucher.end_date.value,
            is_active: this.state.voucher.is_active
        }).then(response => {
            let swal = this.state.swal;
            if (response.data.error) {
                swal.title = 'Gagal';
                swal.type = 'error';
            } else {
                swal.title = 'Berhasil';
                swal.type = 'success';
                swal.confirm_button = true;
            }
            swal.text = response.data.message;
            this.setState({ swal: swal });
            location.reload();
        }).catch(error => {
            let swal = this.state.swal;

            swal.confirm_button = true;
            swal.title = 'Gagal';
            swal.type = 'error';
            swal.text = 'Please check your connection';
            this.setState({ swal: swal });
            console.log(error);
        });
    }

    _onChange(e) {
        let newVoucher = this.state.voucher;
        newVoucher[e.target.name] = $.trim(e.target.value);
        this.setState({ voucher: newVoucher });

        this.props.handleValidation(e.target.name)(e);
    }

    _onStartPickerChange(value, formattedValue) {
        let newVoucher = this.state.voucher;
        let newStartDate = this.state.voucher.start_date;
        newStartDate['value'] = value;
        newStartDate['formattedValue'] = formattedValue;
        newVoucher['start_date'] = newStartDate;
        this.setState(newVoucher);
    }

    _onEndPickerChange(value, formattedValue) {
        let newVoucher = this.state.voucher;
        let newEndDate = this.state.voucher.end_date;
        newEndDate['value'] = value;
        newEndDate['formattedValue'] = formattedValue;
        newVoucher['end_date'] = newEndDate;
        this.setState(newVoucher);
    }

    getValidatorData() {
        return this.state.voucher;
    }

    getClassName(field) {
        return this.props.isValid(field) ? '' : 'has-error';
    }

    renderErrors(messages) {
        if (messages.length) {
            messages = messages.map((message, i) => <li key={i} className="">{message}</li>);
            return <ul className="errors">{messages}</ul>;
        }
    }

    activateValidation(e) {
        strategy.activateRule(this.validatorTypes, e.target.name);
        this.props.handleValidation(e.target.name)(e);
    }



    dismissSwal() {
        let swal = this.state.swal;
        swal.show = false;
        this.setState({ swal: swal });
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <button className="btn btn-success btn-sm pull-right" onClick={this.open} >
                        <i className="fa fa-plus"></i> New
                    </button>
                </div>
                <Modal aria-labelledby="contained-modal-title-lg" show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Voucher</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row text-center">
                            <h3>Create New Voucher</h3>
                            <br />
                        </div>
                        <form role="form" className="css-form" >

                            <div className="col-lg-12" >
                                <div className={this.getClassName('code') + ' form-group'}>
                                    <label className="  control-label">Voucher Code </label>
                                    <div >
                                        <input type="text" name="code" onChange={this._onChange}
                                            placeholder="CODE01" className="form-control" />
                                        {this.renderErrors(this.props.getValidationMessages('code'))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12"  >
                                <div className={this.getClassName('name') + ' form-group'}>
                                    <label className="  control-label">Voucher Name </label>
                                    <div>
                                        <input type="text" name="name" onChange={this._onChange}
                                            placeholder="Voucher Name" className="form-control" />
                                        {this.renderErrors(this.props.getValidationMessages('name'))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6"  >
                                <div className={this.getClassName('disc') + ' form-group'}>
                                    <label className="  control-label">Disc in % </label>
                                    <div>
                                        <input type="number" name="disc" onChange={this._onChange}
                                            placeholder="10" className="form-control" min="1" />
                                        {this.renderErrors(this.props.getValidationMessages('disc'))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6"  >
                                <div className={this.getClassName('max_claim') + ' form-group'}>
                                    <label className=" control-label">Max Claim </label>
                                    <div  >
                                        <input type="number" onChange={this._onChange}
                                            name="max_claim" placeholder="1" min="1" className="form-control" />
                                        {this.renderErrors(this.props.getValidationMessages('max_claim'))}
                                    </div>
                                </div>
                            </div>

                            <div className={this.getClassName('start_date') + ' form-group col-lg-6'}>
                                <label className="font-normal">Start date</label>
                                <DatePicker id="start_date"
                                    name="start_date"
                                    value={this.state.voucher.start_date.value}
                                    onChange={this._onStartPickerChange}
                                    />
                                {this.renderErrors(this.props.getValidationMessages('start_date'))}
                            </div>
                            <div className={this.getClassName('end_date') + ' form-group col-lg-6'}>
                                <label className="font-normal">End date</label>

                                <DatePicker id="end_date"
                                    name="end_date"
                                    value={this.state.voucher.end_date.value}
                                    onChange={this._onEndPickerChange}
                                    />
                                {this.renderErrors(this.props.getValidationMessages('end_date'))}
                            </div>

                            <div className="form-group ">
                                <label className="font-normal">Status</label>

                                <div className="switch">
                                    <div className="onoffswitch">
                                        <input type="checkbox" name="is_active" onChange={this._onChange}
                                            className="onoffswitch-checkbox" id="is_active" />
                                        <label className="onoffswitch-label" htmlFor="is_active" >
                                            <span className="onoffswitch-inner"></span>
                                            <span className="onoffswitch-switch"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={(e) => this._submitHandler(e)} bsStyle="success">
                            Save
                        </Button>
                        <Button onClick={this.close}>Close</Button>
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
        );
    }
}

VoucherNew = validation(strategy)(VoucherNew);

export default VoucherNew;
