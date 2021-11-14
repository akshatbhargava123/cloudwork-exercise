import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';
import moment from 'moment';

import { reducer, epics, RootAction, RootState } from './state';
import * as WorkloadActions from './state/workloads/actions';
import './index.css';
import App from './components/App';


// @ts-ignore: use Redux devtools if installed in browser
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>();
const store = createStore(reducer, composeEnhancers(applyMiddleware(epicMiddleware)));
epicMiddleware.run(epics);

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('root'),
);
