/**
 * Created by Alex on 23.02.2018.
 */
import React, { Component/*, PureComponent*/ } from 'react';
import TwitchApiCredentials from '../../plugins/TwitchApiCredentials/TwitchApiCredentials.js';
import StreamerSearch from '../../comps/StreamerSearch/StreamerSearch.js';
// import { Redirect } from 'react-router-dom';
import './Home.css';

class Home extends Component {
    constructor(props){
        super(props);
        this.credentials = new TwitchApiCredentials();
        this.streamer = props.match.params.streamer;
        this.state = {};
    }

    render() {
        return <div className="Home">
            <h1>Home</h1>
            <div className="search">
                <div>Type streamer's name to search</div>
                <StreamerSearch />
            </div>
        </div>;
    }
}

export default Home;
