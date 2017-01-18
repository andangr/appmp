import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';
import axios from 'axios';

import backend from '../../configs/backend';

import 'sweetalert/dist/sweetalert.css';

class VoucherDeleteConfirm extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            voucher: {},
            swal: {
                show: false,
                title: '',
                message: '',
                type: 'info',
                confirm_button: false,
                cancel_button: false,
            },
        };

    }

    componentWillMount() {

    }

    requestDelete() {
        console.log('deleting');
        this.setState({
            swal: {
                show: true,
                title: 'Deleting ...',
                text: 'We are deleting your data',
                type: 'info',
                confirm_button: false,
                cancel_button: false
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
        }).delete('/api/vouchers/' + this.props.id)
            .then(response => {
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

    showSwal() {
        let swal = this.state.swal;
        swal.show = true;
        swal.title = 'Are You Sure?';
        swal.text = 'You will not be able to recover this voucher';
        swal.type = 'warning';
        swal.cancel_button = true;
        swal.confirm_button = true;
        this.setState({
            swal: swal
        });
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
                    <a className="pull-right"
                        onClick={this.showSwal} >
                        <i className="fa fa-trash"></i></a>
                </div>
                <Modal bsSize="small" aria-labelledby="contained-modal-title-lg" show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Voucher</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row text-center">
                            <p>Are you sure to delete this voucher ? </p>
                            <br />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.showSwal} bsStyle="danger">Delete</Button>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
                <SweetAlert
                    show={this.state.swal.show}
                    title={this.state.swal.title}
                    text={this.state.swal.text}
                    type={this.state.swal.type}
                    showConfirmButton={this.state.swal.confirm_button}
                    showCancelButton={this.state.swal.cancel_button}
                    confirmButtonColor="#DD6B55"
                    onConfirm={this.requestDelete}
                    onCancel={this.dismissSwal}
                    />
            </div>
        );
    }
}

export default VoucherDeleteConfirm;
