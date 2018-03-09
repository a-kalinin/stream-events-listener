/**
 * Created by Alex on 16.02.2018.
 */
import TwitchApiCredentials from '../TwitchApiCredentials/TwitchApiCredentials.js';

class TwitchChatConnection {
    constructor(streamer, onChange){
        this.streamer = streamer;
        this.credentials = new TwitchApiCredentials();
        this.url = 'https://api.twitch.tv/kraken/oauth2/token';
        this.data = {
            // userId: '',
            // name: '',
            // image: '',
            // streamId: '',
            // title: '',
            // viewersCount: 0,
        };
        this.onChange = onChange;

        this.username = this.streamer;
        this.password = sessionStorage.twitchOAuthToken && 'oauth:'+sessionStorage.twitchOAuthToken;
        // this.channel = '#'+ this.streamer;
        this.channel = '#'+ this.streamer;
        this.server = 'irc-ws.chat.twitch.tv';
        this.port = 443;

        this.open();
    }

    open(){
        this.webSocket = new WebSocket('wss://' + this.server + ':' + this.port + '/', 'irc');
        this.webSocket.onmessage = this.onMessage.bind(this);
        this.webSocket.onerror = this.onError.bind(this);
        this.webSocket.onclose = this.onClose.bind(this);
        this.webSocket.onopen = this.onOpen.bind(this);
    }

    onError(message){
        console.log('Chat error: ' + message);
    };

    onMessage(message){
        if(message !== null){
            let parsed = this.parseMessage(message.data);
            // console.log(message.data);
            if(parsed !== null){
                if(parsed.command === "PRIVMSG") {
                    let userPoints = localStorage.getItem(parsed.username);

                    if(userPoints === null){
                        localStorage.setItem(parsed.username, 10);
                    }
                    else {
                        localStorage.setItem(parsed.username, parseFloat(userPoints) + 0.25);
                    }
                } else if(parsed.command === "PING") {
                    this.webSocket.send("PONG :" + parsed.message);
                }
            }
        }
    };

    onOpen(){
        let socket = this.webSocket;
        if (socket !== null && socket.readyState === 1) {
            socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
            socket.send('PASS ' + this.password);
            socket.send('NICK ' + this.username);
            socket.send('JOIN ' + this.channel);
        }
    };

    onClose(){
        console.log('Disconnected from the chat server.');
    };

    close(){
        if(this.webSocket){
            this.webSocket.close();
        }
    };

    parseMessage(rawMessage) {
        let parsedMessage = {
            message: null,
            tags: null,
            command: null,
            original: rawMessage,
            channel: null,
            username: null
        };


        if(rawMessage[0] === '@'){
            let tagIndex = rawMessage.indexOf(' '),
                userIndex = rawMessage.indexOf(' ', tagIndex + 1),
                commandIndex = rawMessage.indexOf(' ', userIndex + 1),
                channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
                messageIndex = rawMessage.indexOf(':', channelIndex + 1);

            parsedMessage.tags = rawMessage.slice(0, tagIndex);
            parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
            parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
            parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
            parsedMessage.message = rawMessage.slice(messageIndex + 1);
        } else if(/^:[\w\d_]+!/.test(rawMessage)){
            let user = rawMessage.trim(':').split('!')[0],
                strings = rawMessage.split("\n");
            console.log('!!!!! user '+ user);

            for (let i=0; i< strings.length; i++){

            }

            // let tagIndex = rawMessage.indexOf(' '),
            //     userIndex = rawMessage.indexOf(' ', tagIndex + 1),
            //     commandIndex = rawMessage.indexOf(' ', userIndex + 1),
            //     channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
            //     messageIndex = rawMessage.indexOf(':', channelIndex + 1);
            //
            // parsedMessage.tags = rawMessage.slice(0, tagIndex);
            // parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
            // parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
            // parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
            // parsedMessage.message = rawMessage.slice(messageIndex + 1);
        } else if(rawMessage.startsWith("PING")) {
            parsedMessage.command = "PING";
            parsedMessage.message = rawMessage.split(":")[1];
        }

        return parsedMessage;
    }







    _onChange(data){
        this.data = Object.assign({}, this.data, data);
        this.onChange && this.onChange(data);
    }

    destroy(){
        this.close();
    }

}

export default TwitchChatConnection;
