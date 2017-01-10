import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import autoBind from 'react-autobind';
import { Link } from 'react-router';

class Menu extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    
	render () {
		console.log(this.props.name);
		return (
			<li>
				<Link to={'/category/' + encodeURIComponent(this.props.index)} >{this.props.name}</Link>
			</li>
		);
	}
};

                        
export default Menu;