import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import GetProduct from './GetProduct';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class ProductDetails extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            "id": 0,
            "product_name": "",
            "package_code": "",
            "price": "",
            "description": "",
            "category_id": 4,
            "sub_category_id": 0,
            "compatibility": "",
            "urldownload": "",
            "status": "",
            "created": "",
            "imagePreviewUrl": "",
            "category": "",
            "subcategory": ""
        }
    }
    loadProductData(token, id){
		fetch(backend.url + `/api/landing/product/`+id+`/detail`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(resp=>this.setState(resp))
        
	}
    componentWillMount() {
        var token = cookie.load('token');
		this.loadProductData(token, this.props.params.productid)
	}
    
	render (){
		return (
             <div className="col-lg-12">
                <div className="wrapper wrapper-content animated fadeInRight">

                    <div className="row">
                        <div className="col-lg-12">

                            <div className="ibox product-detail">
                                <div className="ibox-content">

                                    <div className="row">
                                        <div className="col-md-5">
                                                <div>
                                                    <div className="ibox-content no-padding image-imitation">
                                                        <img src={this.state.imagePreviewUrl} className="img-thumbnail" />
                                                        
                                                    </div>
                                                </div>
                                        </div>
                                        <div className="col-md-7">

                                            <h2 className="font-bold m-b-xs">
                                                {this.state.product_name} 
                                            </h2>
                                            <small> {this.state.compatibility}  </small>
                                            <div className="m-t-md">
                                                <h2 className="product-main-price">Rp {this.state.price} <small className="text-muted">Include Tax</small> </h2>
                                            </div>
                                            <hr />

                                            <h4>Product description</h4>

                                            <div className="small text-muted">
                                                {this.state.description}
                                            </div>
                                            <dl className="small m-t-md">
                                                <dt>Description lists</dt>
                                                <dd>A description list is perfect for defining terms.</dd>
                                                <dt>Euismod</dt>
                                                <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
                                                <dd>Donec id elit non mi porta gravida at eget metus.</dd>
                                                <dt>Malesuada porta</dt>
                                                <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
                                            </dl>
                                            <hr />

                                            <div>
                                                <GetProduct details={this.state}/>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="ibox-footer">
                                            <span className="pull-right">
                                                Full stock - <i className="fa fa-clock-o"></i> 14.04.2016 10:04 pm
                                            </span>
                                    The generated Lorem Ipsum is therefore always free
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
		)
	}
};

export default ProductDetails;

