import React from 'react';
import {Link} from 'react-router';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import SweetAlert from 'sweetalert-react';

import ProductRow from './ProductRow';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

import 'sweetalert/dist/sweetalert.css';

export default class LoginPane extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            user: "", 
            email: "", 
            password: "", 
            loading: false, 
            alert_show: false,
            alert_title: "",
            alert_message: "",
            alert_type: "info",
            alert_confirm_button: true,
            errors: {}
        }
    }

    _create() {
        this.setState({
            alert_show: true,
            alert_title: "Logging In",
            alert_type: "info",
            alert_confirm_button: false,
            alert_message: "Please Wait . . ."
        });
        return $.ajax({
            url: backend.url + '/api/auth/token',
            type: 'POST',
            data: {
                username: this.state.user,
                password: this.state.password
            },
            beforeSend: function () {
                this.setState({ alert_show: true, alert_title: "Loggin In", alert_message: "Please wait . . ." });
            }.bind(this)
        })
    }
    _onSubmit(e) {
        e.preventDefault();
        var xhr = this._create();
        xhr.done(this._onSuccess)
            .fail(this._onError)
            .always(this.hideLoading)
    }
    _onSuccess(data) {
        //this.refs.login_form.getDOMNode().reset();
        //this.setState(this.getInitialState());.
        console.log(data);
        console.log("success");
        cookie.save('token', data.access_token);

        window.location.href = frontend.url;
        // show success message
    }
    _onError(data) {
        var response = data.responseJSON;
        console.log(response.error);
        console.log(response.message);
        this.setState({
            alert_show: true,
            alert_title: "Error",
            alert_type: "error",
            alert_confirm_button: true,
            alert_message: response.message
        });
    }
    _onChange(e) {
        var state = {};
        state[e.target.name] = $.trim(e.target.value);
        this.setState(state);
    }


    render() {
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
                        <button className="btn btn-success block full-width m-b">Login</button>
                        <br />
                        <a href="#">
                            <small>Forgot password?</small>
                        </a>

                        <p className="text-muted text-center">
                            <small>Do not have an account?</small>
                        </p>
                        <Link className="btn btn-sm btn-white btn-block" to={'/register'}>Create an account </Link> 
                    </form>
                </div>
                <SweetAlert
                    show={this.state.alert_show}
                    title={this.state.alert_title}
                    text={this.state.alert_message}
                    type={this.state.alert_type}
                    showConfirmButton={this.state.alert_confirm_button}
                    onConfirm={() => this.setState({ alert_show: false })}
                    onOutsideClick={() => this.setState({alert_show: false})}
                />
            </div>
        )
    }
};

