import React from 'react';
import autoBind from 'react-autobind';

import Menu from './Menu';
import Products from './Products';

class MyOrdersRow extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
    }

	renderProduct (key){
		return <Products details={this.props.productlist[key]} name={this.props.productlist[key].product_name} key={this.props.productlist[key].id} />
	}

	render (){
		//console.log(this.props.productlist);
		return (
            <tr>
                <td><input  type="checkbox" /></td>
                <td>{this.props.details.id}</td>
                <td>{this.props.details.product_name}</td>
                <td>{this.props.details.amount}</td>
                <td>{this.props.details.payment_method}</td>
                <td>{this.props.details.created}</td>
                <td>{this.props.details.times_download}</td>
                <td>{this.props.details.status_payment}</td>
            </tr>
		)
	}
};

export default MyOrdersRow;
