import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import Toggle from 'react-toggle';
import SweetAlert from 'sweetalert-react';
import axios from 'axios';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';

import 'sweetalert/dist/sweetalert.css';

import Options from '../helper/Options';
import backend from '../../configs/backend';
import frontend from '../../configs/frontend';

class EditProduct extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            showModal: false,
            imagePreviewUrl: '',
            product: {
                product_name: '',
                package_code: '',
                price: '',
                category_id: '',
                sub_category_id: '',
                description: '',
                compatibility: '',
                urldownload: '',
                is_active: false,
                images: '',
                fileformat: '',
            },
            categories: {
                data: {}
            },
            subcategories: {
                data: {}
            },
            swal: {
                show: false,
                title: '',
                message: '',
                type: 'info',
                confirm_button: true,
            }
        }
        this.validatorTypes = strategy.createSchema(
            {
                product_name: 'required',
                package_code: 'required',
                price: 'required',
                category_id: 'required|not_in:1',
                sub_category_id: 'required|not_in:1',
                compatibility: 'required',
                urldownload: 'required|url',
            }
        );
        this._handleImageChange = this._handleImageChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    close() {
        this.setState({ showModal: false });
    }
    open() {
        var token = cookie.load('token');

        let productUpdated = this.state.product;
        productUpdated['fileformat'] = '';
        this.setState({ product: productUpdated });

        this.loadCategoryOptions(token);
        this.loadSubcategoryOptions(token, this.state.product.category_id);
        this.setState({ showModal: true });
    }
    optionCategoryChange(e) {
        this._onChange(e);
        var token = cookie.load('token');
        this.loadSubcategoryOptions(token, e.target.value);

        let newProduct = this.state.product;
        let sub_category_id = this.state.product.sub_category_id;
        newProduct['sub_category_id'] = '';

        Object.keys(this.state.subcategories).map(function (subcategory) {
            if (subcategory.id == sub_category_id) {
                newProduct['sub_category_id'] = sub_category_id;
            }
        });

        this.setState({ product: newProduct });
    }
    optionSubCategoryChange(e) {

        this._onChange(e);
    }
    loadCategoryOptions(token) {
        fetch(backend.url + `/api/category`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(result => result.json())
            .then(categories => this.setState({ categories }))

    }
    loadSubcategoryOptions(token, cat) {
        fetch(backend.url + `/api/subcategory/getbycatid/` + cat, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(result => result.json())
            .then(subcategories => this.setState({ subcategories }))
    }
    componentWillMount() {
        var token = cookie.load('token');
        this.setState({ product: this.props.details });

        if (this.props.details.images) {
            this.setState({ imagePreviewUrl: this.props.details.images[0].image_url });
        }
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        let filename = e.target.value;
        let fileformat = filename.split('.').pop();

        reader.onloadend = () => {
            let newProduct = this.state.product;
            newProduct['images'] = reader.result;
            newProduct['fileformat'] = fileformat;
            this.setState({ product: newProduct });
            this.setState({ imagePreviewUrl: reader.result });
        }


        reader.readAsDataURL(file)
    }
    _create() {
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
        }).put('/api/product/' + this.props.id, {
            product_name: this.state.product.product_name,
            package_code: this.state.product.package_code,
            price: this.state.product.price,
            category_id: this.state.product.category_id,
            sub_category_id: this.state.product.sub_category_id,
            description: this.state.product.description,
            compatibility: this.state.product.compatibility,
            urldownload: this.state.product.urldownload,
            is_active: this.state.product.is_active,
            images: this.state.product.images,
            fileformat: this.state.product.fileformat,
        }).then(response => {
            let swal = this.state.swal;
            if (response.data.error) {
                swal.title = 'Failed';
                swal.type = 'error';
            } else {
                swal.title = 'Success';
                swal.type = 'success';
                swal.confirm_button = true;
            }
            swal.text = response.data.message;
            this.setState({ swal: swal });
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
    _onSubmit(e) {
        e.preventDefault();
        var xhr = this._create();
        this.props.validate(error => {
            if (!error) {
                this._create();
            }
        });
    }
    _onChange(e) {
        let newProduct = this.state.product;
        newProduct[e.target.name] = $.trim(e.target.value);
        this.setState({ product: newProduct });
        console.log(this.state);
    }
    _onChangeToggle(e) {
        let newProduct = this.state.product;
        newProduct['is_active'] = !this.state.product.is_active;
        this.setState({ product: newProduct });
        console.log(this.state);
    }
    renderCategoryOptions(key) {
        return <Options id={this.state.categories.data[key].id} text={this.state.categories.data[key].text} key={this.state.categories.data[key].id} />
    }
    renderSubCategoryOptions(key) {
        return <Options id={this.state.subcategories.data[key].id} text={this.state.subcategories.data[key].text} key={this.state.subcategories.data[key].id} />
    }
    renderErrors(messages) {
        if (messages.length) {
            messages = messages.map((message, i) => <li key={i} className="">{message}</li>);
            return <ul className="errors">{messages}</ul>;
        }
    }
    getValidatorData() {
        return this.state.product;
    }
    getClassName(field) {
        return this.props.isValid(field) ? '' : 'has-error';
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
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} alt="" className="img-responsive" />);
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
                            <br />
                        </div>
                        <form ref='product_form' onSubmit={(e) => this._onSubmit(e)}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className={this.getClassName('product_name') + ' form-group'}>
                                        <label >Product Name </label>
                                        <div >
                                            <input type="text" value={this.state.product.product_name} className="form-control" onChange={this._onChange}
                                                id="product_name" name="product_name" placeholder="Product Name" required=""
                                                onBlur={this.props.handleValidation('product_name')} />
                                            {this.renderErrors(this.props.getValidationMessages('product_name'))}
                                        </div>
                                    </div>
                                    <div className={this.getClassName('package_code') + ' form-group'}>
                                        <label >Package Code </label>
                                        <div >
                                            <input type="text" value={this.state.product.package_code} className="form-control" onChange={this._onChange}
                                                id="package_code" name="package_code" placeholder="package_code" required=""
                                                onBlur={this.props.handleValidation('package_code')} />
                                            {this.renderErrors(this.props.getValidationMessages('package_code'))}
                                        </div>
                                    </div>
                                    <div className={this.getClassName('price') + ' form-group'}>
                                        <label >Price </label>
                                        <div >
                                            <input type="text" value={this.state.product.price} className="form-control" onChange={this._onChange}
                                                id="price" name="price" placeholder="price" required=""
                                                onBlur={this.props.handleValidation('price')} />
                                            {this.renderErrors(this.props.getValidationMessages('price'))}
                                        </div>
                                    </div>
                                    <div className={this.getClassName('category_id') + ' form-group'}>
                                        <label >Category </label>
                                        <div >
                                            <select value={this.state.product.category_id}
                                                className="form-control" name="category_id"
                                                onChange={this.optionCategoryChange}
                                                onBlur={this.props.handleValidation('category_id')} >
                                                {Object.keys(this.state.categories.data).map(this.renderCategoryOptions)}
                                            </select>
                                            {this.renderErrors(this.props.getValidationMessages('category_id'))}
                                        </div>
                                    </div>
                                    <div className={this.getClassName('sub_category_id') + ' form-group'}>
                                        <label >Sub Category </label>
                                        <div >
                                            <select value={this.state.product.sub_category_id}
                                                className="form-control" name="sub_category_id"
                                                onChange={this.optionSubCategoryChange}
                                                onBlur={this.props.handleValidation('sub_category_id')} >
                                                <option disabled value='' >Select an option</option>
                                                {Object.keys(this.state.subcategories.data).map(this.renderSubCategoryOptions)}
                                            </select>
                                            {this.renderErrors(this.props.getValidationMessages('sub_category_id'))}
                                        </div>
                                    </div>
                                    <div className={this.getClassName('compatibility') + ' form-group'}>
                                        <label >Compatibility </label>
                                        <div >
                                            <input type="text" value={this.state.product.compatibility} className="form-control" onChange={this._onChange}
                                                id="compatibility" name="compatibility"
                                                placeholder="compatibility" required=""
                                                onBlur={this.props.handleValidation('compatibility')} />
                                            {this.renderErrors(this.props.getValidationMessages('compatibility'))}
                                        </div>
                                    </div>
                                    <div className={this.getClassName('urldownload') + ' form-group'}>
                                        <label >Url Download </label>
                                        <div >
                                            <input type="url" value={this.state.product.urldownload} className="form-control" onChange={this._onChange}
                                                id="urldownload" name="urldownload"
                                                placeholder="urldownload" required=""
                                                onBlur={this.props.handleValidation('urldownload')} />
                                            {this.renderErrors(this.props.getValidationMessages('urldownload'))}
                                        </div>
                                    </div>
                                    <div className={this.getClassName('status') + ' form-group'}>
                                        <label>
                                            Status
                                        </label>
                                        <span className="pull-right">
                                            <Toggle
                                                defaultChecked={this.state.product.is_active}
                                                name="is_active"
                                                onChange={this._onChangeToggle} />
                                        </span>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className={this.getClassName('description') + ' form-group'}>
                                        <label >Description </label>
                                        <div >
                                            <textarea rows="7" cols="100%" className="form-control"
                                                value={this.state.product.description} onChange={this._onChange}
                                                id="description" name="description" placeholder="description" required="" />
                                        </div>
                                    </div>
                                    <div className={this.getClassName('images') + ' form-group'}>
                                        <label className="col-lg-5 control-label">Image </label>
                                        <div className="col-lg-7">
                                            <input type="file" className="form-control" onChange={(e) => this._handleImageChange(e)}
                                                id="images" name="images" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        {$imagePreview}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success block  m-b">Save</button>
                            <br />

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
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
        )
    }
};

EditProduct = validation(strategy)(EditProduct);

export default EditProduct;
