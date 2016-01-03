import _ from 'lodash'
import React from 'react'

export default (props) =>
    <ul>
        { props.list.map(movie =>
            <li className="movie" key={ movie._id }>
                <h2>{ movie.title } <small>{ movie.year }</small></h2>
                <span>[{ movie.rating }]</span>
                <div><img src={ movie.poster } /></div>
                <div>{ movie.genres.join(', ') }</div>
                <div>Directed by: { movie.directors.join(', ') }</div>
                <div>Cast: { movie.actors.join(', ') }</div>
            </li>
        ) }
    </ul>

