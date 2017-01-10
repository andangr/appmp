import React from 'react';
import autoBind from 'react-autobind';

import { Link } from 'react-router';

class AdminMenuPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
    }
	render (){
		//console.log(this.props.menus);
		return (
			<nav className="navbar-default navbar-static-side" role="navigation">
				<div className="sidebar-collapse">
					
					<ul className="nav metismenu" id="side-menu">
						<li >
							<Link to={'/createproduct'} ><i className="fa fa-diamond"></i> <span className="nav-label">Products</span> </Link>
						</li>
						<li >
							<Link to={'/vouchermg'} ><i className="fa fa-shopping-cart"></i> <span className="nav-label">Voucher Management</span> </Link>
						</li>
					</ul>

				</div>
			</nav>
			
		)
	}
};

export default AdminMenuPane;
/*
<ul className="nav navbar-nav">
			    <li ><Link to={'/products'} >Products</Link></li>
                <li ><Link to={'/banners'} >Banner</Link></li>
                <li ><Link to={'/promo'} >Promo</Link></li>
			</ul>*/