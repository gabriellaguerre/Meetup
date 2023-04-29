import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignUpPage from './components/SignUpPage';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';

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
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignUpPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
