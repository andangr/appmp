import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import GetProduct from './GetProduct';

import backend from '../configs/backend';
import frontend from '../configs/frontend';


class ProductPaymentThankyou extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            product: {
                id: '',
                product_name: '',
                package_code: '',
                price: '',
                description: '',
                category_id: '',
                sub_category_id: '',
                compatibility: '',
                urldownload: '',
                status: '',
                created: '',
                imagePreviewUrl: '',
                category: '',
                subcategory: '',
            },
            image: '',
            paymentStatus: '',
            paymentToken: '',
            message: '',
        }
    }
    loadProductData(token, id) {
        console.log(id + ' ' + token);
        fetch(backend.url + `/api/product/details/` + id, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(result => result.json())
            .then(resp => this.setState({ product: resp.data }))
    }
    componentWillMount() {
        let token = cookie.load('token');
        console.log(this.props.location.query);
        let id = this.props.params.id;
        this.setState({ id: this.props.params.id, paymentToken: this.props.location.query.token });
        this.loadProductData(token, id);
        //this.loadProductData();
        if (this.props.location.query.success == "true") {
            this.setState({ image: "http://172.19.16.156:8011/uploads/images/success.png" });
            this.setState({ paymentStatus: "Completed" });
            this.setState({ message: "Your payment for this product has been successful. Please wait, you will redirect to download page in seconds." });
        } else {
            this.setState({ image: "http://172.19.16.156:8011/uploads/images/failed.png" });
            this.setState({ paymentStatus: "Failed" });
            this.setState({ message: "Your payment for this product is failed. Please try again or you can contact administrator if you have any issue." });
        }

    }
    getStatus() {
        console.log("called");
        if (this.state.paymentStatus == "Completed") {
            var idPrd = this.state.id;
            var paymentTkn = this.state.paymentToken;
            setTimeout(function () {
                window.location.href = frontend.url + '/#/product/download/' + idPrd + '/' + paymentTkn;
            }, 5000);
            return (
                <div className="widget style1 navy-bg">
                    <div className="row vertical-align">
                        <div className="col-xs-3">
                            <i className="fa fa-thumbs-up fa-3x"></i>
                        </div>
                        <div className="col-xs-9">
                            <h4 className="font-bold">Payment {this.state.paymentStatus}</h4>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="widget style1 red-bg">
                    <div className="row vertical-align">
                        <div className="col-xs-3">
                            <i className="fa fa-thumbs-down fa-3x"></i>
                        </div>
                        <div className="col-xs-9">
                            <h4 className="font-bold">Payment {this.state.paymentStatus}</h4>
                        </div>
                    </div>
                </div>
            );
        }

    }


    render() {

        console.log(this.state);
        return (
            <div className="col-lg-9">
                <div className="wrapper wrapper-content animated fadeInRight">


                    <div className="row">
                        <div className="col-lg-12">

                            <div className="ibox product-detail">
                                <div className="ibox-content">


                                    <div className="row">
                                        <div className="col-md-5">
                                            <div>
                                                <div className="ibox-content no-padding image-imitation">
                                                    <img src={this.state.product.imagePreviewUrl} className="img-thumbnail" />

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-7">

                                            <h3 className="font-bold m-b-xs">
                                                {this.state.product.product_name}
                                            </h3>
                                            {this.getStatus()}
                                            <div className="small text-muted">
                                                {this.state.message}
                                            </div>
                                            <hr />
                                        </div>
                                    </div>

                                </div>
                                <div className="ibox-footer">

                                    <span className="pull-right">
                                        Full stock - <i className="fa fa-clock-o"></i> 14.04.2016 10:04 pm
                                        </span>
                                    The generated Lorem Ipsum is therefore always free
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default ProductPaymentThankyou;

