import React from 'react';
import autoBind from 'react-autobind';

import { Link } from 'react-router';
import Menu from './Menu';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class MenusPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
		
		this.state = {
			"menus" : {}
		}
    }

	componentWillMount() {
		fetch(backend.url + `/home/products`)
			.then(result=>result.json())
			.then(menus=>this.setState({menus}))
	}

	renderMenus (key){
		return <Menu name={this.state.menus[key].name} index={this.state.menus[key].id} key={this.state.menus[key].id} />
	}

	render (){
		//console.log(this.props.menus);
		return (
			<ul className="nav navbar-nav">
					{Object.keys(this.state.menus).map(this.renderMenus)}
			 </ul>
		)
	}
};

export default MenusPane;
