/**
 * Created by Alex on 23.02.2018.
 */
import React, { Component/*, PureComponent*/ } from 'react';
import TwitchAPIConnection from '../../plugins/TwitchAPIConnection/TwitchAPIConnection.js';
import TwitchChatConnection from '../../plugins/TwitchChatConnection/TwitchChatConnection';
import StreamInfo from '../../comps/StreamInfo/StreamInfo.js';
import Chat from '../../comps/Chat/Chat.js';
import ChatMembers from '../../comps/Chat/ChatMembers.js';
import TwitchApiCredentials from '../../plugins/TwitchApiCredentials/TwitchApiCredentials.js';
import './TwitchPage.scss';

const API_EVENT_TYPES = {
    USER:'user',
    CHANNEL:'channel',
    CONNECTION: 'connection'
};
class TwitchPage extends Component {
    constructor(props){
        super(props);
        this.credentials = new TwitchApiCredentials();
        this.channel = props.match.params.channel;
        this.state = {
            userData: {
                identified: false,
                name: '',
                displayName: '',
                userId: '',
                image: '',
            },
            channelData: {
                name: '',
                displayName: '',
                userId: '',
                image: '',
                title: '',
                viewersCount: '',
            },
            apiConnectionEstablished: false,
            chatConnectionEstablished: false,
            chattersCount: '',
            chattersList: [],
            soundMuted: localStorage.getItem('soundsMuted') === 'true',
        };
    }

    componentDidMount() {
        this.api = new TwitchAPIConnection( this.channel , this.onApiUpdate.bind(this) );
        this.IRC = new TwitchChatConnection( this.channel, this.channel , sessionStorage.twitchOAuthToken,  this.onChatUpdate.bind(this) );
    }

    componentWillUnmount() {
        this.api.destroy();
        this.IRC.destroy();
    }

    onApiUpdate(type, data){
        let state = {
            apiConnectionEstablished: true,
        };
        switch(type){
            case API_EVENT_TYPES.USER:
                this.setState( Object.assign(state, {userData: Object.assign(this.state.userData,data)}) );
                break;
            case API_EVENT_TYPES.CHANNEL:
                this.setState( Object.assign(state, {channelData: Object.assign(this.state.channelData, data)}) );
                break;
            case API_EVENT_TYPES.CONNECTION:
                this.setState( Object.assign(state, data) );
                break;
            default:
                break;
        }
    }

    onChatUpdate(data){
        // console.log('onChatUpdate', data);
        data = Object.assign( {noSound: this.state.soundMuted || this.channel === data.username}, data );
        let connected = true;
        if(data.command=== 'PRIVMSG'){
            this.chat.addMessage(data);
        }
        else if(data.command=== 'JOIN'){
            this.chat.joinChatter(data);
            this.setState({chattersList: this.state.chattersList.concat([data.username])})
        }
        else if(data.command=== 'PART'){
            this.chat.departChatter(data);
            this.setState({chattersList: this.state.chattersList.filter(chatter => chatter.username !== data.username)})
        }
        else if(data.command=== 'NAMES'){
            this.setState({chattersCount: data.message.length, chattersList: data.message});
        }
        else if(data.command=== 'DISCONNECT'){
            connected = false;
        }
        this.setState({chatConnectionEstablished: connected});
    }

    onSoundMuteToggle(){
        localStorage.setItem('soundsMuted',String(!this.state.soundMuted));
        this.setState({soundMuted:!this.state.soundMuted});
    }

    generateAuthUrl() {
        function nonce(length) {
            // Source: https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
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
            // '&scope=' + this.credentials.oAuth_chatScope;
            '&scope=' + this.credentials.oAuth_commonScope;
    }

    render () {
        if(!sessionStorage.twitchOAuthToken){
            sessionStorage.openedChannel = this.channel;
            window.location.href = this.generateAuthUrl();
            return null;
        }

        return <div className="TwitchPage">
            <StreamInfo
                channel={this.state.channelData}
                user={this.state.userData}
                apiConnectionEstablished={this.state.apiConnectionEstablished}
                chatConnectionEstablished={this.state.chatConnectionEstablished}
                onSoundMuteToggle={this.onSoundMuteToggle.bind(this)}
                soundMuted={this.state.soundMuted}/>
            <Chat ref={chat=>this.chat=chat} limit={200}/>
            <ChatMembers members={this.state.chattersList} />
        </div>;
    }
}

export default TwitchPage;
