import _ from 'lodash'
import qs from 'qs'
import fetch from 'node-fetch'

import { REQUEST_MOVIES, GOT_MOVIES, GOT_ERROR, SET_FILTERS, RESET_FILTERS } from './constants'
import { api } from '../config/main'

export const requestMovies = (url) => { console.log('requestMovies'); return { type: REQUEST_MOVIES, url }};
export const gotMovies = (items) => ({ type: GOT_MOVIES, items });
export const gotError = (err) => ({ type: GOT_ERROR, err });
export const setFilters = (filters) => ({ type: SET_FILTERS, filters });
export const resetFilters = () => ({ type: RESET_FILTERS });

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
