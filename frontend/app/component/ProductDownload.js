import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import GetProduct from './GetProduct';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class ProductDownload extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            "id": 0,
            "product_name": "",
            "package_code": "",
            "price": "",
            "description": "",
            "category_id": 4,
            "sub_category_id": 0,
            "compatibility": "",
            "urldownload": "",
            "status": "",
            "created": "",
            "imagePreviewUrl": "",
            "category": "",
            "subcategory": ""
        }
    }
    loadProductData(token, id){
		fetch( backend.url +`/api/landing/product/`+id+`/detail`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(resp=>this.setState(resp))
        
	}
    componentWillMount() {
        var token = cookie.load('token');
		this.loadProductData(token, this.props.params.id)
        console.log(this.props.params.id +' == '+ this.props.params.tokendownload);
	}
    _create () {
        var token = cookie.load('token');
        return $.ajax({
        url: backend.url + '/api/product/generatedownloadurl',
        type: 'POST',
        data: {
            id : this.props.params.id, token : this.props.params.tokendownload
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
            this.setState({loading: true});
        }.bind(this)
        })
    }
    download(e){
        e.preventDefault();
        
        var xhr = this._create();
        xhr.done(this._onSuccess)
        .fail(this._onError)
        .always(this.hideLoading)
    }
    _onSuccess (data, replace) {
        console.log(data);
        console.log("success");
        if(data.code == 200){
            window.open(data.downloadurl, "_blank");
            //window.location = data.downloadurl;
        } else if(data.code == 401) {
            alert("Token expired, please re-login");
        } else {
            alert("you got some error, please contact administrator");
        }
        
    }
    _onError (data) {
        console.log(data);
        console.log("error");
        var message = "Failed to login"; 
        var res = data.responseJSON;
        if(res.message) {
        message = data.responseJSON.message;
        }
        if(res.errors) {
        this.setState({
            errors: res.errors
        });
        }
    }
    _onChange (e) {
        var state = {};
        state[e.target.name] =  $.trim(e.target.value);
        this.setState(state);
    }
	render (){
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
                                        <h2 className="font-bold m-b-xs">{this.state.product_name}</h2>
                                        <div className="col-md-4  text-center">
                                        </div>
                                        <div className="col-md-4  font-bold m-b-xs text-center">
                                            

                                            <div className="m-b-sm">
                                                <img src={this.state.imagePreviewUrl}  className="img-responsive"  />
                                                
                                            </div>
                                            <p className="font-bold">Click download button below </p>

                                            <div className="text-center">
                                                <button className="btn btn-success btn-sm" onClick={(e)=>this.download(e)}>
                                                <i className="fa fa-download"></i> Download 
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-4  text-center">
                                        </div>
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

export default ProductDownload;

