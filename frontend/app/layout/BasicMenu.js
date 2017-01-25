import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Link } from 'react-router';

class BasicMenu extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    renderMenus(key) {
        console.log(key);
        return '';
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
            </ul>
        );
    }
    render() {
        
        return (
			<div className="collapse navbar-collapse col-md-6 pull-right">
                {this.getBasicMenu()}
                <ul className="nav navbar-nav">
                    <li><Link to={'/search'} ><span className="glyphicon glyphicon-search"></span></Link></li>
                </ul>
            </div>
        );
    }
}

export default BasicMenu;
