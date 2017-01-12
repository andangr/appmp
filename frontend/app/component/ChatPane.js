import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import { Router, hashHistory } from 'react-router';

import { Link } from 'react-router';
import NeedLoginDialog from './NeedLoginDialog';
import RegisterPane from './RegisterPane';

import io from 'socket.io-client'

let socket = io(`172.19.16.156:3000`);


class ChatPane extends React.Component {
    
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            showChat: false,
            input: "Welcome to admin chat. :) ",
            text: "",
            userid: "admin",
            messages:[]
        }
        
        this.updateChat = this.updateChat.bind(this);
        this.sendToSocket = this.sendToSocket.bind(this);
        
    }
    componentDidMount(){
        console.log('componentDidMount');
        //this.sendToSocket(this.state.userid, this.state.input);
    }
    updateChat() {
         
        this.refs.inputText.value = '';
        var username = cookie.load('username');
        var role = cookie.load('role');

        this.sendToSocket(role, this.state.input);

    }
    sendToSocket(username, message){
        var data = this; 
        socket.emit('chatRoom',message, username, this.state.messages);
        
        socket.on('replyChat', function (response) {
            //console.log('update chat');
            data.setState({ messages: response });
        }); 
    }
    componentWillMount() {
        //console.log('componentWillMount');
        this.sendToSocket(this.state.userid, this.state.input);
	}
    _onChange (e) {
        var state = {};
        state[e.target.name] =  $.trim(e.target.value);
        //console.log('on change');
        this.setState(state);
    }
	render (){
        //console.log(this.state.showChat);
		return (
             <div className="col-lg-12">
                
                <div className="small-chat-box ng-small-chat fadeInRight animated" >

                    <div className="heading" draggable="true">
                        <small className="chat-date pull-right">
                            02.19.2015
                        </small>
                        Chat Admin
                    </div>

                    <div className="content" >
                        {
                            this.state.messages.map((message, i) => {
                                return (
                                    <div className="left" key={i}>
                                        <div className="author-name">
                                            {message.userid}
                                            <small className="chat-date">
                                                08:45 pm
                                            </small>
                                        </div>
                                        <div className="chat-message active">
                                            {message.message}
                                            
                                            
                                        </div>
                                    </div>
                                    
                                );
                            })
                        } 
                        


                    </div>
                    
                    <div className="form-chat">
                        <div className="input-group input-group-sm">
                        <input type="text" className="form-control" name="input"  ref="inputText" onChange={this._onChange}/>
                        <span className="input-group-btn"> 
                                <button className="btn btn-success" onClick={this.updateChat} type="button">Send
                        </button> </span></div>
                    </div>

                </div>
                
            </div>
		)
	}
};

export default ChatPane;

    