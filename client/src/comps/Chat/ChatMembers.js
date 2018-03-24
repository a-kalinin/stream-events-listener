import React, { Component } from 'react';

class ChatMembers extends Component{
    componentWillUpdate(){
        const viewport = this.viewport;
        this.shouldScrollBottom = viewport.scrollTop + viewport.offsetHeight === viewport.scrollHeight;
    }
    componentDidUpdate(){
        if (this.shouldScrollBottom) {
            const viewport = this.viewport;
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
    render(){
        const members = this.props.members.map( member => <div className="member" key={member}>{member}</div> );
        return <div className="ChatMembers">
            <div ref={viewport => this.viewport = viewport} className="window">{members}</div>
        </div>;
    }
}

export default ChatMembers;