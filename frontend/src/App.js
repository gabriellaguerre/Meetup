import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import LoginFormPage from './components/LoginFormModal';
import SignUpPage from './components/SignupFormModal';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage'
import Groups from './components/Groups'
import GroupDetail from './components/Groups/GroupDetails'
import CreateGroup from './components/Groups/CreateGroup'
import EditGroup from './components/Groups/EditGroup'
import Events from './components/Events'
import EventDetail from './components/Events/EventDetails'



function App() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />

      {isLoaded && (
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/groups' component={Groups} />
           <Route exact path='/groups/new' component={CreateGroup} />
          <Route  exact path='/groups/:groupId' component={GroupDetail} />
          <Route path='/groups/:groupId/edit' component={EditGroup} />
          <Route path='/events' component={Events} />
          <Route path='/events/id' component={EventDetail} />
        </Switch>
      )}

    </>
  );
}

export default App;
