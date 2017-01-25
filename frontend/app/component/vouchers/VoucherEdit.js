import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import Toggle from 'react-toggle';
import SweetAlert from 'sweetalert-react';
import axios from 'axios';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';


import backend from '../../configs/backend';

import 'sweetalert/dist/sweetalert.css';
import 'react-datepicker/dist/react-datepicker.css';


class VoucherEdit extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            voucher: {
                code: '',
                name: '',
                disc: null,
                max_claim: null,
                start_date: moment(),
                end_date: moment(),
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

    handleToggleChange() {
        let voucher = this.state.voucher;
        voucher.is_active = !voucher.is_active;
        this.setState({ voucher: voucher });
    }

    _submitHandler(e) {
        e.preventDefault();
        this.props.validate(error => {
            if (!error) {
                this.updateVoucher();
            }
        });

    }

    componentWillMount() {
        let voucher = this.props.details;
        voucher['start_date'] = moment(voucher.start_date);
        voucher['end_date'] = moment(voucher.end_date);
        this.setState({ voucher: voucher });

    }

    updateVoucher() {
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
        }).put('/api/vouchers/' + this.props.id, {
            code: this.state.voucher.code,
            name: this.state.voucher.name,
            disc: this.state.voucher.disc,
            max_claim: this.state.voucher.max_claim,
            start_date: this.state.voucher.start_date,
            end_date: this.state.voucher.end_date,
            is_active: this.state.voucher.is_active
        }).then(response => {
            let swal = this.state.swal;
            if (response.data.error) {
                swal.title = 'Gagal';
                swal.type = 'error';
                swal.confirm_button = true;
            } else {
                swal.title = 'Berhasil';
                swal.type = 'success';
                swal.confirm_button = false;
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

    _onStartPickerChange(value) {
        let newVoucher = this.state.voucher;
        newVoucher['start_date'] = value;
        this.setState(newVoucher);
    }

    _onEndPickerChange(value) {
        let newVoucher = this.state.voucher;
        newVoucher['end_date'] = value;
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
                    <a className=" pull-right"
                        onClick={this.open} >
                        <i className="fa fa-pencil"></i></a>
                </div>
                <Modal aria-labelledby="contained-modal-title-lg" show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Voucher</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row text-center">
                            <h3>Edit Voucher Details</h3>
                            <br />
                        </div>
                        <form role="form" className="css-form" >

                            <div className="col-lg-12" >
                                <div className={this.getClassName('code') + ' form-group'}>
                                    <label className="  control-label">Voucher Code </label>
                                    <div >
                                        <input type="text" name="code" value={this.state.voucher.code} onChange={this._onChange}
                                            placeholder="CODE01" className="form-control" />
                                        {this.renderErrors(this.props.getValidationMessages('code'))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12"  >
                                <div className={this.getClassName('name') + ' form-group'}>
                                    <label className="  control-label">Voucher Name </label>
                                    <div>
                                        <input type="text" name="name" value={this.state.voucher.name} onChange={this._onChange}
                                            placeholder="Voucher Name" className="form-control" />
                                        {this.renderErrors(this.props.getValidationMessages('name'))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6"  >
                                <div className={this.getClassName('disc') + ' form-group'}>
                                    <label className="  control-label">Disc in % </label>
                                    <div>
                                        <input type="number" name="disc" value={this.state.voucher.disc} onChange={this._onChange}
                                            placeholder="10" className="form-control" min="1" />
                                        {this.renderErrors(this.props.getValidationMessages('disc'))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6"  >
                                <div className={this.getClassName('max_claim') + ' form-group'}>
                                    <label className=" control-label">Max Claim </label>
                                    <div  >
                                        <input type="number" onChange={this._onChange} value={this.state.voucher.max_claim}
                                            name="max_claim" placeholder="1" min="1" className="form-control" />
                                        {this.renderErrors(this.props.getValidationMessages('max_claim'))}
                                    </div>
                                </div>
                            </div>

                            <div className={this.getClassName('start_date') + ' form-group col-lg-6'}>
                                <label className="font-normal">Start date</label>
                                <div>
                                    <DatePicker
                                        name="start_date"
                                        className="form-control"
                                        selected={this.state.voucher.start_date}
                                        onChange={this._onStartPickerChange} />
                                    {this.renderErrors(this.props.getValidationMessages('start_date'))}
                                </div>
                            </div>
                            <div className={this.getClassName('end_date') + ' form-group col-lg-6'}>
                                <label className="font-normal">End date</label>
                                <div>
                                    <DatePicker
                                        name="end_date"
                                        className="form-control"
                                        selected={this.state.voucher.end_date}
                                        onChange={this._onEndPickerChange} />
                                    {this.renderErrors(this.props.getValidationMessages('end_date'))}
                                </div>
                            </div>

                            <div className="form-group ">
                                <Toggle
                                    id="is_active"
                                    name="is_active"
                                    checked={this.state.voucher.is_active}
                                    onChange={this.handleToggleChange} />
                                <span>Status</span>
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
VoucherEdit = validation(strategy)(VoucherEdit);

export default VoucherEdit;
