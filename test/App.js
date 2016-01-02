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

import { App, mapStateToProps } from '../src/App'
import Movies from '../src/comp/Movies'
import Filters from '../src/comp/Filters'
import reducer from '../src/reducers'
import * as actions from '../src/actions'

let store;
let app;

describe('App', () => {

    context('on start', () => {
        beforeEach(() => {
            store = createStoreWithMiddleware(reducer);
            sinon.spy(actions, 'fetchMovies');
            app = shallowApp(store);
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
    context('on "showAllGenres"', () => {
        beforeEach(() => {
            store = createStoreWithMiddleware(reducer);
        });

        it('should reset genres filter', () => {
            const genresFilter = { whitelist: ['drama'], blacklist: ['action'] };
            app = shallowApp(store, { genresFilter });

            expect(app.find(Filters).prop('genresFilter')).to.deep.equal(genresFilter);

            store.dispatch(actions.resetGenresFilter());
            app = shallowApp(store);

            expect(app.find(Filters).prop('genresFilter')).to.deep.equal(defaultFilter);
        });
        it('should refetch all movies', () => {
            sinon.spy(actions, 'fetchMovies');
            store.dispatch(actions.resetGenresFilter());
            app = shallowApp(store);

            expect(actions.fetchMovies).to.be.calledWith();
            actions.fetchMovies.restore();
        });
    })
});

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const defaultFilter = { whitelist: [], blacklist: [] };

const shallowApp = (store, props) => {
    const appProps = props ? props : mapStateToProps(store.getState());

    return shallow(<App { ...appProps } store={ store } actions={ actions }/>);
};