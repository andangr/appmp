import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';

import Options from './helper/Options';

import backend from '../configs/backend';

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
                status: false,
            },
            showModal: false,
            product: {},
            categoriesdata: {
                data: {}
            },
            subcategoriesdata: {
                data: {}
            },
            selectedOption: 0
        };

        this._handleImageChange = this._handleImageChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    close() {
        this.setState({ showModal: false });
    }
    open() {
        this.setState({ showModal: true });
    }
    optionCategoryChange(e) {
        this.setState({ category_id: e.target.value });
        console.log('option changed to ' + this.state.category_id);
        var token = cookie.load('token');
        this.loadSubcategoryOptions(token, e.target.value);
    }
    optionSubCategoryChange(e) {
        this.setState({ sub_category_id: e.target.value });
        //console.log('option changed to '+this.state.sub_category_id);
    }
    componentWillMount() {
        var token = cookie.load('token');
        console.log(token);
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        let filename = e.target.value;
        let fileformat = filename.split('.').pop();
        //console.log('filename : '+filename+' format : '+fileformat);
        reader.onloadend = () => {
            this.setState({
                images: reader.result, //file,
                imagePreviewUrl: reader.result,
                fileformat: fileformat
            });
        };

        reader.readAsDataURL(file);

    }
    _create() {
        var token = cookie.load('token');
        return $.ajax({
            url: backend.url + '/api/voucher/create',
            type: 'GET',
            data: {
                vouchercode: this.state.voucher.code,
                vouchername: this.state.voucher.name,
                disc: this.statevoucher.disc,
                maxclaim: this.state.voucher.max_claim,
                startdate: this.state.voucher.start_date,
                enddate: this.state.voucher.end_date,
                status: this.state.voucher.status
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                this.setState({ loading: true });
            }.bind(this)
        });
    }
    _onSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        var xhr = this._create();
        xhr.done(this._onSuccess)
            .fail(this._onError)
            .always(this.hideLoading);
    }
    _onSuccess(data) {
        console.log(data);
        console.log('success');
        location.reload();
    }
    _onError(data) {
        console.log(data);
        console.log('error');
        var message = 'Failed to login';
        var res = data.responseJSON;
        if (res.message) {
            message = data.responseJSON.message;
        }
        console.log(message);
        if (res.errors) {
            this.setState({
                errors: res.errors
            });
        }
    }
    _onChange(e) {
        let newVoucher = this.state.voucher;
        newVoucher[e.target.name] = $.trim(e.target.value);
        this.setState({ voucher: newVoucher });
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
                                <div className="form-group ">
                                    <label className="  control-label">Voucher Code </label>
                                    <div >
                                        <input type="text" name="vouchercode" onChange={this._onChange}
                                            placeholder="CODE01" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12"  >
                                <div className="form-group ">
                                    <label className="  control-label">Voucher Name </label>
                                    <div>
                                        <input type="text" name="vouchername" onChange={this._onChange}
                                            placeholder="Voucher Name" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6"  >
                                <div className="form-group ">
                                    <label className="  control-label">Disc in % </label>
                                    <div>
                                        <input type="number" name="disc" onChange={this._onChange}
                                            placeholder="10" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6"  >
                                <div className="form-group ">
                                    <label className=" control-label">Max Claim </label>
                                    <div  >
                                        <input type="number" onChange={this._onChange}
                                            name="maxclaim" placeholder="1" className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group col-lg-6" id="startdate">
                                <label className="font-normal">Start date</label>
                                <DatePicker id="start_date"
                                    name="start_date"
                                    value={this.state.voucher.start_date.value}
                                    onChange={this._onStartPickerChange}
                                    />

                            </div>
                            <div className="form-group col-lg-6" id="enddate">
                                <label className="font-normal">End date</label>

                                <DatePicker id="end_date"
                                    name="end_date"
                                    value={this.state.voucher.end_date.value}
                                    onChange={this._onEndPickerChange}
                                    />
                            </div>

                            <div className="form-group ">
                                <label className="font-normal">Status</label>

                                <div className="switch">
                                    <div className="onoffswitch">
                                        <input type="checkbox" name="status" onChange={this._onChange}
                                            className="onoffswitch-checkbox" id="status" />
                                        <label className="onoffswitch-label" htmlFor="status" >
                                            <span className="onoffswitch-inner"></span>
                                            <span className="onoffswitch-switch"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={(e) => this._onSubmit(e)} bsStyle="success">
                            Save
                        </Button>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default VoucherNew;
