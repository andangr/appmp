import React from 'react';
import autoBind from 'react-autobind';
import {ButtonToolbar, OverlayTrigger, Button, Popover} from 'react-bootstrap';

import DeleteProductConfirm from './DeleteProductConfirm';
import VoucherEdit from './VoucherEdit';
import VoucherDeleteConfirm from './VoucherDeleteConfirm';

class VoucherRow extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
    }
    edit(id){
        console.log("deleteted")
    }
    deleteProduct(id){
         
    }

	render (){
		return (
            <tr>
                <td>{this.props.details.code }</td>
                <td>{this.props.details.name }</td>
                <td>{this.props.details.disc }</td>
                <td>{this.props.details.startdate }</td>
                <td>{this.props.details.enddate }</td>
                <td>{this.props.details.maxclaim }</td>
                <td>
                    <VoucherEdit id={this.props.details.id} details={this.props.details}/>
                    <VoucherDeleteConfirm  id={this.props.details.id} />
                </td>
            </tr>
		)
	}
};

export default VoucherRow;
//<DeleteProductConfirm id={this.props.details.id}/>