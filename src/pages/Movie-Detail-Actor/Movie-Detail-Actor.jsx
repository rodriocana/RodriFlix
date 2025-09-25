import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import defaultPoster from '../../assets/default-poster.png';
import './Movie-Detail-Actor.css';

const MovieDetailActor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [tvShows, setTvShows] = useState([]);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2UxMzViZjFiYjU2Y2VlNGE3NjUyYjdkYzRhMDBiMSIsIm5iZiI6MTcwOTcyOTY2NC45ODIsInN1YiI6IjY1ZTg2NzgwY2FhYjZkMDE4NTk2NjcwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lbf4T7hgr1EZ2W2GpHDw16P19eU7Rw0cgg-y_ap8UKU'
    }
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/person/${id}?language=es-ES`, options)
      .then(res => res.json())
      .then(data => setActor(data))
      .catch(err => console.error('Error fetching actor details:', err));

    fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?language=es-ES`, options)
      .then(res => res.json())
      .then(data => {
        const sortedMovies = data.cast
          .sort((a, b) => {
            if (sortOrder === 'popular') return (b.popularity || 0) - (a.popularity || 0);
            const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
            const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
          })
          .slice(0, 20);
        setMovies(sortedMovies);
      })
      .catch(err => console.error('Error fetching movie credits:', err));

    fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits?language=es-ES`, options)
      .then(res => res.json())
      .then(data => {
        const sortedTv = data.cast
          .sort((a, b) => {
            if (sortOrder === 'popular') return (b.popularity || 0) - (a.popularity || 0);
            const dateA = a.first_air_date ? new Date(a.first_air_date) : new Date(0);
            const dateB = b.first_air_date ? new Date(b.first_air_date) : new Date(0);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
          })
          .slice(0, 20);
        setTvShows(sortedTv);
      })
      .catch(err => console.error('Error fetching TV credits:', err));
  }, [id, sortOrder]);

  if (!actor) return <div>Loading...</div>;

  return (
    <div className="actor-detail">
      <div className="actor-detail-backdrop">
        <div className="actor-detail-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>
            &larr; Volver
          </button>
          <div className="actor-detail-content">
            <h1>{actor.name}</h1>
            <div className="actor-info">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Image'
                }
                alt={actor.name}
                className="actor-profile-img"
              />
              <div className="actor-details">
                <h3>Biografía</h3>
                <p>{actor.biography || 'No hay biografía disponible.'}</p>
                <p><strong>Fecha de nacimiento:</strong> {actor.birthday || 'N/A'}</p>
                <p><strong>Lugar de nacimiento:</strong> {actor.place_of_birth || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="movies-section">
        <div className="movies-header">
          <h2>Películas</h2>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-selector"
          >
            <option value="newest">Más recientes primero</option>
            <option value="oldest">Más antiguas primero</option>
            <option value="popular">Más populares</option>
          </select>
        </div>
        <div className="movies-list">
          {movies.map(movie => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : defaultPoster
                }
                alt={movie.title}
                className="movie-img"
              />
              <p>{movie.title}</p>
              <p className="movie-year">{movie.release_date?.split('-')[0] || 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="movies-section">
        <div className="movies-header">
          <h2>Series</h2>
        </div>
        <div className="movies-list">
          {tvShows.map(tv => (
            <div
              key={tv.id}
              className="movie-card"
              onClick={() => navigate(`/tv/${tv.id}`)}
            >
              <img
                src={
                  tv.poster_path
                    ? `https://image.tmdb.org/t/p/w200${tv.poster_path}`
                    : defaultPoster
                  }
                  alt={tv.name}
                  className="movie-img"
                />
                <p>{tv.name}</p>
                <p className="movie-year">{tv.first_air_date?.split('-')[0] || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
        <button className="btn-volver-inicio" onClick={() => navigate('/')}>
          Volver a inicio
        </button>
      </div>
  );
};

export default MovieDetailActor;