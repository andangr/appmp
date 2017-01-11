import React from 'react';
import autoBind from 'react-autobind';

import Menu from './Menu';
import ProductRow from './ProductRow';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class ProductPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            "products": {}
        }
    }
	loadHomeData(){
		fetch( backend.url + `/home/products`)
			.then(result=>result.json())
			.then(products=>this.setState({products}))
	}
	// Handle when user navigates to a conversation directly without first loading the index...
	componentWillMount() {
		
			this.loadHomeData();
		
	}

	renderList (key){
		return <ProductRow name={this.state.products[key].name} productlist={this.state.products[key].products} key={this.state.products[key].id} />
	}

	render (){
		return (
             <div>
			 		<header className ="jumbotron hero-spacer">
						<img className = "hero-spacer img" src={'http://172.19.16.156:8010/uploads/images/banner-diskon-web-1.png'} alt="" />
						
					</header>
					{Object.keys(this.state.products).map(this.renderList)}
			 </div>
		)
	}
};

export default ProductPane;
