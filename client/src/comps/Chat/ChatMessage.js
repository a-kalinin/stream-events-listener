/**
 * Created by Alex on 09.03.2018.
 */

import React, { Component } from 'react';
import SoundPlay from '../../comps/SoundPlay/SoundPlay.js';
// import './Chat.css';

class ChatMessage extends Component{
    render(){
        let data = this.props.data;

        if(data.command === 'JOIN'){
            return <div className='join'>
                <span className='name'>{data.username}</span> joined the chat
                {data.noSound ? null : <SoundPlay src="/sounds/hello-button.mp3"/>}
            </div>;
        }
        else if(data.command === 'PART'){
            return <div className='part'>
                <span className='name'>{data.username}</span> left the chat
                {data.noSound ? null : <SoundPlay src="/sounds/bah-bye.mp3"/>}
            </div>;
        }
        else if(data.command === 'PRIVMSG'){
            return <div className='message'>
                <span className='name'>{data.username}</span>: { data.message }
                {/*{data.noSound ? null : <SoundPlay src="/sounds/icq-old-sound.mp3"/>}*/}
                <SoundPlay src="/sounds/icq-old-sound.mp3"/>
            </div>;
        }

        return null;
    }
}

export default ChatMessage;