import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import ProductRow from './ProductRow';
//import Products from './Products';

class RegisterPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
    
        this.state = {
            username : "", email: "", password: "", loading: false, errors: {},
            payment : {}
        }
    }
	
	// Handle when user navigates to a conversation directly without first loading the index...
	componentWillMount() {
	}
    _create () {
        
        return $.ajax({
        url: 'http://172.19.16.156:8011/app_dev.php/api/register',
        type: 'POST',
        data: {
            username : this.state.username,
            password: this.state.password,
            email: this.state.email
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
        cookie.save('token', data.token);
        window.location.href = 'http://172.19.16.156:8020/';
        // show success message
    }
    _onError (data) {
        console.log(data);
        console.log("error");
        var message = "Failed to login";
        /*var res = data.responseJSON;
        if(res.message) {
        message = data.responseJSON.message;
        }
        if(res.errors) {
        this.setState({
            errors: res.errors
        });
        }*/
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
        console.log(this.state);
		return (
             <div className="ibox-content">
             <div className="col-md-4 ">
             </div>
             <div className="col-md-4 ">
                <div className="row text-center">
                    <h3>Register to One Stop Clicking</h3>
                </div>
                <form className="m-t" ref="registerForm" onSubmit={this._onSubmit}>
                    <div className="form-group">
                        <input type="text" onChange={this._onChange} id="username" name="username" className="form-control" placeholder="Username" required="" />
                    </div>
                    <div className="form-group">
                        <input type="email" onChange={this._onChange} id="email" name="email" className="form-control" placeholder="Email" required="" />
                    </div>
                    <div className="form-group">
                        <input type="password" onChange={this._onChange} id="password" name="password" className="form-control" placeholder="Password" required="" />
                    </div>
                    
                    <button type="submit" className="btn btn-success block full-width m-b">Register</button>

                    <p className="text-muted text-center"><small>Already have an account?</small></p>
                    <a className="btn btn-sm btn-white btn-block" >Login</a>
                </form>
			 </div>
             </div>
		)
	}
};

export default RegisterPane;
