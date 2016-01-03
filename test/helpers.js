'use strict';

import React from 'react'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { shallow } from 'enzyme';

import { App, mapStateToProps } from '../src/App'
import Movies from '../src/comp/Movies'
import reducer from '../src/reducers'
import * as actions from '../src/actions'

export const Store = () => applyMiddleware(thunk)(createStore)(reducer);

export const shallowApp = (store, props) => {
    const appProps = props ? props : mapStateToProps(store.getState());

    return shallow(React.createElement(App, Object.assign({ store, actions }, appProps)));
};
export const shallowUpdate = (comp, store, props) => {
    const appProps = props ? props : mapStateToProps(store.getState());
    comp.setProps(Object.assign({ store, actions }, appProps));

    return comp;
};