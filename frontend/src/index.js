import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import {ModalProvider, Modal} from './context/Modal'
//import DeleteModal from './components/DeleteModal'
import './index.css';
import App from './App';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import * as groupActions from './store/group'

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
  window.groupActions = groupActions;
}

function Root() {
  return (
    <ModalProvider>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <App />
        <Modal />
      </BrowserRouter>
    </ReduxProvider>
    </ModalProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
