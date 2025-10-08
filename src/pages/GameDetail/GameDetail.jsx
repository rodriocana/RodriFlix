import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GameDetail.css';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/games/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los detalles del juego');
        return res.json();
      })
      .then(data => {
        setGame(data);
        setCompanies(data.involved_companies?.map(c => c.company) || []);
        setScreenshots(data.screenshots?.slice(0, 8) || []);
        setTrailer(data.videos?.[0] || null);
      })
      .catch(err => console.error(err));
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  if (!game) return <div>Loading...</div>;

  const releaseDate = game.first_release_date
    ? new Date(game.first_release_date * 1000).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Fecha no disponible';

  const rating = game.rating ? (game.rating / 10).toFixed(1) : null;
  const backdropUrl = game.cover?.url?.replace('t_thumb', 't_original') || '/no-image.jpg';

  return (
    <div className="game-detail">
      <div className="game-detail-backdrop">
        <img src={backdropUrl} alt={game.name} className="backdrop-img" />
        <div className="game-detail-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>
            &larr; Volver
          </button>
          <div className="game-detail-content">
            <h1>{game.name}</h1>
            <p className="game-description">{game.summary || 'Descripción no disponible'}</p>
            <div className="game-actions">
              {trailer && (
                <button className="trailer-btn" onClick={openModal}>
                  Ver Trailer
                </button>
              )}
              {rating && (
                <span className="game-rating">
                  ⭐ {rating}/10
                </span>
              )}
              {game.first_release_date && (
                <span className="game-release-date">
                  📅 {releaseDate}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="companies-section">
        <h2>Desarrolladores y Publicadores</h2>
        <div className="companies-list">
          {companies.map(company => (
            <div key={company.id} className="company-item">
              <p>{company.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="screenshots-section">
        <h2>Capturas de Pantalla</h2>
        <div className="screenshots-list">
          {screenshots.map(screenshot => (
            <div key={screenshot.id} className="screenshot-item">
              <img
                src={screenshot.url.replace('t_thumb', 't_original')}
                alt="Captura de pantalla"
                className="screenshot-img"
                onClick={() => openImageModal(screenshot.url.replace('t_thumb', 't_original'))}
                style={{ cursor: 'pointer' }}
              />
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
              src={`https://www.youtube.com/embed/${trailer.video_id}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="trailer-iframe"
            ></iframe>
          </div>
        </div>
      )}
      {isImageModalOpen && selectedImage && (
        <div className="modal image-modal">
          <div className="modal-content image-modal-content">
            <button className="modal-close-btn" onClick={closeImageModal}>
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Captura de pantalla ampliada"
              className="image-modal-img"
            />
          </div>
        </div>
      )}
      <button className="btn-volver-inicio" onClick={() => navigate('/')}>
        Volver a inicio
      </button>
    </div>
  );
};

export default GameDetail;