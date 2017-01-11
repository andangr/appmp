import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';

import DynamicSelect from './helper/DynamicSelect';
import Options from './helper/Options';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class VoucherDeleteConfirm extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            loading: false,
            errors :''
        }
        
    }

    close() {
        this.setState({ showModal: false });
    }
    open() {
        this.setState({ showModal: true });
    }
    
    
    componentWillMount() {
        
	}
    _create () {
        var token = cookie.load('token');
        return $.ajax({
        url: backend.url + '/api/voucher/'+this.props.id,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
            this.setState({loading: true});
        }.bind(this)
        })
    }
    deleteNow(){
        
        var xhr = this._create();
        xhr.done(this._onSuccess)
        .fail(this._onError)
        .always(this.hideLoading)
    }
    _onSuccess (data) {
        console.log(data);
        console.log("success delete");
        location.reload();
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
	render (){
        
		return (
            <div className="row">
                <div className="col-sm-12">
                    <a className="pull-right" 
                        onClick={this.open} >
                        <i className="fa fa-trash"></i></a>
                </div>
                <Modal bsSize="small" aria-labelledby="contained-modal-title-lg" show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Voucher</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row text-center">
                            <p>Are you sure to delete this voucher ? </p>
                            <br/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.deleteNow} bsStyle="danger">Delete</Button>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
		)
	}
};

export default VoucherDeleteConfirm;
