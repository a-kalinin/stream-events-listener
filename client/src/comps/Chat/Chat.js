/**
 * Created by Alex on 09.03.2018.
 */
import React, { Component } from 'react';
import ChatWindow from './ChatWindow.js';
import './Chat.scss';

class Chat extends Component{
    constructor(props = {limit:100}){
        super(props);
        this.state = {
            messages: [],
            chatters: [],
        };
        this.limit = props.limit;
    }

    addMessage(data){
        this.setState({
            messages: this.state.messages.concat([data])
        });
    }

    setChatterList( chatters = [] ){
        this.setState({
            chatters: chatters,
        });
    }

    joinChatter(data){
        this.setState({
            messages: this.state.messages.concat([data]),
            chatters: this.state.chatters.concat([data.username]),
        });
    }


    departChatter(data){
        this.setState({
            messages: this.state.messages.concat([data]),
            chatters: this.state.chatters.filter(chatter => chatter.username !== data.username),
        });
    }

    render(){
        return <ChatWindow name={this.props.name} messages={this.state.messages} />;
    }
}

export default Chat;