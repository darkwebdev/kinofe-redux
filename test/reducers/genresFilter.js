'use strict';

import _ from 'lodash';
import {expect} from 'chai';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

import reducer from '../../src/reducers'
import * as actions from '../../src/actions'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const defaultFilter = { whitelist: [], blacklist: [] };
let store;

describe('Reducer', () => {

    describe('resetGenresFilter', () => {
        beforeEach(() => {
            store = createStoreWithMiddleware(reducer);
        });

        it('should reset filter state to default', () => {
            store.dispatch(actions.setGenresFilter({ whitelist: ['x'], blacklist: ['y'] }));

            expect(store.getState().genresFilter).not.to.deep.equal(defaultFilter);

            store.dispatch(actions.resetGenresFilter());

            expect(store.getState().genresFilter).to.deep.equal(defaultFilter);
        });
    });

    describe('setFilter', () => {
        beforeEach(() => {
            store = createStoreWithMiddleware(reducer);
        });

        it('should change filter state', () => {
            const genresFilter = {
                whitelist: [ 'crime', 'comedy' ],
                blacklist: [ 'biography', 'drama' ]
            };
            store.dispatch(actions.resetGenresFilter());

            expect(store.getState().genresFilter).not.to.deep.equal(genresFilter);

            store.dispatch(actions.setGenresFilter(genresFilter));

            expect(store.getState().genresFilter).to.deep.equal(genresFilter);
        });

        context('without parameters', () => {
            it('should not change filter state', () => {
                const genresFilter = {
                    whitelist: [ 'crime' ],
                    blacklist: [ 'drama' ]
                };

                store.dispatch(actions.setGenresFilter(genresFilter));

                expect(store.getState().genresFilter).to.deep.equal(genresFilter);

                store.dispatch(actions.setGenresFilter());

                expect(store.getState().genresFilter).to.deep.equal(genresFilter);
            });
        })
    });
});