import React from 'react';
import autoBind from 'react-autobind';
import cookie from 'react-cookie';
import { Button, Modal } from 'react-bootstrap';
import { Router, hashHistory } from 'react-router';

import { Link } from 'react-router';
import NeedLoginDialog from './NeedLoginDialog';
import ChatPane from './ChatPane';



class ChatAdmin extends React.Component {
    
	constructor(props){
        super(props);
        autoBind(this);

        this.state = {
            "showChat": false,
        }
    }
    showChatPane() {
        console.log('show chat pane');
        this.setState({ showChat: !this.state.showChat });
    }
    componentWillMount() {
         
	}
	render (){
        //console.log(this.state.showChat);
		return (
             <div className="col-lg-12">
                
                <div id="small-chat" >

                    <span className="badge badge-warning pull-right">5</span>
                    <a className="open-small-chat" onClick={this.showChatPane}>
                        <i className="fa fa-comments"></i>

                    </a>
                </div>
                {
                    this.state.showChat
                    ? <ChatPane />
                    : null
                }
                
            </div>
		)
	}
};

export default ChatAdmin;



/*
<div className="small-chat-box ng-small-chat fadeInRight animated" ng-show="openChat">

    <div className="heading" draggable="true">
        <small className="chat-date pull-right">
            02.19.2015
        </small>
        Small chat
    </div>

    <div className="content" chat-slim-scroll>

        <div className="left">
            <div className="author-name">
                Monica Jackson <small className="chat-date">
                10:02 am
            </small>
            </div>
            <div className="chat-message active">
                Lorem Ipsum is simply dummy text input.
            </div>

        </div>
        <div className="right">
            <div className="author-name">
                Mick Smith
                <small className="chat-date">
                    11:24 am
                </small>
            </div>
            <div className="chat-message">
                Lorem Ipsum is simpl.
            </div>
        </div>
        <div className="left">
            <div className="author-name">
                Alice Novak
                <small className="chat-date">
                    08:45 pm
                </small>
            </div>
            <div className="chat-message active">
                Check this stock char.
            </div>
        </div>
        <div className="right">
            <div className="author-name">
                Anna Lamson
                <small className="chat-date">
                    11:24 am
                </small>
            </div>
            <div className="chat-message">
                The standard chunk of Lorem Ipsum
            </div>
        </div>
        <div className="left">
            <div className="author-name">
                Mick Lane
                <small className="chat-date">
                    08:45 pm
                </small>
            </div>
            <div className="chat-message active">
                I belive that. Lorem Ipsum is simply dummy text.
            </div>
        </div>


    </div>
    <div className="form-chat">
        <div className="input-group input-group-sm"><input type="text" className="form-control" />
         <span className="input-group-btn"> 
                <button className="btn btn-primary" type="button">Send
        </button> </span></div>
    </div>

</div>
*/