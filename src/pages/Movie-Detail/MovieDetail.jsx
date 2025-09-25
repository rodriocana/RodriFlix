import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determinar si es película o serie según la URL
  const type = location.pathname.includes('/movie/') ? 'movie' : 'tv';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2UxMzViZjFiYjU2Y2VlNGE3NjUyYjdkYzRhMDBiMSIsIm5iZiI6MTcwOTcyOTY2NC45ODIsInN1YiI6IjY1ZTg2NzgwY2FhYjZkMDE4NTk2NjcwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lbf4T7hgr1EZ2W2GpHDw16P19eU7Rw0cgg-y_ap8UKU'
    }
  };

  useEffect(() => {
    // Fetch detalles del ítem (película o serie)
    fetch(`https://api.themoviedb.org/3/${type}/${id}?language=es-ES`, options)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los detalles');
        return res.json();
      })
      .then(data => setItem(data))
      .catch(err => console.error(err));

    // Fetch reparto
    fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?language=es-ES`, options)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener el reparto');
        return res.json();
      })
      .then(data => setCast(data.cast.slice(0, 6))) // Limitar a 6 actores
      .catch(err => console.error(err));

    // Fetch trailer
    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`, options)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener el trailer');
        return res.json();
      })
      .then(data => {
        const trailerVideo = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        setTrailer(trailerVideo);
      })
      .catch(err => console.error(err));
  }, [id, type]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleActorClick = (actorId) => {
    navigate(`/person/${actorId}`);
  };

  if (!item) return <div>Loading...</div>;

  // Usar 'title' para películas y 'name' para series
  const title = type === 'movie' ? item.title : item.name;
  // Determinar la fecha de estreno según el tipo
  const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
  // Formatear la fecha de estreno
  const formattedDate = releaseDate
    ? new Date(releaseDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Fecha no disponible';

  return (
    <div className="movie-detail">
      <div className="movie-detail-backdrop">
        <img
          src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
          alt={title}
          className="backdrop-img"
        />
        <div className="movie-detail-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>
            &larr; Volver
          </button>
          <div className="movie-detail-content">
            <h1>{title}</h1>
            <p className="movie-description">{item.overview}</p>
            <div className="movie-actions">
              {trailer && (
                <button className="trailer-btn" onClick={openModal}>
                  Ver Trailer
                </button>
              )}
              {item.vote_average && (
                <span className="movie-rating">
                  ⭐ {item.vote_average.toFixed(1)}/10
                </span>
              )}
              {releaseDate && (
                <span className="movie-release-date">
                  📅 {formattedDate}
                </span>
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
                onClick={() => handleActorClick(actor.id)}
                style={{ cursor: 'pointer' }}
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
      <button className='btn-volver-inicio' onClick={() => navigate('/')}>
  Volver a inicio
</button>
    </div>
  );
};

export default MovieDetail;