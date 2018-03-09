/**
 * Created by Alex on 07.03.2018.
 */

import React, { Component } from 'react';
import './SoundPlay.css';

class SoundPlay extends Component {
    constructor(props){
        super(props);
        this.state = {ended:false};
        this.handleEnded = this.handleEnded.bind(this);
    }

    componentDidMount(){
        this.audio.addEventListener('ended',this.handleEnded);
    }

    componentWillUnmount(){
        if(this.audio){
            this.audio.removeEventListener('ended',this.handleEnded);
        }
    }

    handleEnded(){
        this.setState({ended:true})
    }

    render () {
        if(this.state.ended){
            return null;
        }
        return <audio ref={(audio) => this.audio = audio} className="SoundPlay" src={this.props.src} autoPlay={true}/>;
    }
}

export default SoundPlay;
