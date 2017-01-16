import React from 'react';
import { Link } from 'react-router';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import strategy from 'react-validatorjs-strategy';
import SweetAlert from 'sweetalert-react';
import validation from 'react-validation-mixin';

import 'sweetalert/dist/sweetalert.css';

import ProductRow from './ProductRow';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class ResetPasswordPane extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.validatorTypes = strategy.createSchema(
            // First parameter is a list of rules for each element name
            {
                email: 'required|email',
                password: 'required|confirmed|min:6'
            },
            {
                "required.email": "Email is required to be your login username!"
            }
            
        );
        this.state = {
            email: '', 
            password: '',
            loading: false, 
            errors: {},
            alert_show: false,
            alert_title: '',
            alert_message: '',
            alert_type: 'info',
            alert_confirm_button: true,
            token_reset : ''
        }
    }
    componentWillMount() {
        console.log(this.props.location.query);
        this.setState({token_reset : this.props.location.query.token});
	}
    _create () {
        this.setState({
            alert_show: true,
            alert_title: "Please Wait...",
            alert_type: "info",
            alert_confirm_button: false,
            alert_message: "Please wait, we are reseting your user password."
        });
        
        return $.ajax({
        url: backend.url + '/api/auth/reset', 
        type: 'POST',
        data: {
            password: this.state.password,
            password_confirmation : this.state.password,
            email: this.state.email,
            token : this.state.token_reset
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
        if(data.error == false){
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
    renderErrors(messages) {
        if (messages.length) {
            messages = messages.map((message, i) => <li key={i} className="">{message}</li>);
            return <ul className="errors">{messages}</ul>;
        }
    }
    getClassName(field) {
        return this.props.isValid(field) ? '' : 'has-error';
    }

	render (){
		return (
             <div className="ibox-content">
             <div className="row ">
                
                <div className="col-md-4 col-md-offset-4">
                    <div className="row text-center">
                        <h3>Reset Password One Stop Clicking Account</h3>
                    </div>
                    <form className="m-t" ref="registerForm" onSubmit={this._onSubmit}>
                        
                        <div className={this.getClassName('email') + " form-group"}  >
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
                        <div className={this.getClassName('password') + " form-group"}  >
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
                        <div className={this.getClassName('password') + " form-group"}  >
                            <input 
                                type="password" 
                                onChange={this._onChange} 
                                id="password_confirmation" 
                                name="password_confirmation" 
                                className="form-control" 
                                placeholder="Password Confirmation"  
                                onBlur={this.props.handleValidation('password')} 
                            />
                            {this.renderErrors(this.props.getValidationMessages('password'))}
                        </div>
                        <div className="form-group">
                            
                        </div>
                        
                        <button type="submit" className="btn btn-success block full-width m-b">Reset</button>

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

ResetPasswordPane = validation(strategy)(ResetPasswordPane);
export default ResetPasswordPane;
