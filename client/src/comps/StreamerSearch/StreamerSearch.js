/**
 * Created by Alex on 09.03.2018.
 */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './StreamerSearch.css';

class StreamerSearch extends Component {
    constructor(props){
        super(props);
        this.state={inputValue:''};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    handleInputChange(event){
        this.setState({inputValue:event.target.value});
    }
    handleFormSubmit(event){
        event.preventDefault();
        this.setState({submitted: true});
    }
    render(){
        if (this.state.submitted){
            return <Redirect to={'/'+this.state.inputValue} push={true} />;
        }
        return <div className="StreamerSearch">
            <form onSubmit={this.handleFormSubmit}>
                <input name="streamer" onChange={this.handleInputChange} value={this.state.inputValue} required={true}/>
            </form>
        </div>;
    }
}

export default StreamerSearch;
