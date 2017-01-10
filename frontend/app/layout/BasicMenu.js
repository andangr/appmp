import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Link } from 'react-router';

class BasicMenu extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
    }

	renderMenus (key){
		return "";
	}
    getBasicMenu(){
        var token = cookie.load('token');
        if(token){
            return (
            <ul className="nav navbar-nav">
                <li ><Link to={'/myroom'} >Myroom</Link></li>
                <li ><Link to={'/logout'} >Logout</Link></li>
            </ul>
            );
        }
        return (
            <ul className="nav navbar-nav">
                <li ><Link to={'/login'} >Login</Link></li>
                <li ><Link to={'/register'} >Register</Link></li>
            </ul>);
    }
	render (){
        
		return (
			<div className="collapse navbar-collapse col-md-6">
                {this.getBasicMenu()}
			 </div>
		)
	}
};

export default BasicMenu;
