import React from 'react';
import autoBind from 'react-autobind';

import Products from '../Products';


class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    renderProduct(key) {
        return <Products details={this.props.products[key]} name={this.props.products[key].product_name} key={key + 'prod-result'} />;
    }

    componentDidMount() {
        console.log(this.props.products);
    }

    render() {
        return (
            <div className="row">
                {Object.keys(this.props.products).map(this.renderProduct)}
            </div>
        );
    }
}

export default SearchResult;