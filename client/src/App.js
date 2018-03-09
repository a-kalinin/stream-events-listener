import React, { Component } from 'react';
import './App.css';
// import Connection from './plugins/Connection/Connection.js';
// import ConnectionStatus from './comps/ConnectionStatus/ConnectionStatus.js';
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
                        <Route exact path='/:streamer' component={TwitchPage} />
                        <Route exact path='/' component={Home} />
                        {/*<Route exact path='/' render={(props)=>{
                            return <div>
                                <ConnectionStatus connected={this.state.connectionEstablished}/>
                                <Section>
                                    <Header>Worked today</Header>
                                </Section>
                            </div>
                        }} />*/}
                        <Redirect to="/" />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}


export default App;
