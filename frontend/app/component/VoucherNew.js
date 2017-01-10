import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';


import DynamicSelect from './helper/DynamicSelect';
import Options from './helper/Options';

class VoucherNew extends React.Component {
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
            "product":{},
            "categoriesdata":{
                data:{}
            },
            "subcategoriesdata":{
                data:{}
            },
            "selectedOption": 0
        }
        this._handleImageChange = this._handleImageChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    close() {
        this.setState({ showModal: false });
    }
    open() {
        this.setState({ showModal: true });
    }
    optionCategoryChange(e){
        this.setState({category_id: e.target.value});
        console.log('option changed to '+this.state.category_id);
        var token = cookie.load('token');
        this.loadSubcategoryOptions(token, e.target.value);
    }
    optionSubCategoryChange(e){
        this.setState({sub_category_id: e.target.value});
        //console.log('option changed to '+this.state.sub_category_id);
    }
    componentWillMount() {
        var token = cookie.load('token');
	}

    _handleImageChange(e){
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
            fileformat:fileformat
        });
        }

        reader.readAsDataURL(file)
    
    }
    _create () {
        var token = cookie.load('token');
        return $.ajax({
        url: 'http://172.19.16.156:8000/api/voucher/create',
        type: 'GET',
        data: {
            vouchercode : this.state.vouchercode,
            vouchername: this.state.vouchername,
            disc: this.state.disc,
            maxclaim: this.state.maxclaim,
            startdate: this.state.startdate,
            enddate: this.state.enddate,
            status : this.state.status
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
            this.setState({loading: true});
        }.bind(this)
        })
    }
    _onSubmit(e){
        e.preventDefault();
        console.log(this.state);
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
        this.setState(state);
    }
	renderCategoryOptions(key){
		return <Options id={this.state.categoriesdata.data[key].id} text={this.state.categoriesdata.data[key].text} key={this.state.categoriesdata.data[key].id} />
    }
    renderSubCategoryOptions(key){
		return <Options id={this.state.subcategoriesdata.data[key].id} text={this.state.subcategoriesdata.data[key].text} key={this.state.subcategoriesdata.data[key].id} />
    }

	render (){
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
        $imagePreview = (<img src={imagePreviewUrl} />);
        } else {
        $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }
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
                            <br/>
                        </div>
                        <form role="form"   className="css-form" >
                            
                            <div  className="col-lg-12" >
                                <div  className="form-group ">
                                    <label  className="  control-label">Voucher Code </label>
                                    <div >
                                        <input type="text" name="vouchercode"  onChange={this._onChange}
                                        placeholder="CODE01" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div  className="col-lg-12"  >
                                <div  className="form-group ">
                                    <label  className="  control-label">Voucher Name </label>
                                    <div>
                                        <input type="text" name="vouchername"  onChange={this._onChange}
                                        placeholder="Voucher Name" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div  className="col-lg-6"  >
                                <div  className="form-group ">
                                    <label  className="  control-label">Disc in % </label>
                                    <div>
                                        <input type="number" name="disc"  onChange={this._onChange}
                                        placeholder="10"  className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div  className="col-lg-6"  >
                                <div  className="form-group ">
                                    <label  className=" control-label">Max Claim </label>
                                    <div  >
                                        <input type="number" onChange={this._onChange}
                                        name="maxclaim" placeholder="1" className="form-control" />
                                    </div>
                                </div>
                            </div>
                            
                            <div  className="form-group col-lg-6" id="startdate">
                                <label  className="font-normal">Start date</label>

                                <div  className="input-group date">
                                    <input type="datetime" name="startdate"  onChange={this._onChange}
                                        className="form-control"  />
                                    <span  className="input-group-addon"><i  className="fa fa-calendar"></i></span>
                                </div>
                            </div>
                            <div  className="form-group col-lg-6" id="enddate">
                                <label  className="font-normal">End date</label>

                                <div  className="input-group date">
                                    <input type="datetime" name="enddate"  onChange={this._onChange}
                                        className="form-control" />
                                    <span  className="input-group-addon"><i  className="fa fa-calendar"></i></span>
                                </div>
                            </div>
                        
                            <div  className="form-group ">
                                <label  className="font-normal">Status</label>
                                
                                <div  className="switch">
                                    <div  className="onoffswitch">
                                        <input type="checkbox" name="status"  onChange={this._onChange}
                                            className="onoffswitch-checkbox" id="status" />
                                        <label  className="onoffswitch-label" htmlFor="status" >
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

export default VoucherNew;
