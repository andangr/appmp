import React from 'react';
import autoBind from 'react-autobind';

import Menu from './Menu';
import Products from './Products';

class ProductRow extends React.Component {
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
            <div>
                <div className="row text-left">
                    <div className="col-lg-12">
                        <h3>{this.props.name}</h3>
                    </div>
                </div>
                <div className="row text-center">
                        {Object.keys(this.props.productlist).map(this.renderProduct)}
                </div>
            </div>
		)
	}
};

export default ProductRow;
