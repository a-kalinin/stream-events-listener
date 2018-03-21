/**
 * Created by Alex on 23.02.2018.
 */
import React, { Component/*, PureComponent*/ } from 'react';
import TwitchAPIConnection from '../../plugins/TwitchAPIConnection/TwitchAPIConnection.js';
import TwitchChatConnection from '../../plugins/TwitchChatConnection/TwitchChatConnection';
import ConnectionStatus from '../../comps/ConnectionStatus/ConnectionStatus.js';
import StreamInfo from '../../comps/StreamInfo/StreamInfo.js';
import Chat from '../../comps/Chat/Chat.js';
import TwitchApiCredentials from '../../plugins/TwitchApiCredentials/TwitchApiCredentials.js';
import './TwitchPage.scss';

class TwitchPage extends Component {
    constructor(props){
        super(props);
        this.credentials = new TwitchApiCredentials();
        this.streamer = props.match.params.streamer;
        this.state = {
            connectionEstablished: false,
            userId: '',
            displayName: '',
            streamerDisplayName: '',
            name: '',
            image: '',
            streamId: '',
            title: '',
        };
    }

    componentDidMount() {
        this.api = new TwitchAPIConnection( this.streamer , this.onStreamUpdate.bind(this) );
        this.IRC = new TwitchChatConnection( this.streamer, this.streamer , sessionStorage.twitchOAuthToken,  this.onChatUpdate.bind(this) );
    }

    componentWillUnmount() {
        this.api.destroy();
        this.IRC.destroy();
    }

    onStreamUpdate(data){
        this.setState( Object.assign({connectionEstablished: true}, data) );
    }

    onChatUpdate(data){
        // console.log('onChatUpdate', data);
        data = Object.assign({noSound: this.streamer === data.username},data);
        if(data.command=== 'PRIVMSG'){
            this.chat.addMessage(data);
        }
        else if(data.command=== 'JOIN'){
            this.chat.joinChatter(data);
        }
        else if(data.command=== 'PART'){
            this.chat.departChatter(data);
        }
        else if(data.command=== 'NAMES'){
            this.chat.setChatterList(data.message);
            this.setState({viewersCount: data.message.length});
        }
    }

    generateAuthUrl() {
        // Source: https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
        function nonce(length) {
            let text = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        sessionStorage.twitchOAuthState = nonce(15);
        return 'https://api.twitch.tv/kraken/oauth2/authorize' +
            '?response_type=token' +
            '&client_id=' + this.credentials.chat_client_id +
            '&redirect_uri=' + this.credentials.oAuth_redirectURI +
            '&state=' + sessionStorage.twitchOAuthState +
            '&scope=' + this.credentials.oAuth_scope;
    }

    render () {
        if(!sessionStorage.twitchOAuthToken){
            sessionStorage.openedStreamer = this.streamer;
            window.location.href = this.generateAuthUrl();
            return null;
        }

        return <div className="TwitchPage">
            <StreamInfo
                apiConnected={this.state.connectionEstablished}
                displayName={this.state.displayName}
                title={this.state.title}
                streamer={this.streamer}
                streamerDisplayName={this.state.streamerDisplayName}
                image={this.state.image}
                viewersCount={this.state.viewersCount}
                link={ 'https://twitch.tv/' + this.streamer }/>
            <Chat ref={chat=>this.chat=chat} name="Twitch" />
        </div>;
    }
}

export default TwitchPage;
