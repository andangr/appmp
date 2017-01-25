import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import axios from 'axios';

import VoucherRow from './VoucherRow';
import VoucherNew from './VoucherNew';
import Pagination from 'react-js-pagination';

import backend from '../../configs/backend';

class VouchermgPane extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            balance: {},
            vouchers: [],
            pagination: {
                total: 0,
                count: 0,
                per_page: 0,
                current_page: 1,
                total_pages: 1
            }
        };
    }
    loadVouchersData(token, page) {
        axios.create({
            baseURL: backend.url,
            timeout: 1000,
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).get('/api/vouchers?page=' + page)
            .then((response) => {
                this.setState({ vouchers: response.data.data, pagination: response.data.meta.pagination });
            });
    }

    handlePageChange(page) {
        var token = cookie.load('token');
        this.loadVouchersData(token, page);
    }
    componentWillMount() {
        this.handlePageChange(1);

    }
    renderTable(key) {
        return (<VoucherRow details={this.state.vouchers[key]} key={this.state.vouchers[key].id} />);
    }
    render() {
        return (
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Voucher Management</h2>

                    </div>
                    <div className="col-lg-2">

                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox float-e-margins">
                                <div className="ibox-title text-center">
                                    <h3><i className="fa fa-pencil"></i> Vouchers List</h3>

                                </div>

                                <div className="ibox-content">
                                    <VoucherNew />

                                    <table className="footable table table-stripped toggle-arrow-tiny" data-page-size="8">
                                        <thead>
                                            <tr>

                                                <th >Code</th>
                                                <th>Name</th>
                                                <th>Disc %</th>
                                                <th>Startdate</th>
                                                <th>Enddate</th>
                                                <th>MaxClaim</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(this.state.vouchers).map(this.renderTable)}
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

export default VouchermgPane;