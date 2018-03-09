/**
 * Created by Alex on 16.02.2018.
 */
import TwitchApiCredentials from '../TwitchApiCredentials/TwitchApiCredentials.js';

class TwitchConnection {
    constructor(streamer, onChange){
        this.streamer = streamer;
        this.twitchApiCredentials = new TwitchApiCredentials();
        this.url = 'https://api.twitch.tv/kraken/oauth2/token';
        this.data = {
            userId: '',
            name: '',
            image: '',
            streamId: '',
            title: '',
            watching: 0,
        };
        this.onChange = onChange;

        this.runStreamChecker = this.runStreamChecker.bind(this);
        this.updateUserInfo(this.runStreamChecker);
    }

    _onChange(data){
        this.data = Object.assign({}, this.data, data);
        this.onChange && this.onChange(data);
    }

    destroy(){
        this.stopStreamChecker();
    }

    runStreamChecker(){
        this.updateStreamInfo();
        this.updateStreamInfoTimerID = setInterval(
            () => this.updateStreamInfo(),
            10000
        );
    }

    stopStreamChecker(){
        clearInterval(this.updateStreamInfoTimerID);
    }

    getToken( callback ){
        const url = this.url
                + '?client_id=' + this.twitchApiCredentials.client_id
                + '&client_secret=' + this.twitchApiCredentials.client_secret
                + '&grant_type=client_credentials'
                + '&scope=chat_login+user:read:email',
            myInit = { method: 'POST', cache: 'no-store' };

        fetch(url, myInit).then(function(response) {
            return response.json();
        }).then(function(response) {
            callback && callback(response.access_token);
        }).catch(function(error){
            callback && callback(error);
        });
    }

    getUserInfo(callback){
        this.getToken( function(token) {
            const myHeaders = new Headers({
                    "Client-ID": this.twitchApiCredentials.client_id,
                    "Authorization": "Bearer " + token
                }),
                url = 'https://api.twitch.tv/helix/users?login=' + this.streamer,
                myInit = {
                    method: 'GET',
                    headers: myHeaders,
                    cache: 'no-store'
                };

            fetch(url, myInit).then(function (response) {
                return response.json();
            }).then(function (response) {
                callback && callback(response);
                // console.log(response.status);
            }).catch(function (error) {
                callback && callback(false);
                // console.error('Ping failed', error);
            });
        }.bind(this));
    }

    updateUserInfo(callback){
        const old = this.data;
        this.getUserInfo( function(response){
            const data = (response.data && response.data[0]) || {};
            if(
                old.name !== data.name
                || old.displayName !== data.display_name
                || old.userId !== data.id
                || old.image !== data.profile_image_url
            ){
                this._onChange({
                    name: data.name,
                    displayName: data.display_name,
                    userId: data.id,
                    image: data.profile_image_url,
                });
            }
            callback && callback();
        }.bind(this))
    }

    getStreamInfo(callback){
        const id = this.data.userId,
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
            // callback && callback(false);
            console.error(error);
        });
    }

    updateStreamInfo(){
        const old = this.data;
        this.getStreamInfo(function(response){
            const data = (response.data && response.data[0]) || {};
            if(
                data.viewer_count !== old.watching
                || data.id !== old.streamId
                || data.title !== old.title
            ){
                this._onChange({
                    watching: data.viewer_count,
                    streamId: data.id,
                    title: data.title,
                });
            }
        }.bind(this));
    }

}

export default TwitchConnection;
