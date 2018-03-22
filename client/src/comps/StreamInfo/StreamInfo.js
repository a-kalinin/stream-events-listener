/**
 * Created by Alex on 09.03.2018.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './StreamInfo.scss';

class StreamInfo extends Component{
    constructor(props){
        super(props);
    }

    onSoundMuteToggle(){
        this.props.onSoundMuteToggle();
    }

    render(){
        const channel = this.props.channel || {},
            user = this.props.user || {};
        return <div className="StreamInfo">
            <section className="aboutMe">
                <h3>About me</h3>
                <div className="avatar" style={{backgroundImage: 'url('+user.image+')'}} />
                <div className="row">
                    <div className="name">Joined as:</div>
                    <div className="value">{user.name}</div>
                </div>
            </section>
            <section className="aboutChannel">
                <h3>About channel</h3>
                <div className="row">
                    <div className="name">Channel name</div>
                    <div className="value">
                        {channel.name} / {channel.displayName}
                    </div>
                </div>
                <div className="row">
                    <div className="name">Stream status</div>
                    <div className="value connection" data-connected={String(!!channel.title)}/>
                </div>
                <div className="row">
                    <div className="name">Stream title</div>
                    <div className="value">{channel.title}</div>
                </div>
                <div className="row">
                    <div className="name">Watching:</div>
                    <div className="value">{channel.viewersCount}</div>
                </div>
                <div className="row">
                    <div className="name">Link:</div>
                    <div className="value"><a href={ 'https://twitch.tv/' + channel.name } target="_blanc">Page on Twitter</a></div>
                </div>
                <div className="avatar" style={{backgroundImage: 'url('+ channel.image +')'}} />
                <div className="leaveLinkWrapper"><Link to='/'>Leave channel</Link></div>
            </section>
            <section className="aboutConnection">
                <h3>About connection</h3>
                <div className="row">
                    <div className="name">Connection to API:</div>
                    <div className="value connection" data-connected={String(this.props.apiConnectionEstablished)}/>
                </div>
                <div className="row">
                    <div className="name">Connection to Chat:</div>
                    <div className="value connection" data-connected={String(this.props.chatConnectionEstablished)}/>
                </div>
            </section>
            <section className="settings">
                <h3>Settings</h3>
                <div className="row mute">
                    <div className="name">Sounds in chat</div>
                    <div className="value connection" data-connected={String(!this.props.soundMuted)}>
                        <button className="muteButton" onClick={this.onSoundMuteToggle.bind(this)}>
                            {this.props.soundMuted ? 'Enable' : 'Disable'}
                        </button>
                    </div>
                </div>
            </section>
        </div>;
    }
}

export default StreamInfo;