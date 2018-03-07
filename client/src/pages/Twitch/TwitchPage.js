/**
 * Created by Alex on 23.02.2018.
 */
import React, { Component/*, PureComponent*/ } from 'react';
import TwitchConnection from '../../plugins/TwitchConnection/TwitchConnection.js';
import ConnectionStatus from '../../comps/ConnectionStatus/ConnectionStatus.js';
import SoundPlay from '../../comps/SoundPlay/SoundPlay.js';
import './TwitchPage.css';
// import './TimerView.css';

class TwitchPage extends Component {
    constructor(props){
        super(props);
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
        this.connection = new TwitchConnection( this.streamer , this.onStreamUpdate.bind(this) );
    }

    componentWillUnmount() {
        this.connection.destroy();
    }

    onStreamUpdate(data){
        console.log('onStreamUpdate', data);
        this.setState( function(prevState, props) {
            let addProps = {
                connectionEstablished: true,
                watchingDiff: 0,
            };
            if(data.hasOwnProperty('watching') && prevState.watching !== data.watching){
                addProps.watchingDiff = data.watching - prevState.watching;
            }
            return Object.assign(addProps, data)
        });
    }

    render () {
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
            <h1>{this.streamer}</h1>
            <table className="info">
                <tbody>
                    <tr><td>Name</td><td>{this.state.displayName}</td></tr>
                    <tr><td>Stream</td><td>{this.state.title}</td></tr>
                    <tr><td>Watching</td><td>{this.state.watching}</td></tr>
                    <tr><td>Link</td><td><a href={link} target="_blanc">{link}</a></td></tr>
                </tbody>
            </table>
            <div className="avatar" style={{backgroundImage: 'url('+this.state.image+')'}} />
            {sound}
        </div>;
    }
}

export default TwitchPage;
