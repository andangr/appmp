import React from 'react';
import autoBind from 'react-autobind';

import Menu from './Menu';
import ProductRow from './ProductRow';
import backend from '../configs/backend';
import frontend from '../configs/frontend';

class CategoryPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            "products": {}
        }
    }
	loadData(catid){
		fetch(backend.url + `/home/category/`+catid+`/0`)
			.then(result=>result.json())
			.then(products=>this.setState({products}))
	}
	// Handle when user navigates to a conversation directly without first loading the index...
	componentWillMount() {
			this.loadData(this.props.params.catid);
	}
	// Handle when User navigates between conversations
	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		this.loadData(nextProps.params.catid);
	}
	renderList (key){
		return <ProductRow name={this.state.products[key].name} productlist={this.state.products[key].products} key={this.state.products[key].id} />
	}

	render (){
		console.log(this.state.products);
		console.log('params ');
		console.log(this.props.params);
		return (
             <div>
			 		<header className ="jumbotron hero-spacer">
						<img className = "hero-spacer img" src={frontend.url + '/uploads/images/banner-diskon-web-1.png'} alt="" />
						
					</header>
					{Object.keys(this.state.products).map(this.renderList)}
			 </div>
		)
	}
};

export default CategoryPane;
