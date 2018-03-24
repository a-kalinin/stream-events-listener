/**
 * Created by Alex on 16.02.2018.
 */
import TwitchApiCredentials from '../TwitchApiCredentials/TwitchApiCredentials.js';

class TwitchChatConnection {
    constructor(username, channel, authToken, eventHandler){
        this.credentials = new TwitchApiCredentials();
        this.eventHandler = eventHandler;

        this.username = channel;
        this.password = 'oauth:'+ authToken;
        this.channel = '#'+ channel;
        this.server = 'irc-ws.chat.twitch.tv';
        this.port = 443;
        this.open();
    }

    open(){
        this.webSocket = new WebSocket('wss://' + this.server + ':' + this.port + '/', 'irc');
        this.webSocket.onmessage = this.handleMessage.bind(this);
        this.webSocket.onerror = this.handleError.bind(this);
        this.webSocket.onclose = this.handleClose.bind(this);
        this.webSocket.onopen = this.handleOpen.bind(this);
    }

    handleError(message){
        console.warn('Chat error: ' + message);
    };

    handleMessage(message){
        if(message !== null){
            let parsed = this.parseRawMessage(message.data);
            parsed !== null && this.processMessage(parsed);
        }
    };

    handleOpen(){
        let socket = this.webSocket;
        if (socket !== null && socket.readyState === 1) {
            socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
            socket.send('PASS ' + this.password);
            socket.send('NICK ' + this.username);
            socket.send('JOIN ' + this.channel);
        }
    };

    handleClose(){
        this.eventHandler && this.eventHandler({command:'DISCONNECT'});
        console.warn('Disconnected from the chat server.');
    };

    close(){
        if(this.webSocket){
            this.webSocket.close();
        }
    };

    parseRawMessage(rawMessage) {
        if (rawMessage.startsWith("PING")) {
            return { command: "PING", message: rawMessage.split(":")[1] };
        }

        let parsedMessage = {
                message: null,
                tags: null,
                command: null,
                original: rawMessage,
                channel: null,
                username: null,
            },
            tagsIncluded = rawMessage[0] === '@',
            tagsString = tagsIncluded && rawMessage.slice(1).split(' ')[0],
            tagsArray = tagsString && tagsString.split(';'),
            tagsStrippedString = tagsIncluded ? rawMessage.split(' ').slice(1).join(' ') : rawMessage,
            commonRegExp = /^:(\S+)!(?:\S+)@(?:\S+).tmi.twitch.tv (JOIN|PART|PRIVMSG) #(\S+) ?:?(.*)\s/,
            matches = tagsStrippedString.match(commonRegExp),
            userListRegExp = /^:(\S+).tmi.twitch.tv 353 (?:\S+) = #(\S+) :(.*)/,
            userListMatches = tagsStrippedString.match(userListRegExp);

        // GLOBALUSERSTATE
        // CLEARCHAT
        // ROOMSTATE
        // USERNOTICE
        // USERSTATE

        // :<user>!<user>@<user>.tmi.twitch.tv JOIN #<channel>
        // :<user>!<user>@<user>.tmi.twitch.tv PART #<channel>
        // :<user>!<user>@<user>.tmi.twitch.tv PRIVMSG #<channel> :This is a sample message
        if (matches){
            parsedMessage.username = matches[1];
            parsedMessage.command = matches[2];
            parsedMessage.channel = matches[3];
            parsedMessage.message = matches[2] === 'PRIVMSG' ? matches[4] : null;
        }
        // :<user>.tmi.twitch.tv 353 <user> = #<channel> :<user> <user2> <user3>
        // :<user>.tmi.twitch.tv 353 <user> = #<channel> :<user4> <user5> ... <userN>
        // :<user>.tmi.twitch.tv 366 <user> #<channel> :End of /NAMES list
        else if(userListMatches){
            let strings = tagsStrippedString.split("/n"),
                users = [];

            parsedMessage.username = userListMatches[1];
            parsedMessage.command = 'NAMES';
            parsedMessage.channel = userListMatches[2];

            for(let string of strings){
                let [,,,usersInString] = string.match(userListRegExp);
                usersInString && users.push(...usersInString.split(/\s/));
            }
            parsedMessage.message = users;
        }
        else{
            // debugger
        }

        if( tagsArray ){
            let tagsObj = {};
            tagsArray.forEach(tag => {
                let arr = tag.split('=');
                tagsObj[arr[0]] = arr[1];
            });
            parsedMessage.tags = tagsObj;
        }

        return parsedMessage;
    }

    processMessage(message){
        if (message.command === "PING") {
            this.webSocket.send("PONG :" + message.message);
        } else if (message.command){
            this.eventHandler && this.eventHandler(message);
        }
    }

    destroy(){
        this.close();
    }
}

export default TwitchChatConnection;
