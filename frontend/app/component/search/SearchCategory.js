import React from 'react';
import autoBind from 'react-autobind';
import axios from 'axios';

import Options from '../helper/Options';

import backend from '../../configs/backend';

class SearchCategory extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            selectedOption: '',
            options: {
                data: []
            }
        };
    }

    componentWillMount() {
        this.loadCategories();
    }

    loadCategories() {
        axios({
            method: 'get',
            url: backend.url + '/api/get_categories',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            let options = this.state.options;
            options.data = response.data;
            this.setState({ options: options, selectedOption: response.data[0].id });
        });
    }

    optionChange(e) {
        this.setState({ selectedOption: e.target.value });
        this.props.changeHandler(e.target.value);
    }

    renderOptions(key) {
        return (
            <Options id={this.state.options.data[key].id} text={this.state.options.data[key].name} key={this.state.options.data[key].id} />
        );
    }

    render() {
        return (
            <select className="form-control" key="-1" onChange={this.optionChange}>
                <option value=''>Select a category</option>
                {Object.keys(this.state.options.data).map(this.renderOptions)}
            </select>
        );
    }
}

export default SearchCategory;