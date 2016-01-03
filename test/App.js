'use strict';

import _ from 'lodash';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import { Store, shallowApp, shallowUpdate } from './helpers'

import Movies from '../src/comp/Movies'
import Filters from '../src/comp/Filters'
import * as actions from '../src/actions'

const defaultFilter = { whitelist: [], blacklist: [] };
let store;
let app;

describe('App', () => {

    context('on start', () => {
        beforeEach(() => {
            store = Store();
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
            store = Store();
        });

        it('should reset genres filter', () => {
            const genresFilter = { whitelist: ['drama'], blacklist: ['action'] };
            store.dispatch(actions.setGenresFilter(genresFilter));
            app = shallowApp(store);

            expect(app.find(Filters).prop('genresFilter')).to.deep.equal(genresFilter);

            store.dispatch(actions.resetGenresFilter());
            app = shallowUpdate(app, store);

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
                    store = Store();
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
                    store = Store();
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
