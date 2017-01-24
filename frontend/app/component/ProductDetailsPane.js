import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import SweetAlert from 'sweetalert-react';

import 'sweetalert/dist/sweetalert.css';

import GetProduct from './GetProduct';
import SosmedShare from './helper/SosmedShare';
import backend from '../configs/backend';
import frontend from '../configs/frontend';

class ProductDetails extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            product: {
                id: 0,
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
            swal: {
                show: false,
                title: '',
                message: '',
                type: 'info',
                confirm_button: true,
            }
        }
    }
    loadProductData(token, id) {

        fetch(backend.url + `/api/product/details/` + id, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(result => result.json())
            .then(resp => this.setState({ product: resp.data }))
    }
    componentWillMount() {
        var token = cookie.load('token');
        this.loadProductData(token, this.props.params.productid);
        console.log(this.state);
    }

    render() {
        const shareUrl = location.protocol + "//" + window.location.host + "/#/product/detail/" + this.props.params.id;
        const title = "What an awesome product. Get it now!!! or explore u'r fav book, movie, music, & app here.";
        return (
            <div className="col-lg-12">
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
                                        <div className="col-md-6">

                                            <h2 className="font-bold m-b-xs">
                                                {this.state.product.product_name}
                                            </h2>
                                            <small> {this.state.product.compatibility}  </small>
                                            <div className="m-t-md">
                                                <h2 className="product-main-price">Rp {this.state.product.price} <small className="text-muted">Include Tax</small> </h2>
                                            </div>
                                            <hr />

                                            <h4>Product description</h4>

                                            <div className="small text-muted">
                                                {this.state.product.description}
                                            </div>
                                            <dl className="small m-t-md">
                                                <dt>Description lists</dt>
                                                <dd>A description list is perfect for defining terms.</dd>
                                                <dt>Euismod</dt>
                                                <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
                                                <dd>Donec id elit non mi porta gravida at eget metus.</dd>
                                                <dt>Malesuada porta</dt>
                                                <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
                                            </dl>
                                            <hr />

                                            <div>
                                                <GetProduct details={this.state.product} />
                                            </div>
                                        </div>
                                        <div className="col-md-1">
                                            <SosmedShare title={title} shareUrl={shareUrl} />
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

export default ProductDetails;

