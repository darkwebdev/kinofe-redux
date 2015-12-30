import { combineReducers } from 'redux'

import movies from './reducers/movies'
import genresFilter from './reducers/genresFilter'

export default combineReducers({
    movies,
    genresFilter
})