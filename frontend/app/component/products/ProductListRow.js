import React from 'react';
import autoBind from 'react-autobind';
import {ButtonToolbar, OverlayTrigger, Button, Popover} from 'react-bootstrap';

import DeleteProductConfirm from './DeleteProductConfirm';
import EditProduct from './EditProduct';

class ProductListRow extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
    }
    edit(id){
        console.log("deleteted")
    }
    deleteProduct(id){
         
    }

	render (){
		return (
            <tr>
                
                <td>{this.props.details.id}</td>
                <td>{this.props.details.product_name}</td>
                <td>{this.props.details.description}</td>
                <td>{this.props.details.category_id}</td>
                <td>{this.props.details.sub_category_id}</td>
                <td>{this.props.details.price}</td>
                <td>{this.props.details.status}</td>
                <td>
                    <EditProduct id={this.props.details.id} details={this.props.details}/><DeleteProductConfirm id={this.props.details.id}/>
                </td>
            </tr>
		)
	}
};
/*<button className="btn btn-danger btn-sm pull-right" 
                        onClick={this.deleteProduct(this.props.details.id)} >
                        <i className="fa fa-trash"></i> delete</button>*/
export default ProductListRow;
