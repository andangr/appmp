import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

class Logout extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);
    }

	render (){
        cookie.remove('token');
		window.location.href = 'http://172.19.16.156:8020/';

        return null;
	}
};

export default Logout;
