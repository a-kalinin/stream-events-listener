/**
 * Created by Alex on 23.02.2018.
 */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class OAuth extends Component {
    constructor(props){
        super(props);
        this.state = {
            hasToken: false
        };
    }

    componentDidMount() {
        const hashMatch = function(hash, expr) {
            const match = hash.match(expr);
            return match ? match[1] : null;
        };

        const hash = document.location.hash,
            tokenInHash = hashMatch(hash, /access_token=(\w+)/);

        if (tokenInHash){
            const state = hashMatch(hash, /state=(\w+)/);
            if (sessionStorage.twitchOAuthState === state) {
                sessionStorage.twitchOAuthToken = tokenInHash;
                // console.log(tokenInHash);
                this.setState({hasToken: true});
            }
        }
        else if (sessionStorage.twitchOAuthToken){
            this.setState({hasToken: true});
        }
    }

    render () {
        if(this.state.hasToken && sessionStorage.openedChannel){
            const url = '/' + sessionStorage.openedChannel;
            sessionStorage.removeItem('openedChannel');
            return <Redirect to={url} />
        }
        return 'There is no auth token or chosen streamer! =(';
    }
}

export default OAuth;
