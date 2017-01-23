import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import axios from 'axios';

import Pagination from 'react-js-pagination';
import UserNew from './UserNew';
import UserRow from './UserRow';

import backend from '../../configs/backend';

class UserMgPane extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            users: [],
            pagination: {
                total: 0,
                count: 0,
                per_page: 0,
                current_page: 1,
                total_pages: 1
            }
        };
    }

    loadUsersData(token, page) {
        axios({
            method: 'get',
            url: backend.url + '/api/users?page=' + page,
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).then(response => {
            this.setState({users: response.data.data, pagination: response.data.meta.pagination});
        });
    }

    handlePageChange(page) {
        var token = cookie.load('token');
        this.loadUsersData(token, page);
    }
    componentWillMount() {
        this.handlePageChange(1);
    }

    renderTable(key) {
        return (<UserRow user={this.state.users[key]} key={this.state.users[key].id} />);
    }

    render() {
        return (
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>User Management</h2>

                    </div>
                    <div className="col-lg-2">

                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox float-e-margins">
                                <div className="ibox-title text-center">
                                    <h3><i className="fa fa-pencil"></i> Users List</h3>

                                </div>

                                <div className="ibox-content">
                                    <UserNew/>

                                    <table className="footable table table-stripped toggle-arrow-tiny" data-page-size="8">
                                        <thead>
                                            <tr>
                                                <th >Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(this.state.users).map(this.renderTable)}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="5">
                                                    <ul className="pagination pull-right"></ul>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <Pagination
                                        activePage={this.state.pagination.current_page}
                                        itemsCountPerPage={this.state.pagination.per_page}
                                        totalItemsCount={this.state.pagination.total}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserMgPane;