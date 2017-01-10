import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import autoBind from 'react-autobind';

import cookie from 'react-cookie';
import Options from './Options';

class DynamicSelect extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
        this.state={
            selectedOption: '',
            data : {
                data:{}
            } 
        };
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    optionChange(e){
        this.setState({selectedOption: e.target.value});
        console.log('option changed to '+this.state.selectedOption);
    }
    loadOptionsData(token){
		fetch(``+this.props.url+``, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(data=>this.setState({data}))
            //console.log(result)
        
	}
    componentWillMount() {
            var token = cookie.load('token');
			this.loadOptionsData(token);
	}
    renderOptions(key){
        
		return <Options id={this.state.data.data[key].id} text={this.state.data.data[key].text} key={this.state.data.data[key].id} />
	
    }
	render () {
		return (
            <div>
                <div className="form-group">
                    <label class="col-lg-5 control-label">Category </label>
                    <div class="col-lg-7">
                        <select className="form-control" onChange={this.optionChange}>
                            {Object.keys(this.state.data.data).map(this.renderOptions)}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label class="col-lg-5 control-label">Sub Category </label>
                    <div class="col-lg-7">
                        <input type="number" className="form-control" onChange={this._onChange} 
                        id="sub_category_id" name="sub_category_id" placeholder="sub_category_id" required="" />
                    </div>
                </div>
			</div>
		);
	}
};

                        
export default DynamicSelect;
