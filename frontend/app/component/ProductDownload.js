import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import SweetAlert from 'sweetalert-react';
import axios from 'axios';

import GetProduct from './GetProduct';
import SosmedShare from './helper/SosmedShare';
import backend from '../configs/backend';
import frontend from '../configs/frontend';


class ProductDownload extends React.Component {
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
        console.log(id + ' download ' + token);
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
        let id = this.props.params.id;
        this.loadProductData(token, id);
    }
    _create() {
        var token = cookie.load('token');
        return $.ajax({
            url: backend.url + '/api/product/generatedownloadurl',
            type: 'POST',
            data: {
                id: this.props.params.id, token: this.props.params.tokendownload
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
                this.setState({ loading: true });
            }.bind(this)
        })
    }
    download(e) {
        e.preventDefault();
        var token = cookie.load('token');
        axios.create({
            baseURL: backend.url,
            timeout: 1000,
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            }
        }).post('/api/product/generatedownloadurl', {
            id: this.props.params.id,
            token: this.props.params.tokendownload
        }).then(response => {
            let swal = this.state.swal;
            if (response.data.error) {
                swal.title = 'Error';
                swal.type = 'error';
                swal.text = 'Something error on this page. Please contact administrator for any help';

                this.setState({ swal: swal });
            } else {
                //this.dismissSwal();
                console.log(response);
                window.open(response.data.downloadurl, '_blank');
            }
        }).catch(error => {
            let swal = this.state.swal;

            swal.confirm_button = true;
            swal.title = 'Error';
            swal.type = 'error';
            swal.text = 'Please check your connection';
            this.setState({ swal: swal });
            console.log(error);
        });

        /*e.preventDefault();

        var xhr = this._create();
        xhr.done(this._onSuccess)
            .fail(this._onError)
            .always(this.hideLoading)*/
    }
    _onChange(e) {
        var state = {};
        state[e.target.name] = $.trim(e.target.value);
        this.setState(state);
    }
    dismissSwal() {
        let swal = this.state.swal;
        swal.show = false;
        this.setState({ swal: swal });
        if (this.state.swal.type == 'success') {
            location.reload();
        }
    }
    render() {
        console.log(this.state);
        const shareUrl = location.protocol + "//" + window.location.host + "/#/product/detail/" + this.props.params.id;
        const title = "What an awesome product. Get it now!!! or explore u'r fav book, movie, music, & app here.";

        return (
            <div className="col-lg-9">

                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox">
                                <div className="ibox-title">
                                    Get Ready to Download
                                </div>
                                <div className="ibox-content  text-center">
                                    <div className="row text-center">
                                        <h2 className="font-bold m-b-xs">{this.state.product.product_name}</h2>
                                        <div className="col-md-4  text-center">
                                        </div>
                                        <div className="col-md-4  font-bold m-b-xs text-center">


                                            <div className="m-b-sm">
                                                <img src={this.state.product.imagePreviewUrl} className="img-responsive" />

                                            </div>
                                            <p className="font-bold">Click download button below </p>

                                            <div className="text-center">
                                                <button className="btn btn-success btn-sm" onClick={(e) => this.download(e)}>
                                                    <i className="fa fa-download"></i> Download
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-1  text-center">
                                            <SosmedShare title={title} shareUrl={shareUrl} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
                <SweetAlert
                    show={this.state.swal.show}
                    title={this.state.swal.title}
                    text={this.state.swal.text}
                    type={this.state.swal.type}
                    showConfirmButton={this.state.swal.confirm_button}
                    onConfirm={this.dismissSwal}
                    onOutsideClick={this.dismissSwal}
                    />
            </div>
        )
    }
};

export default ProductDownload;

