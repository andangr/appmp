import React from 'react';

import '../../assets/css/bootstrap-social.css';

export default class GoogleLogin extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        (function (d, s, id) {
            var js, gs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = 'https://apis.google.com/js/platform.js';
            gs.parentNode.insertBefore(js, gs);
        } (document, 'script', 'google-platform'));
    }

    checkLoginState(response) {
        if (auth2.isSignedIn.get()) {
            var profile = auth2.currentUser.get().getBasicProfile();
        } else {
            if (this.props.responseHandler) {
                this.props.responseHandler({ status: response.status });
            }
        }
    }

    clickHandler() {
        var socialId = this.props.socialId,
            responseHandler = this.props.responseHandler,
            scope = this.props.scope;

        gapi.load('auth2', function () {
            var auth2 = gapi.auth2.init({
                client_id: socialId,
                fetch_basic_profile: false,
                scope: scope
            });
            auth2.signIn().then(function (googleUser) {
                responseHandler(googleUser);
            });
        });
    }

    render() {
        return (
            <div>
                <button className="btn btn-block btn-social btn-google" onClick={this.clickHandler.bind(this)}>
                    <span className="fa fa-google"></span>{this.props.buttonText}
                </button>
            </div>
        );
    }
}