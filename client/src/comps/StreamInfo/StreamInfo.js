/**
 * Created by Alex on 09.03.2018.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './StreamInfo.scss';

class StreamInfo extends Component{
    render(){
        return <div className="StreamInfo">
            <table className="info">
                <tbody>
                <tr>
                    <td>
                        <div className="avatar" style={{backgroundImage: 'url('+this.props.image+')'}} />
                    </td>
                    <td>
                        {this.props.streamer}
                        <Link to='/' className="homeLink" />
                    </td>
                </tr>
                <tr>
                    <td>Connection to API:</td>
                    <td>{this.props.apiConnected}</td>
                </tr>
                <tr>
                    <td>Name:</td>
                    <td>{this.props.displayName}</td>
                </tr>
                <tr>
                    <td>Stream name:</td>
                    <td>{this.props.title}</td>
                </tr>
                <tr>
                    <td>Watching:</td>
                    <td>{this.props.viewersCount}</td>
                </tr>
                <tr>
                    <td>Link:</td>
                    <td><a href={this.props.link} target="_blanc">Page on Twitter</a></td>
                </tr>
                </tbody>
            </table>
        </div>;
    }
}

export default StreamInfo;