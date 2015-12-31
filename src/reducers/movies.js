import _ from 'lodash'

import * as CONST from '../constants'

const initialMoviesState = {
    isFetching: false,
    movies: [],
    genres: []
};

export default (state = initialMoviesState, action) => {

    const stateUpdates = {
        [CONST.REQUEST_MOVIES]: {
            isFetching: true
        },
        [CONST.GOT_MOVIES]: {
            isFetching: false,
            movies: action.items,
            genres: _.chain(action.items).pluck('genres').flatten().unique().value()
        },
        [CONST.GOT_ERROR]: {
            isFetching: false
        }
    };

    return Object.assign({}, state, stateUpdates[action.type]);
};