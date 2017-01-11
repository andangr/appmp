import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class Logout extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
    }

	render (){
        cookie.remove('token');
        cookie.remove('role');
		window.location.href = frontend.url;

        return null;
	}
};

export default Logout;
