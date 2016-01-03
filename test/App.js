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
    });

    context('on "showOnlyGenre"', () => {
        [
            {
                genresFilter: {
                    whitelist: [], blacklist: []
                },
                onlyGenre: 'sci-fi',
                expectedFilter: {
                    whitelist: [ 'sci-fi' ], blacklist: []
                }
            },
            {
                genresFilter: {
                    whitelist: [], blacklist: ['comedy']
                },
                onlyGenre: 'drama',
                expectedFilter: {
                    whitelist: [ 'drama' ], blacklist: []
                }
            },
            {
                genresFilter: {
                    whitelist: ['drama', 'action'], blacklist: []
                },
                onlyGenre: 'comedy',
                expectedFilter: {
                    whitelist: [ 'comedy' ], blacklist: []
                }
            }
        ].map(({ genresFilter, onlyGenre, expectedFilter }) => {
            context('', () => {
                beforeEach(() => {
                    sinon.spy(actions, 'fetchMovies');
                    store = createStoreWithMiddleware(reducer);
                    store.dispatch(actions.setGenresFilter(genresFilter));
                    app = shallowApp(store);
                });
                afterEach(() => {
                    actions.fetchMovies.restore();
                });

                it('should set Filters to only Genre "' + onlyGenre + '"', () => {
                    expect(app.find(Filters).prop('genresFilter')).to.deep.equal(genresFilter);

                    app.find(Filters).prop('showOnlyGenre')(onlyGenre);
                    app = shallowUpdate(app, store);

                    expect(app.find(Filters).prop('genresFilter')).to.deep.equal(expectedFilter);
                });
                it('should Fetch only movies of Genre "' + onlyGenre + '"', () => {
                    app.find(Filters).prop('showOnlyGenre')(onlyGenre);

                    app = shallowUpdate(app, store);
                    expect(actions.fetchMovies).to.be.calledWith(expectedFilter);
                });
            })
        });
    });

    context('on "hideGenre"', () => {
        [
            {
                genresFilter: {
                    whitelist: [], blacklist: []
                },
                hiddenGenre: 'sci-fi',
                expectedFilter: {
                    whitelist: [], blacklist: [ 'sci-fi' ]
                }
            },
            {
                genresFilter: {
                    whitelist: [], blacklist: [ 'comedy' ]
                },
                hiddenGenre: 'drama',
                expectedFilter: {
                    whitelist: [], blacklist: [ 'comedy', 'drama' ]
                }
            },
            {
                genresFilter: {
                    whitelist: [ 'drama', 'action' ], blacklist: []
                },
                hiddenGenre: 'comedy',
                expectedFilter: {
                    whitelist: [ 'drama', 'action' ], blacklist: [ 'comedy' ]
                }
            }
        ].map(({ genresFilter, hiddenGenre, expectedFilter }) => {
            context('', () => {
                beforeEach(() => {
                    sinon.spy(actions, 'fetchMovies');
                    store = createStoreWithMiddleware(reducer);
                    store.dispatch(actions.setGenresFilter(genresFilter));
                    app = shallowApp(store);
                });
                afterEach(() => {
                    actions.fetchMovies.restore();
                });

                it('should add Genre "' + hiddenGenre + '" to Blacklist', () => {
                    expect(app.find(Filters).prop('genresFilter')).to.deep.equal(genresFilter);

                    app.find(Filters).prop('hideGenre')(hiddenGenre);
                    app = shallowUpdate(app, store);

                    expect(app.find(Filters).prop('genresFilter')).to.deep.equal(expectedFilter);
                });
                it('should Fetch only movies without Genre "' + hiddenGenre + '"', () => {
                    app.find(Filters).prop('hideGenre')(hiddenGenre);

                    app = shallowUpdate(app, store);
                    expect(actions.fetchMovies).to.be.calledWith(expectedFilter);
                });
            })
        });
    });
});

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const defaultFilter = { whitelist: [], blacklist: [] };

const shallowApp = (store, props) => {
    const appProps = props ? props : mapStateToProps(store.getState());

    return shallow(React.createElement(App, Object.assign({ store, actions }, appProps)));
};
const shallowUpdate = (comp, store, props) => {
    const appProps = props ? props : mapStateToProps(store.getState());
    comp.setProps(Object.assign({ store, actions }, appProps));

    return comp;
};