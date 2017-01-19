import React from 'react';
import { Link } from 'react-router';
import SweetAlert from 'sweetalert-react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import axios from 'axios';
import { FacebookLogin } from 'react-facebook-login-component';
import { GoogleLogin } from 'react-google-login-component';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

import 'sweetalert/dist/sweetalert.css';

class SocialLoginPane extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            user: '',
            email: '',
            password: '',
            loading: false,
            alert_show: false,
            alert_title: '',
            alert_message: '',
            alert_type: 'info',
            alert_confirm_button: true,
            errors: {}
        };
    }

    responseFacebook(response) {
        console.log(response);
        this.setState({
            user: response.name,
            email: response.email,
            password: Math.random().toString(36).substring(7)
        });

        this.socialLogin();
    }

    responseGoogle(googleUser) {
        console.log('basic profile');
        console.log(googleUser.getBasicProfile());
        var auth_response = googleUser.getAuthResponse();
        var id_token = auth_response.id_token;
        console.log('auth response');
        console.log(auth_response);
        //anything else you want to do(save to localStorage)...
    }

    socialLogin() {
        axios({
            method: 'post',
            url: backend.url + '/api/social_login',
            headers: {
                Accept: 'application/json'
            },
            data: {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            }
        }).then(response => {
            console.log(response.data);
            if (!response.data.error) {
                cookie.save('token', response.data.access_token);

                window.location.href = frontend.url;
            } else {
                this.setState({
                    alert_show: true,
                    alert_title: 'Error',
                    alert_type: 'error',
                    alert_confirm_button: true,
                    alert_message: response.data.message
                });
            }
        });
    }



    render() {
        return (
            <div>
                <FacebookLogin socialId="1632160397088701"
                    language="en_US"
                    scope="email, public_profile"
                    fields="id, name, email"
                    responseHandler={this.responseFacebook}
                    xfbml={true}
                    version="v2.8"
                    class="facebook-login"
                    buttonText="Login With Facebook" />
                <GoogleLogin socialId="312488365228-g2mcp8jg208naea308o2f4j1qd4th0bc.apps.googleusercontent.com"
                    class="google-login"
                    scope="profile"
                    responseHandler={this.responseGoogle}
                    buttonText="Login With Google" />
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

export default SocialLoginPane;