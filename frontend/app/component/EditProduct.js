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

class EditProduct extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            product_name : '',
            package_code: '',
            price: '',
            category_id: 4,
            sub_category_id: 0,
            description: '',
            compatibility : '',
            urldownload: '',
            status:'',
            images: {},
            imagePreviewUrl: '',
            fileformat: '',
            showModal: false,
            voucher : {
                data : {}
            },
            product:{},
            categoriesdata:{
                data:{}
            },
            subcategoriesdata:{
                data:{}
            },
            selectedOption: 0
        }
        this._handleImageChange = this._handleImageChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    close() {
        this.setState({ showModal: false });
    }
    open() {
        var token = cookie.load('token');
        this.loadCategoryOptions(token);
        this.loadSubcategoryOptions(token, this.state.category_id);
        this.setState({ showModal: true });
        console.log(this.state);

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
    loadCategoryOptions(token){
		fetch(backend.url + `/api/category`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(categoriesdata=>this.setState({categoriesdata}))
            //console.log(result)
        
	}
    loadSubcategoryOptions(token, cat){
		fetch(backend.url + `/api/subcategory/getbycatid/`+cat, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(subcategoriesdata=>this.setState({subcategoriesdata}))
            //console.log(result)
        
	}
    componentWillMount() {
        var token = cookie.load('token');
        
        this.setState(this.props.details);
        console.log(this.props.details.id);
        this.setState({imagePreviewUrl :this.props.details.images[0].image_url});
        //console.log(this.props.details);
        //this.loadCategoryOptions(token);
        //this.loadSubcategoryOptions(token, this.state.category_id);
        
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
        url: backend.url + '/api/product/'+this.props.id,
        type: 'PUT',
        data: {
            product_name : this.state.product_name,
            package_code: this.state.package_code,
            price: this.state.price,
            category_id: this.state.category_id,
            sub_category_id: this.state.sub_category_id,
            description: this.state.description,
            compatibility : this.state.compatibility,
            urldownload: this.state.urldownload,
            status:this.state.status,
            images:this.state.images,
            fileformat:this.state.fileformat,
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
        $imagePreview = (<img src={imagePreviewUrl} alt=""  className="img-responsive" />);
        } else {
        $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }
        //console.log(this.state);
		return (
            <div className="row">
                <div className="col-sm-12">
                    <a className=" pull-right" 
                        onClick={this.open} >
                        <i className="fa fa-pencil"></i></a>
                </div>
                <Modal bsSize="large" aria-labelledby="contained-modal-title-lg" show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Product Dialog</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row text-center">
                            <h3>Create New Product</h3>
                            <br/>
                        </div>
                        <form ref='product_form' onSubmit={(e)=>this._onSubmit(e)}>
                        <div className="row">
                          <div className="col-lg-6">  
                            <div className="form-group">
                                <label >Product Name </label>
                                <div >
                                    <input type="text" value={this.state.product_name} className="form-control" onChange={this._onChange} 
                                    id="product_name" name="product_name" placeholder="Product Name" required="" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label >Package Code </label>
                                <div >
                                    <input type="text" value={this.state.package_code} className="form-control" onChange={this._onChange} 
                                    id="package_code" name="package_code" placeholder="package_code" required="" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label >Price </label>
                                <div >
                                    <input type="text" value={this.state.price} className="form-control" onChange={this._onChange} 
                                    id="price" name="price" placeholder="price" required="" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label >Category </label>
                                <div >
                                    <select value={this.state.category_id} className="form-control" onChange={this.optionCategoryChange}>
                                        {Object.keys(this.state.categoriesdata.data).map(this.renderCategoryOptions)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label >Sub Category </label>
                                <div >
                                    <select value={this.state.sub_category_id} className="form-control" onChange={this.optionSubCategoryChange}>
                                        {Object.keys(this.state.subcategoriesdata.data).map(this.renderSubCategoryOptions)}
                                    </select>
                                    
                                </div>
                            </div>
                            <div className="form-group">
                                <label >Compatibility </label>
                                <div >
                                    <input type="text" value={this.state.compatibility} className="form-control" onChange={this._onChange} 
                                    id="compatibility" name="compatibility" placeholder="compatibility" required="" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label >Url Download </label>
                                <div >
                                    <input type="url" value={this.state.urldownload} className="form-control" onChange={this._onChange} 
                                    id="urldownload" name="urldownload" placeholder="urldownload" required="" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label >Status </label>
                                <div >
                                    <input type="text" value={this.state.status} className="form-control" onChange={this._onChange} 
                                    id="status" name="status" placeholder="status" required="" />
                                </div>
                            </div>
                          </div>
                          <div className="col-lg-6"> 
                            <div className="form-group">
                                <label >Description </label>
                                <div >
                                    <textarea rows="7" cols="100%" className="form-control"
                                    value={this.state.description} onChange={this._onChange} 
                                    id="description" name="description" placeholder="description" required="" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-5 control-label">Image </label>
                                <div className="col-lg-7">
                                    <input type="file"  className="form-control" onChange={(e)=>this._handleImageChange(e)}  
                                    id="images" name="images"  />
                                </div>
                            </div>
                            <div className="form-group">
                                {$imagePreview}
                            </div>
                            
                            
                            
                         </div>
                        </div>
                        
                            <button type="submit" className="btn btn-success block  m-b">Save</button>
                        
                        <br/>
                            
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
		)
	}
};
//<input type="number" className="form-control" onChange={this._onChange} 
                                    //id="category_id" name="category_id" placeholder="category_id" required="" />

export default EditProduct;
