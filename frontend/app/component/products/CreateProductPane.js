import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import Pagination from "react-js-pagination";

import ProductListRow from './ProductListRow';
import CreateNewProduct from './CreateNewProduct';

import backend from '../../configs/backend';
import frontend from '../../configs/frontend';

class CreateProductPane extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            showModal: false,
            total: 0,
            balance: {},
            data: {}
        }

    }
    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }
    loadOrdersData(token, pageNumber) {
        fetch(backend.url + `/api/product?page=` + pageNumber, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(result => result.json())
            .then(resp => this.setState(resp.data))

    }
    componentWillMount() {
        var token = cookie.load('token');
        this.loadOrdersData(token);
    }

    renderTable(key) {
        return <ProductListRow details={this.state.data[key]} key={this.state.data[key].id} />
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        var token = cookie.load('token');
        this.loadOrdersData(token, pageNumber);
        this.setState({ activePage: pageNumber });
    }

    render() {
        return (
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Product Management</h2>
                    </div>
                    <div className="col-lg-2">
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox float-e-margins">
                                <div className="ibox-title text-center">
                                    <h3><i className="fa fa-pencil"></i> Products List</h3>
                                </div>
                                <div className="ibox-content animated fadeInRight">
                                    <CreateNewProduct />
                                    <div className="table-responsive">
                                        <table id="data" className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Product Name</th>
                                                    <th>Description</th>
                                                    <th>Category</th>
                                                    <th>Sub Category</th>
                                                    <th>Price</th>
                                                    <th>Status</th>
                                                    <th>Action </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(this.state.data).map(this.renderTable)}
                                            </tbody>
                                        </table>
                                        <Pagination
                                            activePage={this.state.activePage}
                                            itemsCountPerPage={this.state.per_page}
                                            totalItemsCount={this.state.total}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange}
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default CreateProductPane;
