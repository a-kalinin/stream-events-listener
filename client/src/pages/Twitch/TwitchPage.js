/**
 * Created by Alex on 23.02.2018.
 */
import React, { Component/*, PureComponent*/ } from 'react';
import TwitchAPIConnection from '../../plugins/TwitchAPIConnection/TwitchAPIConnection.js';
import TwitchChatConnection from '../../plugins/TwitchChatConnection/TwitchChatConnection';
import ConnectionStatus from '../../comps/ConnectionStatus/ConnectionStatus.js';
import Chat from '../../comps/Chat/Chat.js';
import SoundPlay from '../../comps/SoundPlay/SoundPlay.js';
import TwitchApiCredentials from '../../plugins/TwitchApiCredentials/TwitchApiCredentials.js';
import { Link } from 'react-router-dom';
// import { Redirect } from 'react-router-dom';
import './TwitchPage.css';

class TwitchPage extends Component {
    constructor(props){
        super(props);
        this.credentials = new TwitchApiCredentials();
        this.streamer = props.match.params.streamer;
        this.state = {
            connectionEstablished: false,
            userId: '',
            displayName: '',
            name: '',
            image: '',
            streamId: '',
            title: '',
            watching: false,
        };
    }

    componentDidMount() {
        this.api = new TwitchAPIConnection( this.streamer , this.onStreamUpdate.bind(this) );
        this.chat = new TwitchChatConnection( this.streamer , this.onChatUpdate.bind(this) );
    }

    componentWillUnmount() {
        this.api.destroy();
        this.chat.destroy();
    }

    onStreamUpdate(data){
        console.log('onStreamUpdate', data);
        this.setState( function(prevState, props) {
            let addProps = {
                connectionEstablished: true,
                watchingDiff: 0,
            };

            if(data.hasOwnProperty('watching')){
                if(prevState.watching === false){
                    addProps.watchingDiff = 0;
                }
                else if(prevState.watching !== data.watching) {
                    addProps.watchingDiff = data.watching - prevState.watching;
                }
            }
            return Object.assign(addProps, data)
        });
    }

    onChatUpdate(data){
        console.log('onChatUpdate', data);
        // this.setState( function(prevState, props) {
        //     let addProps = {
        //         connectionEstablished: true,
        //         watchingDiff: 0,
        //     };
        //
        //     if(data.hasOwnProperty('watching')){
        //         if(prevState.watching === false){
        //             addProps.watchingDiff = 0;
        //         }
        //         else if(prevState.watching !== data.watching) {
        //             addProps.watchingDiff = data.watching - prevState.watching;
        //         }
        //     }
        //     return Object.assign(addProps, data)
        // });
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
            // return <Redirect to={ this.generateAuthUrl() } />;
            return null;
        }

        let sound = null;
        if(this.state.watchingDiff > 0){
            sound = <SoundPlay src="/sounds/hello-button.mp3"/>;
        }
        else if(this.state.watchingDiff < 0){
            sound = <SoundPlay src="/sounds/bah-bye.mp3"/>;
        }
        const link ='https://twitch.tv/'+this.streamer;


        return <div className="">
            <ConnectionStatus connected={this.state.connectionEstablished}/>
            <h1>{this.streamer} <Link to='/' className="homeLink" /></h1>
            <table className="info">
                <tbody>
                    <tr><td>Name</td><td>{this.state.displayName}</td></tr>
                    <tr><td>Stream</td><td>{this.state.title}</td></tr>
                    <tr><td>Watching</td><td>{this.state.watching}</td></tr>
                    <tr><td>Link</td><td><a href={link} target="_blanc">{link}</a></td></tr>
                </tbody>
            </table>
            <div className="avatar" style={{backgroundImage: 'url('+this.state.image+')'}} />
            <Chat name="Twitch"/>
            {sound}
        </div>;
    }
}

export default TwitchPage;
