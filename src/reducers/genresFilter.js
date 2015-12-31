import _ from 'lodash'

import * as CONST from '../constants'

const initialGenresFilter = {
    whitelist: [],
    blacklist: []
};

export default (state = initialGenresFilter, action) => {
    const stateUpdates = {
        [CONST.SET_GENRES_FILTER]: action.filter,
        [CONST.RESET_GENRES_FILTER]: initialGenresFilter,
        [CONST.ADD_TO_GENRES_WHITELIST]: {
            whitelist: state.whitelist.concat([action.genre])
        },
        [CONST.REMOVE_FROM_GENRES_WHITELIST]: {
            whitelist: _.without(state.whitelist, action.genre)
        },
        [CONST.ADD_TO_GENRES_BLACKLIST]: {
            blacklist: state.blacklist.concat([action.genre])
        },
        [CONST.REMOVE_FROM_GENRES_BLACKLIST]: {
            blacklist: _.without(state.blacklist, action.genre)
        }
    };

    return Object.assign({}, state, stateUpdates[action.type]);
};
