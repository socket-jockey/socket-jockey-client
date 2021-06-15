import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from '../LandingPage/LandingPage';
import RoomsPage from '../RoomsPage/RoomsPage';

import './App.css';
// import Header from './Header';
import Footer from './Footer';
import RoomSelectionPage from '../RoomsPage/RoomSelectionPage';
import { Container } from '@material-ui/core';

const App = () => {
  // const [room, setRoom] = useState('');

  return (
    <Container disableGutters={true} maxWidth={false}>
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
        </Switch>
       
        <Switch>
          <Route exact path="/rooms" component={RoomSelectionPage} />

          <Route exact path="/rooms/:room" component={RoomsPage} />

          <Route
            exact
            path="/about"
            // component={AboutDevs}
          />
        </Switch>
        <Footer />
      </Router>
    </Container>
  );
};

export default App;
