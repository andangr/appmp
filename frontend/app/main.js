import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, hashHistory, IndexRoute } from 'react-router';


import App from './App'; 
import CategoryPane from './component/CategoryPane';
import ProductPane from './component/ProductPane';
import LoginPane from './component/LoginPane';
import Logout from './component/Logout';
import RegisterPane from './component/RegisterPane';
import MyRoomPane from './component/MyRoomPane';
import CreateProductPane from './component/CreateProductPane';
import ProductDetailsPane from './component/ProductDetailsPane';
import PaymentConfirmationPane from './component/PaymentConfirmationPane';
import ProductDownload from './component/ProductDownload';
import ProductPaymentThankyou from './component/ProductPaymentThankyou';
import VouchermgPane from './component/VouchermgPane';
 
ReactDOM.render((
	<Router history={hashHistory} >
		<Route path="/" component={App}>
			<IndexRoute component={ProductPane}></IndexRoute>
			<Route path="/category/:catid" component={CategoryPane}></Route>
			<Route path="/details/:productid" component={ProductDetailsPane}></Route>
			<Route path="/login" component={LoginPane}></Route>
			<Route path="/logout" component={Logout}></Route>
			<Route path="/myroom" component={MyRoomPane}></Route>
			<Route path="/register" component={RegisterPane}></Route>
			<Route path="/createproduct" component={CreateProductPane}></Route>
			<Route path="/vouchermg" component={VouchermgPane}></Route>
			<Route path="/payment/thankyou/:id" component={ProductPaymentThankyou}></Route>
			<Route path="/product/download/:id/:tokendownload" component={ProductDownload} />
			<Route path="/confirmation" component={PaymentConfirmationPane}></Route>
		</Route>
	</Router>
), document.getElementById('wrapper'))
