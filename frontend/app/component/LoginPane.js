import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import ProductRow from './ProductRow';
//import Products from './Products';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class LoginPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
    
        this.state = {
            user: "", email: "", password: "", loading: false, errors: {}
        }
    }
	
	// cHandl e when user navigates to a conversation directly without first loading the index...
	componentWillMount() {
	}
    _create () {
        
        return $.ajax({
        url: backend.url + '/api/auth/token',
        type: 'POST',
        data: {
            username: this.state.user,
            password: this.state.password
        },
        beforeSend: function () {
            this.setState({loading: true});
        }.bind(this)
        })
    }
    _onSubmit(e){
        e.preventDefault();
        /*var errors = this._validate();
        if(Object.keys(errors).length != 0) {
        this.setState({
            errors: errors
        });
        return;
        }*/
        var xhr = this._create();
        xhr.done(this._onSuccess)
        .fail(this._onError)
        .always(this.hideLoading)
    }
    _onSuccess (data) {
        //this.refs.login_form.getDOMNode().reset();
        //this.setState(this.getInitialState());.
        console.log(data);
        console.log("success");
        cookie.save('token', data.access_token);
        
        window.location.href = frontend.url;
        // show success message
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
	renderList (key){
		return <ProductRow name={this.state.products[key].name} productlist={this.state.products[key].products} key={this.state.products[key].id} />
	}

	render (){
		return (
             <div className="ibox-content">
             <div className="col-md-4 ">
             </div>
             <div className="col-md-4 ">
                <div className="row text-center">
                    <h3>Login to One Stop Clicking</h3>
                </div>
				<form ref='login_form' onSubmit={this._onSubmit}>
                    <div className="form-group">
                        <input type="text" className="form-control" onChange={this._onChange} id="user" name="user" placeholder="Email" required="" />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" onChange={this._onChange} id="password" name="password" placeholder="Password" required="" />
                    </div>
                    <button type="submit" className="btn btn-success block full-width m-b">Login</button>
                    <br/>
                    <a href="#">
                        <small>Forgot password?</small>
                    </a>

                    <p className="text-muted text-center">
                        <small>Do not have an account?</small>
                    </p>
                    <a className="btn btn-sm btn-white btn-block">Create an account</a>
                </form>
			 </div>
             </div>
		)
	}
};

export default LoginPane;
