import _ from 'lodash'
import qs from 'qs'
import fetch from 'node-fetch'

import * as CONST from './constants'
import { api } from '../config/main'

export const requestMovies = (url) => { console.log('requestMovies'); return { type: CONST.REQUEST_MOVIES, url }};
export const gotMovies = (items) => ({ type: CONST.GOT_MOVIES, items });
export const gotError = (err) => ({ type: CONST.GOT_ERROR, err });
export const setGenresFilter = (filter) => ({ type: CONST.SET_GENRES_FILTER, filter });
export const resetGenresFilter = () => ({ type: CONST.RESET_GENRES_FILTER });
export const addToGenresWhitelist = (genre) => ({ type: CONST.ADD_TO_GENRES_WHITELIST, genre });
export const removeFromGenresWhitelist = (genre) => ({ type: CONST.REMOVE_FROM_GENRES_WHITELIST, genre });
export const addToGenresBlacklist = (genre) => ({ type: CONST.ADD_TO_GENRES_BLACKLIST, genre });
export const removeFromGenresBlacklist = (genre) => ({ type: CONST.REMOVE_FROM_GENRES_BLACKLIST, genre });

const appendFilters = (filters) =>
    _.isEmpty(filters) ? '' : ('?' + qs.stringify(filters, { indices: false }));

export const fetchMovies = (filters) => (dispatch) => {
    console.log('fetchMovies', filters);

    const apiUrl = api.url + '/movies' + appendFilters(filters);

    dispatch(requestMovies(apiUrl));

    return fetch(apiUrl)
        .then(response => {
            console.log('got response', response);
            return response.json()
        })
        .then(json =>
            dispatch(gotMovies(json)))
        .catch(ex =>
            dispatch(gotError(ex)))
};
