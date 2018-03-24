/**
 * Created by Alex on 09.03.2018.
 */
import React, { Component } from 'react';
import ChatWindow from './ChatWindow.js';
import './Chat.scss';

class Chat extends Component{
    constructor(props){
        super(props);
        this.state = {
            messages: [],
        };
    }

    addMessage(data){
        let messages = this.state.messages.concat( [{idx: Date.now(), data}] );
        if( this.props.limit && messages.length > this.props.limit ){
            messages = messages.slice(messages.length - this.props.limit);
        }
        this.setState({messages});
    }

    joinChatter(data){
        this.setState({
            messages: this.state.messages.concat([{idx: Date.now(), data}]),
        });
    }

    departChatter(data){
        this.setState({
            messages: this.state.messages.concat([{idx: Date.now(), data}]),
        });
    }

    render(){
        return <ChatWindow messages={this.state.messages} />;
    }
}

export default Chat;