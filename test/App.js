'use strict';

import _ from 'lodash';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import React from 'react'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { shallow } from 'enzyme';

import { App } from '../src/App'
import Movies from '../src/comp/Movies'
import Filters from '../src/comp/Filters'
import reducer from '../src/reducers'
import * as actions from '../src/actions'


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
let store;
let app;

describe('App', () => {

    context('on start', () => {
        beforeEach(() => {
            store = createStoreWithMiddleware(reducer);
            sinon.spy(actions, 'fetchMovies');
            app = shallow(<App store={ store } actions={ actions }/>);
        });
        afterEach(() => {
            actions.fetchMovies.restore();
        });

        it('should show filters and movies', () => {
            expect(app.find(Movies)).to.have.length(1);
            expect(app.find(Filters)).to.have.length(1);
        });

        it('should dispatch "fetchMovies"', () => {
            expect(actions.fetchMovies).to.be.calledWith();
        });
    });
});
