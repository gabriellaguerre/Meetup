import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import LoginFormPage from './components/LoginFormModal';
import SignUpPage from './components/SignupFormModal';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import Groups from './components/Groups'
import GroupDetail from './components/Groups/GroupDetails'
import Events from './components/Events'

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
          <Route path='/groups' component={Groups} />
          <Route exact path='/groups/:groupId' component={GroupDetail} />
          <Route path='/events' component={Events} />
        </Switch>
      )}
    </>
  );
}

export default App;
