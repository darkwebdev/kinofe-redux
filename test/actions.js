'use strict';

import _ from 'lodash';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import React from 'react'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { shallow } from 'enzyme';

import { api } from '../config/main'
import reducer from '../src/reducers'
import * as actions from '../src/actions'
import topMoviesJson from './data/top-movies';
import topMoviesState from './data/top-movies-state';


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
let store;

describe('Action', () => {
    describe('"fetchMovies"', () => {
        it('should dispatch "requestMovies" with proper url', () => {
            const fakeDispatch = sinon.spy();
            actions.fetchMovies()(fakeDispatch);

            const expectedUrl = api.url + '/movies';
            expect(fakeDispatch).to.be.calledWith(actions.requestMovies(expectedUrl));
        });
    });
    describe('"fetchMovies"', () => {
        it('should activate preloader', () => {
            store = createStoreWithMiddleware(reducer);

            expect(store.getState().movies.isFetching).to.be.false;

            store.dispatch(actions.requestMovies());

            expect(store.getState().movies.isFetching).to.be.true;
        });
    });
    describe('"gotMovies"', () => {
        beforeEach(() => {
            store = createStoreWithMiddleware(reducer);
        });

        it('should change Movies state', () => {
            expect(store.getState().movies.movies).to.deep.equal([]);

            store.dispatch(actions.gotMovies(topMoviesJson));

            expect(store.getState().movies.movies).to.deep.equal(topMoviesState);
        });
        it('should change Genres state', () => {
            const expectedGenres = [ 'animation', 'crime', 'drama' ];

            expect(store.getState().movies.genres).to.deep.equal([]);

            store.dispatch(actions.gotMovies([
                { genres: expectedGenres.slice(0, 2) },
                { genres: expectedGenres.slice(2) }
            ]));

            expect(store.getState().movies.genres).to.deep.equal(expectedGenres);
        });
        it('should deactivate preloader', () => {
            store.dispatch(actions.requestMovies());

            expect(store.getState().movies.isFetching).to.be.true;

            store.dispatch(actions.gotMovies());

            expect(store.getState().movies.isFetching).to.be.false;
        });
    });
});