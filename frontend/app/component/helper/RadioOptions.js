import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import autoBind from 'react-autobind';

class RadioOptions extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    
	render () {
		console.log(this.props.id+' '+this.props.text);
		return (
            <div><label >
                <input  type="radio" name={this.props.name} value={this.props.id}
                                                required />  {this.props.text} </label >
            </div>
			
		);
	}
};

                        
export default RadioOptions;
/*
*/