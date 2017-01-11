import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';

import ProductListRow from './ProductListRow';
import CreateNewProduct from './CreateNewProduct';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class CreateProductPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            "product_name" : '',
            "package_code": '',
            "price": '',
            "category_id": 0,
            "sub_category_id": 0,
            "description": '',
            "compatibility" : '',
            "urldownload": '',
            "status":'',
            "images":'',
            "imagePreviewUrl": '',
            fileformat: '',
            "showModal": false,
            "balance": {},
            "products": {}
        }
        
    }
    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }
	loadOrdersData(token){
		fetch(backend.url + `/api/product`, { 
                headers: {
                    'Accept' : 'application/json',
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(products=>this.setState({products}))
        
	}
    componentWillMount() {
            var token = cookie.load('token');
			this.loadOrdersData(token);
	}
    
    renderTable (key){
		return <ProductListRow details={this.state.products[key]} key={this.state.products[key].id} />
	}
    
    
	render (){
        
		return (
            <div>            
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Product Management</h2>
                        
                    </div>
                    <div className="col-lg-2">

                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox float-e-margins">
                                <div className="ibox-title text-center">
                                    <h3><i className="fa fa-pencil"></i> Products List </h3>
                                    
                                </div>
                                <div className="ibox-content animated fadeInRight">
                                    <CreateNewProduct />
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                            <tr>

                                                
                                                <th>ID</th>
                                                <th>Product Name</th>
                                                <th>Description</th>
                                                <th>Category</th>
                                                <th>Sub Category</th>
                                                <th>Price</th>
                                                <th>Status</th>
                                                <th>Action </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(this.state.products).map(this.renderTable)}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
		)
	}
};

export default CreateProductPane;
