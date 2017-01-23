import React from 'react';
import autoBind from 'react-autobind';

import UserEdit from './UserEdit';
import UserDeleteConfirm from './UserDeleteConfirm';

class UserRow extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            user : {}
        };
    }

    render() {
        return (
            <tr>
                <td>{this.props.user.name}</td>
                <td>{this.props.user.email}</td>
                <td>{this.props.user.role}</td>
                <td>
                    <UserEdit id={this.props.user.id} user={this.props.user}/>
                    <UserDeleteConfirm id={this.props.user.id} user={this.props.user}/>
                </td>
            </tr>
        );
    }
}

export default UserRow;