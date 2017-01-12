import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import strategy from 'react-validatorjs-strategy';
import SweetAlert from 'sweetalert-react';
import validation from 'react-validation-mixin';

import 'sweetalert/dist/sweetalert.css';

import ProductRow from './ProductRow';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class RegisterPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.validatorTypes = strategy.createSchema(
            // First parameter is a list of rules for each element name
            {
                username: 'required',
                email: 'required|email',
                password: 'required|min:6'
            },
            {
                "required.email": "Email is required to be your login username!"
            }
            
        );
        this.state = {
            username : "", email: "", password: "",
            loading: false, 
            errors: {},
            alert_show: false,
            alert_title: "",
            alert_message: "",
            alert_type: "info",
            alert_confirm_button: true,
            payment : {}
        }
    }
    _create () {
        this.setState({
            alert_show: true,
            alert_title: "Please Wait...",
            alert_type: "info",
            alert_confirm_button: false,
            alert_message: "Please wait, we are registering your user account."
        });

        return $.ajax({
        url: backend.url + '/api/auth/register', 
        type: 'POST',
        data: {
            name : this.state.username,
            password: this.state.password,
            password_confirmation : this.state.password,
            email: this.state.email
        },
        beforeSend: function () {
            this.setState({loading: true, alert_show: true});
        }.bind(this)
        })
    }
    _onSubmit(e){
        e.preventDefault();
        console.log('submit');
        var register = this;
        this.props.validate(function (error) {
            console.log('in validate');
            if (!error) {

                var xhr = register._create();
                xhr.done(register._onSuccess)
                .fail(register._onError)
                .always(register.hideLoading)
            }else{
                console.log(error);
            }
        });
    }
    _onSuccess (data) {
        console.log(data);
        console.log("success");
        cookie.save('token', data.token);
        if(data.code == 200){
            this.setState({
                alert_show: true,
                alert_title: "Success",
                alert_type: "success",
                alert_confirm_button: true,
                alert_message: data.message
            });
        }else {
            this.setState({
                alert_show: true,
                alert_title: "Error",
                alert_type: "error",
                alert_confirm_button: true,
                alert_message: data.message
            });
        }
    }
    getValidatorData() {
        return this.state;
    }  
    _onError (data) {
        console.log(data);
        console.log("error");
        this.setState({
            alert_show: true,
            alert_title: "Error",
            alert_type: "error",
            alert_confirm_button: true,
            alert_message: data.message
        });
    }
    _onChange (e) {
        var state = {};
        state[e.target.name] =  $.trim(e.target.value);
        this.setState(state);
    }
	renderList (key){
		return <ProductRow name={this.state.products[key].name} productlist={this.state.products[key].products} key={this.state.products[key].id} />
	}
    activateValidation(e) {
        strategy.activateRule(this.validatorTypes, e.target.name);
    }
    renderErrors(messages) {
        if (messages.length) {
            messages = messages.map((message, i) => <li key={i} className="">{message}</li>);
            return <ul className="errors">{messages}</ul>;
        }
    }

	render (){
		return (
             <div className="ibox-content">
             <div className="row ">
                
                <div className="col-md-4 col-md-offset-4">
                    <div className="row text-center">
                        <h3>Register to One Stop Clicking</h3>
                    </div>
                    <form className="m-t" ref="registerForm" onSubmit={this._onSubmit}>
                        <div className="form-group">
                            <input 
                                type="text" 
                                onChange={this._onChange} 
                                id="username" name="username" 
                                className="form-control" 
                                placeholder="Name" 
                                onBlur={this.props.handleValidation('username')}
                            />
                            {this.renderErrors(this.props.getValidationMessages('username'))}
                        </div>
                        <div className="form-group">
                            <input 
                                type="email" 
                                onChange={this._onChange} 
                                id="email" name="email" 
                                className="form-control" 
                                placeholder="Email"  
                                onBlur={this.props.handleValidation('email')}
                            />
                            {this.renderErrors(this.props.getValidationMessages('email'))}
                        </div>
                        <div className="form-group">
                            <input 
                                type="password" 
                                onChange={this._onChange} 
                                id="password" 
                                name="password" 
                                className="form-control" 
                                placeholder="Password"  
                                onBlur={this.props.handleValidation('password')} 
                            />
                            {this.renderErrors(this.props.getValidationMessages('password'))}
                        </div>
                        
                        <button type="submit" className="btn btn-success block full-width m-b">Register</button>

                        <p className="text-muted text-center"><small>Already have an account?</small></p>
                        <a className="btn btn-sm btn-white btn-block" >Login</a>
                    </form>
                </div>
            </div>
             <SweetAlert
                    show={this.state.alert_show}
                    title={this.state.alert_title}
                    text={this.state.alert_message}
                    type={this.state.alert_type}
                    showConfirmButton={this.state.alert_confirm_button}
                    onConfirm={() => { 
                            this.setState({ alert_show: false });
                            if(this.state.alert_type == "success"){
                                window.location.href = frontend.url+"/#/login";
                            }
                        } 
                    }
                    onOutsideClick={() => this.setState({alert_show: false})}
                />
             </div>
		)
	}
};

RegisterPane = validation(strategy)(RegisterPane);
export default RegisterPane;
