import _ from 'lodash'

import { SET_GENRES_FILTER, RESET_GENRES_FILTER,
    ADD_TO_GENRES_WHITELIST, REMOVE_FROM_GENRES_WHITELIST,
    ADD_TO_GENRES_BLACKLIST, REMOVE_FROM_GENRES_BLACKLIST } from '../constants'

const initialGenresFilter = {
    whitelist: [],
    blacklist: []
};

export default (state = initialGenresFilter, action) => {
    const stateUpdates = {
        [SET_GENRES_FILTER]: action.filter,
        [RESET_GENRES_FILTER]: initialGenresFilter,
        [ADD_TO_GENRES_WHITELIST]: {
            whitelist: state.whitelist.concat([action.genre])
        },
        [REMOVE_FROM_GENRES_WHITELIST]: {
            whitelist: _.without(state.whitelist, action.genre)
        },
        [ADD_TO_GENRES_BLACKLIST]: {
            blacklist: state.blacklist.concat([action.genre])
        },
        [REMOVE_FROM_GENRES_BLACKLIST]: {
            blacklist: _.without(state.blacklist, action.genre)
        }
    };

    return Object.assign({}, state, stateUpdates[action.type]);
};
