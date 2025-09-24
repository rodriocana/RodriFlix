import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2UxMzViZjFiYjU2Y2VlNGE3NjUyYjdkYzRhMDBiMSIsIm5iZiI6MTcwOTcyOTY2NC45ODIsInN1YiI6IjY1ZTg2NzgwY2FhYjZkMDE4NTk2NjcwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lbf4T7hgr1EZ2W2GpHDw16P19eU7Rw0cgg-y_ap8UKU'
    }
  };

  useEffect(() => {
    // Fetch movie details
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=es-ES`, options)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error(err));

    // Fetch cast
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=es-ES`, options)
      .then(res => res.json())
      .then(data => setCast(data.cast.slice(0, 6))) // Limit to 6 actors
      .catch(err => console.error(err));

    // Fetch trailer
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=es-ES`, options)
      .then(res => res.json())
      .then(data => {
        const trailerVideo = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        setTrailer(trailerVideo);
      })
      .catch(err => console.error(err));
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-detail">
      <div className="movie-detail-backdrop">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="backdrop-img"
        />
        <div className="movie-detail-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>
            &larr; Volver
          </button>
          <div className="movie-detail-content">
            <h1>{movie.title}</h1>
            <p className="movie-description">{movie.overview}</p>
            <div className="movie-actions">
              {trailer && (
                <button className="trailer-btn" onClick={openModal}>
                  Ver Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="cast-section">
        <h2>Reparto</h2>
        <div className="cast-list">
          {cast.map(actor => (
            <div key={actor.id} className="cast-card">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Image'
                }
                alt={actor.name}
                className="cast-img"
              />
              <p>{actor.name}</p>
              <p className="character">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>
      {trailer && isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="trailer-iframe"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;