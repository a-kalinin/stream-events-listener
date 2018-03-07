/**
 * Created by Alex on 07.03.2018.
 */

import React, { Component } from 'react';
import './SoundPlay.css';

class SoundPlay extends Component {
    render () {
        return <audio className="SoundPlay" src={this.props.src} autoPlay={true} />;
    }
}

export default SoundPlay;
