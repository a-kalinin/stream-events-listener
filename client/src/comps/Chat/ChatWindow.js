/**
 * Created by Alex on 21.03.2018.
 */
import React, { Component } from 'react';
import ChatMessage from './ChatMessage.js';

class ChatWindow extends Component{
    componentWillUpdate(){
        let viewport = this.viewport;
        this.shouldScrollBottom = viewport.scrollTop + viewport.offsetHeight === viewport.scrollHeight;
    }
    componentDidUpdate(){
        if (this.shouldScrollBottom) {
            let viewport = this.viewport;
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
    render(){
        let messages = this.props.messages.map((msg, i)=><ChatMessage key={i} data={msg} />);
        return <div className="ChatWindow">
            <div className="header">{this.props.name}</div>
            <div ref={viewport => this.viewport = viewport} className="window">{messages}</div>
        </div>;
    }
}

export default ChatWindow;