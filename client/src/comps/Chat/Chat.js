/**
 * Created by Alex on 09.03.2018.
 */
import React, { Component } from 'react';
import ChatMessage from './ChatMessage.js';
import './Chat.scss';

class Chat extends Component{
    render(){
        let messages = [<ChatMessage key="1" />];

        return <div className="Chat">
            <div className="header">{this.props.name}</div>
            <div className="window">{messages}</div>
        </div>;
    }
}

export default Chat;