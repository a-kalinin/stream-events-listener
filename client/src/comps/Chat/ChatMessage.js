/**
 * Created by Alex on 09.03.2018.
 */

import React, { Component } from 'react';
import SoundPlay from '../../comps/SoundPlay/SoundPlay.js';
// import './Chat.css';

class ChatMessage extends Component{
    defaultEmoteSize = 1;

    extractEmotesFromTag(tags){
        // <emote ID>:<first index>-<last index>,<another first index>-<another last index>/<another emote ID>:<first index>-<last index>...
        // * emote ID – The number to use in this URL:
        // http://static-cdn.jtvnw.net/emoticons/v1/:<emote ID>/:<size>
        // (size is 1.0, 2.0 or 3.0.)

        const emotes = tags && tags.emotes && tags.emotes.split('/'),
            parsePosition = function(rawPosition){
                const posArray = rawPosition.split('-');
                return {start: parseInt(posArray[0],10), end: parseInt(posArray[1],10)};
            };

        if(!emotes || !emotes.length){
            return null;
        }

        let newEmotesArray = [];
        for(let emote of emotes){
            const arr = emote.split(':'),
                rawPositions = arr[1].split(','),
                positions = rawPositions.map(parsePosition);

            for(let pos of positions){
                newEmotesArray.push({start: pos.start, end:pos.end, id: arr[0]})
            }
        }

        newEmotesArray.sort((prev,next) => prev.start - next.start);

        return newEmotesArray;
    }

    emotesReplace(message, emotes){
        const emoteSize = String(this.props.emoteSize || this.defaultEmoteSize) + '.0';
        let messageString = message,
            fragmentsArray = [];

        for(let i = emotes.length - 1; i>=0; i--){
            const emote = emotes[i],
                imageSrc = `http://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/${emoteSize}`,
                alt = messageString.slice(emote.start, emote.end+1),
                image = <img key={i} src={imageSrc} alt={alt}/>;

            fragmentsArray.unshift(messageString.slice(emote.end+1));
            fragmentsArray.unshift(image);
            messageString = messageString.slice(0,emote.start);
        }
        fragmentsArray.unshift(<span key={'text'}>{messageString}</span>);
        return fragmentsArray;
    }

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
            const twoDigit = number => number < 10 ? '0'+number : number,
                time = data.tags ? new Date(Number(data.tags['tmi-sent-ts'])) : null,
                timeSpan = !time ? null : <span className="time">{
                    twoDigit( time.getHours() ) +':'+ twoDigit(time.getMinutes())
                } </span>,
                emotes = this.extractEmotesFromTag(data.tags),
                message = emotes ? this.emotesReplace(data.message, emotes) : data.message;

            return <div className='message'>
                {timeSpan}
                <span className='name'>{data.username}</span>: { message }
                {data.noSound ? null : <SoundPlay src="/sounds/icq-old-sound.mp3"/>}
                {/*<SoundPlay src="/sounds/icq-old-sound.mp3"/>*/}
            </div>;
        }

        return null;
    }
}

export default ChatMessage;