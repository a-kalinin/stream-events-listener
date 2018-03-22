/**
 * Created by Alex on 16.02.2018.
 */
import TwitchApiCredentials from '../TwitchApiCredentials/TwitchApiCredentials.js';

const TYPES = {
    USER:'user',
    CHANNEL:'channel',
    CONNECTION: 'connection'
};

class TwitchConnection {
    constructor(streamer, onChange){
        this.streamer = streamer;
        this.twitchApiCredentials = new TwitchApiCredentials();
        this.url = 'https://api.twitch.tv/kraken/oauth2/token';
        this.updateInterval = 10000;

        this.userData = {
            identified: false,
            name: '',
            displayName: '',
            id: '',
            image: '',
        };
        this.channelData = {
            name: '',
            displayName: '',
            id: '',
            image: '',
            streamId: '',
            title: '',
            viewersCount: '',
        };
        this.connectionData = {
            apiConnectionEstablished: false,
        };

        this.onChange = onChange;

        this.runStreamChecker = this.runStreamChecker.bind(this);
        this.updateUserInfo();
        this.updateChannelUserInfo(TYPES.CHANNEL, streamer, this.runStreamChecker);
    }

    _onChange(type, data){
        switch(type){
            case TYPES.USER:
                this.userData = Object.assign({}, this.userData, data);
                break;
            case TYPES.CHANNEL:
                this.channelData = Object.assign({}, this.channelData, data);
                break;
            case TYPES.CONNECTION:
                this.connectionData = Object.assign({}, this.connectionData, data);
                break;
            default:
                break;
        }
        this.onChange && this.onChange(type, data);
    }

    onError(){
        this._onChange(TYPES.CONNECTION, {apiConnectionEstablished: false});
    }

    destroy(){
        this.stopStreamChecker();
        this.onError();
    }

    runStreamChecker(){
        this.updateStreamInfo();
        this.updateStreamInfoTimerID = setInterval(
            () => this.updateStreamInfo(),
            this.updateInterval
        );
    }

    stopStreamChecker(){
        clearInterval(this.updateStreamInfoTimerID);
    }

    getToken( callback ){
        const url = this.url
                + '?client_id=' + this.twitchApiCredentials.chat_client_id
                + '&client_secret=' + this.twitchApiCredentials.chat_client_secret
                + '&grant_type=client_credentials'
                // + '&scope='+ this.twitchApiCredentials.oAuth_apiScope,
                + '&scope='+ this.twitchApiCredentials.oAuth_commonScope,
            myInit = { method: 'POST', cache: 'no-store' };

        fetch(url, myInit).then(function(response) {
            return response.json();
        }).then(function(response) {
            callback && callback(response.access_token);
        }).catch(function(error){
            this.onError();
            callback && callback(error);
        }.bind(this));
    }

    getUserInfo( callback ){
        const url = 'https://api.twitch.tv/kraken?oauth_token=' + sessionStorage.twitchOAuthToken,
            myInit = {
                method: 'GET',
                cache: 'no-store'
            };

        fetch(url, myInit).then(function (response) {
            return response.json();
        }).then(function (response) {
            callback && callback(response);
            // console.log(response);
        }).catch(function (error) {
            this.onError();
            callback && callback(false);
            console.error('Ping failed', error);
        }.bind(this));
    }

    updateUserInfo(){
        const type = TYPES.USER,
            self = this;
        this.getUserInfo( function(data){
            data && data.identified && self.updateChannelUserInfo( type, data.token.user_name, function(data){
                self._onChange( type, {
                    identified: true,
                    name: data.login,
                    displayName: data.display_name,
                    userId: data.id,
                    image: data.profile_image_url,
                } );
            });
        })
    }

    getChannelUserInfo(username, callback){
        this.getToken( function(token) {
            const myHeaders = new Headers({
                    "Client-ID": this.twitchApiCredentials.client_id,
                    "Authorization": "Bearer " + token
                }),
                url = 'https://api.twitch.tv/helix/users?login=' + username,
                myInit = {
                    method: 'GET',
                    headers: myHeaders,
                    cache: 'no-store'
                };

            fetch(url, myInit).then(function (response) {
                return response.json();
            }).then(function (response) {
                callback && callback(response);
                // console.log(response);
            }).catch(function (error) {
                this.onError();
                callback && callback(false);
                // console.error('Ping failed', error);
            }.bind(this));
        }.bind(this));
    }

    updateChannelUserInfo(type, username, callback){
        const old = type === TYPES.USER? this.userData :
            type === TYPES.CHANNEL? this.channelData: null;
        this.getChannelUserInfo( username, function(response){
            const data = (response.data && response.data[0]) || {};
            if(
                old.name !== data.login
                || old.displayName !== data.display_name
                || old.id !== data.id
                || old.image !== data.profile_image_url
            ){
                this._onChange(type, {
                    name: data.login,
                    displayName: data.display_name,
                    id: data.id,
                    image: data.profile_image_url,
                });
            }
            callback && callback(data);
        }.bind(this))
    }

    getStreamInfo(callback){
        const id = this.channelData.id,
            myHeaders = new Headers({
                "Client-ID": this.twitchApiCredentials.client_id
            }),
            url = 'https://api.twitch.tv/helix/streams?user_id=' + id,
            myInit = {
                method: 'GET', headers: myHeaders, cache: 'no-store'
            };

        if(!id) debugger;

        fetch(url, myInit).then(function (response) {
            return response.json();
        }).then(function (response) {
            callback && callback(response);
        }).catch(function (error) {
            this.onError();
            callback && callback(false);
            console.error(error);
        }.bind(this));
    }

    updateStreamInfo(){
        const old = this.channelData;
        this.getStreamInfo(function(response){
            const data = (response.data && response.data[0]) || {};
            if(
                data.viewer_count !== old.viewersCount
                || data.id !== old.streamId
                || data.title !== old.title
            ){
                this._onChange(TYPES.CHANNEL,{
                    viewersCount: data.viewer_count,
                    streamId: data.id,
                    title: data.title,
                });
            }
        }.bind(this));
    }

}

export default TwitchConnection;
