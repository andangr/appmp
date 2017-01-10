import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import autoBind from 'react-autobind';

class Options extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    
	render () {
		console.log(this.props.id+' '+this.props.text);
		return (
            <option value={this.props.id}>{this.props.text}</option>
			
		);
	}
};

                        
export default Options;
/*
*/