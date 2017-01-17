import React from 'react';
import autoBind from 'react-autobind';

import VoucherEdit from './VoucherEdit';
import VoucherDeleteConfirm from './VoucherDeleteConfirm';

class VoucherRow extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    edit(id) {
        console.log('edit ' + id);
    }
    
    deleteProduct(id) {
        console.log('delete ' + id);
    }

    render() {
        return (
            <tr>
                <td>{this.props.details.code}</td>
                <td>{this.props.details.name}</td>
                <td>{this.props.details.disc}</td>
                <td>{this.props.details.start_date}</td>
                <td>{this.props.details.end_date}</td>
                <td>{this.props.details.max_claim}</td>
                <td>{ (this.props.details.is_active == true) ? 'Active' : 'Not Active' }</td>
                <td>
                    <VoucherEdit id={this.props.details.id} details={this.props.details} />
                    <VoucherDeleteConfirm id={this.props.details.id} />
                </td>
            </tr>
        );
    }
}

export default VoucherRow;