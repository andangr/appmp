import React from 'react';
import { Link } from 'react-router';
import autoBind from 'react-autobind';


import BasicMenu from './BasicMenu';
import ConditionalMenu from './ConditionalMenu';
import MenusPane from '../component/MenusPane';


class TopNav extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            items : {}
        };
    }

    render() {
        return (
			<div>
			<div className="container-fluid">
				<div className="navbar-header">
					<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
						<span className="sr-only">Toggle navigation</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<Link className="navbar-brand" to={'/'} >1StopClick</Link>
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
}

export default TopNav;
