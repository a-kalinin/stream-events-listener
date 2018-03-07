/**
 * Created by Alex on 16.02.2018.
 */
import React, { Component } from 'react';
import './ConnectionStatus.css';

class ConnectionStatus extends Component {
    render () {
        return <div className="ConnectionStatus" data-connection-established={this.props.connected}>
        </div>;
    }
}

export default ConnectionStatus;
