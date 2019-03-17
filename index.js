import React from 'react'
import "babel-polyfill";
import thunkMiddleware from 'redux-thunk'
import ReactDom from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import appReducer from './client/components/uiManager/UIManagerReducer.js'
import App from './client/App.jsx'

let store = createStore(appReducer, applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
));

export const dispatch = store.dispatch

ReactDom.render(<App store={store} />, document.getElementById('appRoot'));