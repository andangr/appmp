import React from 'react';
import autoBind from 'react-autobind';

import { Link } from 'react-router';
import Menu from './Menu';

class MenusPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
		
		this.state = {
			"menus" : {}
		}
    }

	componentWillMount() {
		fetch(`http://172.19.16.156:8011/app_dev.php/api/getproductsreact`)
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
