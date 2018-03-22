import React, { Component } from 'react';
import './App.css';
import TwitchPage from './pages/Twitch/TwitchPage.js';
import OAuth from './pages/OAuth/OAuth.js';
import Home from './pages/Home/Home.js';
import { BrowserRouter , Route, Switch, Redirect/*, Link*/ } from 'react-router-dom';

class App extends Component {
    constructor(props){
        super(props);
        this.state = { connectionEstablished: false };
        // this.connection = new Connection('/api');
        // this.ping();
    }

    componentDidMount() {
        // this.pingTimerID = setInterval(
        //     () => this.ping(),
        //     1000
        // );
    }

    componentWillUnmount() {
        // clearInterval(this.pingTimerID);
    }

    // ping(){
    //     this.connection.ping(
    //         pingIsOk => this.state.connectionEstablished !== pingIsOk && this.setState( { connectionEstablished: pingIsOk })
    //     );
    // }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Switch>
                        <Route exact path='/oauth' component={OAuth} />
                        <Route exact path='/:channel' component={TwitchPage} />
                        <Route exact path='/' component={Home} />
                        <Redirect to="/" />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}


export default App;
