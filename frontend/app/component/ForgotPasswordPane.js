import React from 'react';
import { Link } from 'react-router';
import autoBind from 'react-autobind';
import SweetAlert from 'sweetalert-react';
import validation from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

import 'sweetalert/dist/sweetalert.css';

class ForgotPasswordPane extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            email: '',
            alert_show: false,
            alert_title: '',
            alert_message: '',
            alert_type: 'info',
            alert_confirm_button: true,
            errors: {}
        };

        this.validatorTypes = strategy.createSchema(
            {
                email: 'required|email'
            },
            {
                'required.email': 'Without an :attribute we can\'t check whether you have account!'
            }
        );
    }

    _onSubmit(e) {
        e.preventDefault();
        var login = this;
        this.props.validate();
        this.props.validate(function (error) {
            if (!error) {
                var xhr = login._create();
                xhr.done(login._onSuccess)
                    .fail(login._onError)
                    .always(login.hideLoading);
            }
        });

    }

    _create() {
        return $.ajax({
            url: backend.url + '/api/forgot_password',
            type: 'POST',
            data: {
                email: this.state.email
            },
            beforeSend: function () {
                this.setState({
                    alert_show: true,
                    alert_title: 'Sending your request',
                    alert_type: 'info',
                    alert_confirm_button: false,
                    alert_message: 'Please Wait . . .'
                });
            }.bind(this)
        });
    }

    _onSuccess(data) {
        console.log(data);
        console.log('success');

        // window.location.href = frontend.url;
    }

    _onError(data) {
        var response = data.responseJSON;
        console.log(response.error);
        console.log(response.message);
        this.setState({
            alert_show: true,
            alert_title: 'Error',
            alert_type: 'error',
            alert_confirm_button: true,
            alert_message: response.message
        });
    }

    _onChange(e) {
        var state = {};
        state[e.target.name] = $.trim(e.target.value);
        this.setState(state);
    }

    getValidatorData() {
        return this.state;
    }

    getClassName(field) {
        return this.props.isValid(field) ? '' : 'has-error';
    }

    renderErrors(messages) {
        if (messages.length) {
            messages = messages.map((message, i) => <li key={i} className="">{message}</li>);
            return <ul className="errors">{messages}</ul>;
        }
    }

    render() {
        return (
            <div className="ibox-content">
                <div className="row">

                    <div className="col-md-4 col-md-offset-4">
                        <div className="row text-center">
                            <h3>Forgot Password</h3>
                        </div>
                        <form ref='forgot_form' onSubmit={this._onSubmit}>
                            <div className={this.getClassName('email') + ' form-group'}>
                                <input
                                    type="email"
                                    className="form-control"
                                    onChange={this._onChange}
                                    name="email"
                                    placeholder="Email"
                                    onBlur={this.props.handleValidation('email')} />

                                {this.renderErrors(this.props.getValidationMessages('email'))}
                            </div>

                            <button className="btn btn-success block full-width m-b">Send the request</button>
                            <br />

                            <p className="text-muted text-center">
                                <small>Already remember your password?</small>
                            </p>
                            <Link className="btn btn-sm btn-white btn-block" to={'/login'}>Login </Link>
                        </form>
                    </div>
                </div>
                <SweetAlert
                    show={this.state.alert_show}
                    title={this.state.alert_title}
                    text={this.state.alert_message}
                    type={this.state.alert_type}
                    showConfirmButton={this.state.alert_confirm_button}
                    onConfirm={() => this.setState({ alert_show: false })}
                    onOutsideClick={() => this.setState({ alert_show: false })}
                    />
            </div>
        );
    }
}

ForgotPasswordPane = validation(strategy)(ForgotPasswordPane);

export default ForgotPasswordPane;