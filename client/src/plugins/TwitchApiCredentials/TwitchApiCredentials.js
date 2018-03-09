/**
 * Created by Alex on 23.02.2018.
 */
class TwitchApiCredentials {
    constructor(){
        this.client_id = 'ylofyalalpwteys5tpmy0n2lns7iq9';
        this.client_secret = 'j7z4bb4jjc8dq94avd7sutuqe06pcz';
        this.chat_client_id = '6ywj292svk6fs5953qqnu6kwi6d65r';
        this.chat_client_secret = '6jqf6w8k2nvfysqiahtq5upx84vvo3';
        this.oAuth_redirectURI = 'http://localhost:4444/oauth';
        this.oAuth_scope = 'user_read+chat_login';
    }

}

export default TwitchApiCredentials;
