import _ from 'lodash'

import { REQUEST_MOVIES, GOT_MOVIES, GOT_ERROR } from '../constants'

const initialMoviesState = {
    isFetching: false,
    movies: [],
    genres: []
};

export default (state = initialMoviesState, action) => {

    const stateUpdates = {
        [REQUEST_MOVIES]: {
            isFetching: true
        },
        [GOT_MOVIES]: {
            isFetching: false,
            movies: action.items,
            genres: _.chain(action.items).pluck('genres').flatten().unique().value()
        },
        [GOT_ERROR]: {
            isFetching: false
        }
    };

    return Object.assign({}, state, stateUpdates[action.type]);
};