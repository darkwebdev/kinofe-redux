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

describe('Genres filter reducer', () => {

    describe('on action "resetGenresFilter"', () => {
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

    describe('on action "setFilter"', () => {
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

    describe('on action "addToGenresWhitelist"', () => {
        beforeEach(() => {
            store = createStoreWithMiddleware(reducer);
        });

        it('should change filter state', () => {
            const expectedWhitelist = ['sci-fi'];

            store.dispatch(actions.resetGenresFilter());

            expect(store.getState().genresFilter.whitelist).to.be.empty;

            store.dispatch(actions.addToGenresWhitelist('sci-fi'));

            expect(store.getState().genresFilter.whitelist).to.deep.equal(expectedWhitelist);
        });
    });

    describe('on action "removeFromGenresWhitelist"', () => {
        beforeEach(() => {
            store = createStoreWithMiddleware(reducer);
        });

        it('should change filter state', () => {
            store.dispatch(actions.setGenresFilter({ whitelist: [ 'crime' ], blacklist: [] }));

            expect(store.getState().genresFilter.whitelist).to.deep.equal([ 'crime' ]);

            store.dispatch(actions.removeFromGenresWhitelist('crime'));

            expect(store.getState().genresFilter.whitelist).to.be.empty;
        });
    });

    describe('on action "addToGenresBlacklist"', () => {
        beforeEach(() => {
            store = createStoreWithMiddleware(reducer);
        });

        it('should change filter state', () => {
            const expectedBlacklist = ['sci-fi'];

            store.dispatch(actions.resetGenresFilter());

            expect(store.getState().genresFilter.blacklist).to.be.empty;

            store.dispatch(actions.addToGenresBlacklist('sci-fi'));

            expect(store.getState().genresFilter.blacklist).to.deep.equal(expectedBlacklist);
        });
    });

    describe('on action "removeFromGenresBlacklist"', () => {
        beforeEach(() => {
            store = createStoreWithMiddleware(reducer);
        });

        it('should change filter state', () => {
            store.dispatch(actions.setGenresFilter({ whitelist: [], blacklist: [ 'crime' ] }));

            expect(store.getState().genresFilter.blacklist).to.deep.equal([ 'crime' ]);

            store.dispatch(actions.removeFromGenresBlacklist('crime'));

            expect(store.getState().genresFilter.blacklist).to.be.empty;
        });
    });
});