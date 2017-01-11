import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';

import MenusPane from '../component/MenusPane';
import AdminMenuPane from '../component/AdminMenuPane';

import backend from '../configs/backend';
import frontend from '../configs/frontend';

class ConditionalMenu extends React.Component {
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            logged : false,
            datauser: {
                user:{},
                role:[]
            }
        }

    }
    getDataUser(token){
        fetch(backend.url + `/api/getuserdetails`, { 
                headers: {
                    'Authorization': 'Bearer '+token
                }
            })
			.then(result=>result.json())
			.then(datauser=>this.setState({datauser}))
    }
	
    componentWillMount() {
        var token = cookie.load('token');
        if(token){
            this.getDataUser(token);
        }
	}
    isAdmin(){
        var admin = false;
        var roles = this.state.datauser.role;
        var i = 0;
        /*for(i=0; i<roles.length; i++){
            console.log(roles[i]);
            if(roles[i] === 'ROLE_ADMIN'){
                console.log('admin');
                admin = true;
            }
        }*/
        cookie.save('role', 'guest');
        cookie.save('username', this.state.datauser.email);
        //this.state.datauser.role.map(function(name, index){
                
            if (this.state.datauser.role == 'ROLE_ADMIN'){
                cookie.save('role', 'admin');
                //console.log(name);
                admin = true;
            }
        //});
        return admin;
    }
    getConditionalMenu(){
        
        if(this.state.datauser.role){ 
            var role = this.state.datauser.role 
            var admin = this.isAdmin();
            //console.log('role exist '+admin)
            if(admin){
                //console.log('admin pane')
                
                return (<AdminMenuPane />);
            }
        }

        return null;
    }
    
	render (){
        
		return this.getConditionalMenu();
	}
};

export default ConditionalMenu;
