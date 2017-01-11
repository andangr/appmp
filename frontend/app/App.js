import React from 'react';
import ReactDOM from 'react-dom';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import MenuClass from './layout/topnav';
import Menu from './component/Menu';
import MenusPane from './component/MenusPane';
import ProductPane from './component/ProductPane';
import ChatAdmin from './component/ChatAdmin';

import backend from './configs/backend';
import frontend from './configs/frontend';


class App extends React.Component {
	constructor (props) {
		super(props);
		autoBind(this);
	
		this.state = {
				"humans": {},
				"stores": {},
				"items" : {
					products:{}
				}
			}
	}
	componentWillMount(){
		fetch(backend.url + `/home/products`)
			.then(result=>result.json())
			.then(items=>this.setState({items}))
	}
	render() {
		//console.log(this.state);
		//console.log(cookie.load('token'))
		return (
			
        	<div >
				
				<nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
					<MenuClass />
					
				</nav>
				
				 <div id="page-wrapper" className="gray-bg">
					<div className="container">
						
						<div className="row ">
							{this.props.children || <ProductPane />}
						</div>
						
					</div>	
        		</div>
				<ChatAdmin />
        	</div>
        );
	}
	
};

export default App;

//ReactDOM.render(<App />, document.getElementById('app'))
