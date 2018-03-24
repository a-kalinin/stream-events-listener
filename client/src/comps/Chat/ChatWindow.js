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
        let messages = this.props.messages.map( msg => <ChatMessage key={msg.idx} data={msg.data} emoteSize={1} /> );
        return <div className="ChatWindow">
            <div ref={viewport => this.viewport = viewport} className="window">{messages}</div>
        </div>;
    }
}

export default ChatWindow;