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


class VoucherEdit extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            vouchercode : '',
            vouchername: '',
            disc: 0,
            maxclaim: 1,
            startdate: '',
            enddate: '',
            status : false,
            "showModal": false,
            voucher:{
                data:{}
            },
            "selectedOption": 0
        }
    }

    close() {
        this.setState({ showModal: false });
    }
    open() {
        
        var token = cookie.load('token');
        console.log('id '+this.props.id);
        this.setState({ showModal: true });
        
    }
    loadCategoryOptions(token){
		fetch(backend.url + `/api/voucher/`+this.props.id+`/edit`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(voucher=>this.setState({voucher}))
            //console.log(result)
        this.setState(this.state.voucher.data);
	}
     componentWillMount() {
        //var token = cookie.load('token');
        //this.loadCategoryOptions(token);
        this.setState(this.props.details)
        
	}
    _create () {
        var token = cookie.load('token');
        return $.ajax({
        url: backend.url + '/api/voucher/'+this.props.id,
        type: 'PUT',
        data: {
            vouchercode : this.state.code,
            vouchername: this.state.name,
            disc: this.state.disc,
            maxclaim: this.state.maxclaim,
            startdate: this.state.startdate,
            enddate: this.state.enddate,
            status : this.state.is_active
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
            this.setState({loading: true});
        }.bind(this)
        })
    }
    _onSubmit(e){
        e.preventDefault();
        //console.log(this.state.images);
        var xhr = this._create();
        xhr.done(this._onSuccess)
        .fail(this._onError)
        .always(this.hideLoading)
    }
    _onSuccess (data) {
        console.log(data);
        console.log("success");
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

    _onChange (e) {
        var state = {};
        state[e.target.name] =  $.trim(e.target.value);
        console.log(state)
        this.setState(state);
    }

	render (){
       
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
                            <br/>
                        </div>
                        <form role="form"   className="css-form" >
                            
                            <input type = "hidden" name = "id" value ={this.props.id} />
                            <div  className="col-lg-12" >
                                <div  className="form-group ">
                                    <label  className="  control-label">Voucher Code </label>
                                    <div >
                                        <input type="text" name="code" 
                                        value={this.state.code} onChange={this._onChange}
                                        placeholder="CODE01" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div  className="col-lg-12"  >
                                <div  className="form-group ">
                                    <label  className="  control-label">Voucher Name </label>
                                    <div>
                                        <input type="text" name="name" 
                                        value={this.state.name} onChange={this._onChange}
                                        placeholder="Voucher Name"  className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div  className="col-lg-6"  >
                                <div  className="form-group ">
                                    <label  className="  control-label">Disc in % </label>
                                    <div>
                                        <input type="number" name="disc" 
                                        value={this.state.disc} onChange={this._onChange}
                                        placeholder="10"  className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div  className="col-lg-6"  >
                                <div  className="form-group ">
                                    <label  className=" control-label">Max Claim </label>
                                    <div  >
                                        <input type="number" 
                                        value={this.state.maxclaim} onChange={this._onChange}
                                        name="maxclaim" placeholder="1" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            
                            <div  className="form-group col-lg-6" id="startdate">
                                <label  className="font-normal">Start date</label>

                                <div  className="input-group date">
                                    <input type="datetime" value=""  name="startdate" 
                                        value={this.state.startdate} onChange={this._onChange}
                                        className="form-control"  />
                                    <span  className="input-group-addon"><i  className="fa fa-calendar"></i></span>
                                </div>
                            </div>
                            <div  className="form-group col-lg-6" id="enddate">
                                <label  className="font-normal">End date</label>

                                <div  className="input-group date">
                                    <input type="datetime" value="" name="enddate" 
                                        value={this.state.enddate} onChange={this._onChange}
                                        className="form-control" />
                                    <span  className="input-group-addon"><i  className="fa fa-calendar"></i></span>
                                </div>
                            </div>
                        
                        
                            <div  className="form-group ">
                                <label  className="font-normal">Status</label>
                                <div  className="switch">
                                    <div  className="onoffswitch">
                                        <input type="checkbox" name="is_active" 
                                              onChange={this._onChange}
                                            className="onoffswitch-checkbox" checked={this.state.is_active} id="status" />
                                        <label  className="onoffswitch-label" htmlFor="status">
                                            <span  className="onoffswitch-inner"></span>
                                            <span  className="onoffswitch-switch"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                            
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={(e)=>this._onSubmit(e)} bsStyle="success">
                            Save
                        </Button>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
		)
	}
};
//<input type="number" className="form-control" onChange={this._onChange} 
                                    //id="category_id" name="category_id" placeholder="category_id" required="" />

export default VoucherEdit;
