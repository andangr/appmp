import React from 'react';
import ReactDOM from 'react-dom';

import cookie from 'react-cookie';

var ReactRouter = require('react-router');
var PureRenderMixin = require('react-addons-pure-render-mixin');


var browserHistory = ReactRouter.browserHistory;
var Route = ReactRouter.Route;
var Router = ReactRouter.Router;
var Link = ReactRouter.Link;
 

import BasicMenu from './BasicMenu';
import ConditionalMenu from './ConditionalMenu';
import Menu from '../component/Menu';
import MenusPane from '../component/MenusPane';


var MenuClass = React.createClass({
	getInitialState: function(){
		return {
			"items" : {}
		}
	},
	/*componentWillMount: function(){
		fetch(`http://172.19.16.172:8011/app_dev.php/api/getproductsreact`)
			.then(result=>result.json())
			.then(items=>this.setState({items}))
	},*/
	render: function(){
		return (
			<div>
			<div className="container">
				<div className="navbar-header">
					<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
						<span className="sr-only">Toggle navigation</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<a className="navbar-brand" href="http://172.19.16.156:8020/">1StopClick</a>
				</div>
				<div className="collapse navbar-collapse col-md-6" id="menus">
					<MenusPane />
				</div>
				<BasicMenu />
				
			</div>
			<ConditionalMenu />
			
			</div>
		);
	}
	
})

export default MenuClass;

//ReactDOM.render(<App />, document.getElementById('app'))
