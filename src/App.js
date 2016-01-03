import _ from 'lodash';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Movies from './comp/Movies';
import Filters from './comp/Filters';
import { setActiveIf } from './helpers/helpers'

export class App extends Component {
    constructor(props) {
        super(props);
        console.log('app');
        this.dispatch = props.store.dispatch;
        this.actions = props.actions;
    }

    componentWillMount() {
        console.log('componentWillMount');
        this.dispatch(this.actions.fetchMovies());
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps');
        if (!_.isEqual(nextProps.genresFilter, this.props.genresFilter)) {
            this.dispatch(this.actions.fetchMovies(nextProps.genresFilter));
        }
    }

    render() {
        console.log('App render', Object.keys(this.props));

        const genresFilter = this.props.genresFilter;

        const showAllGenres = () => {
            this.dispatch(this.actions.resetGenresFilter());
        };

        const showOnlyGenre = (genre) => {
            this.dispatch(this.actions.setGenresFilter({ whitelist: [genre], blacklist: [] }));
        };

        const hideGenre = (genre) => {
            this.dispatch(this.actions.addToGenresBlacklist(genre));
        };

        return (
            <div>
                <Filters
                    genresFilter={ genresFilter }
                    genres={ this.props.genres }
                    hideGenre={ hideGenre }
                    showOnlyGenre={ showOnlyGenre }
                    showAllGenres={ showAllGenres }
                />
                <Movies list={ this.props.movies } />
                <div className={ 'preloader' + setActiveIf(this.props.isFetching) }>Loading...</div>
            </div>
        );
    }
}

export const mapStateToProps = ({ movies, genresFilter }) => {
    console.log('mapStateToProps', movies, genresFilter);

    return {
        isFetching: movies.isFetching,
        movies: movies.movies,
        genres: movies.genres,
        genresFilter
    };
};

export default connect(mapStateToProps)(App);
