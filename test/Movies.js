'use strict';

import _ from 'lodash';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import { Store, shallowApp, shallowUpdate } from './helpers'
import Movies from '../src/comp/Movies'
import * as actions from '../src/actions'
import topMovies from './data/top-movies'
import topMoviesState from './data/top-movies-state'

let store;
let app;

describe('Movies', () => {
    it('should show Movie list on API response', () => {
        store = Store();
        app = shallowApp(store);

        expect(app.find(Movies).prop('list')).to.be.empty;

        store.dispatch(actions.gotMovies(topMovies));
        app = shallowUpdate(app, store);

        expect(app.find(Movies).prop('list')).to.deep.equal(topMoviesState);
    });
});
