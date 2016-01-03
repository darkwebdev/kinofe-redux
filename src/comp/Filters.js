import _ from 'lodash'
import React from 'react'

export default (props) =>
    <section className="filters">
        <h2>Genres To Show</h2>
        <ul>
            { props.genres.map(genre =>
                <li className="genre"
                    onClick={ props.showOnlyGenre.bind(null, genre) }>{ genre }</li>
            ) }
        </ul>
        <ul>
            { props.filters.genresOnly.map(genre =>
                <li className="genre active">{ genre }</li>
            ) }
        </ul>
        <button className="btn-all" onClick={ props.showAllGenres }>Show all</button>


        <h2>Genres To Hide</h2>
        <ul>
            { props.genres.map(genre =>
                <li className="genre"
                    onClick={ props.hideGenre.bind(null, genre) }>{ genre }</li>
            ) }
        </ul>
        <ul>
            { props.filters.genresIgnore.map(genre =>
                <li className="genre active">{ genre }</li>
            ) }
        </ul>
        <button className="btn-all" onClick={ props.showAllGenres }>Show all</button>
    </section>

