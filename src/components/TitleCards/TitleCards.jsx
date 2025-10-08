import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TitleCards.css';
import './GameCards.css'; // Importamos el nuevo CSS

const TitleCards = ({ title, category, type = "movie" }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();
  const navigate = useNavigate();

  const tmdbOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2UxMzViZjFiYjU2Y2VlNGE3NjUyYjdkYzRhMDBiMSIsIm5iZiI6MTcwOTcyOTY2NC45ODIsInN1YiI6IjY1ZTg2NzgwY2FhYjZkMDE4NTk2NjcwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lbf4T7hgr1EZ2W2GpHDw16P19eU7Rw0cgg-y_ap8UKU'
    }
  };

  const handleScrollLeft = () => {
    cardsRef.current.scrollBy({ left: -430, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    cardsRef.current.scrollBy({ left: 430, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];

        if (type === "game") {
          let endpoint = `http://localhost:4000/api/games`;
          if (category === 'upcoming') {
            endpoint = `http://localhost:4000/api/games?category=upcoming`;
          } else if (category === 'popular') {
            endpoint = `http://localhost:4000/api/games?category=popular`;
          } else if (category === 'top100') {
            endpoint = `http://localhost:4000/api/games?category=top100`;
          } else if (category === 'ps5') {
            endpoint = `http://localhost:4000/api/games?category=ps5`;
          } else if (category === 'xbox') {  // ← AGREGADO: Caso para Xbox
            endpoint = `http://localhost:4000/api/games?category=xbox`;
          } else if (category === 'nintendo') {  // ← AGREGADO: Caso para Nintendo
            endpoint = `http://localhost:4000/api/games?category=nintendo`;
          }
          console.log(`🔍 Frontend fetching games: ${endpoint}`); // Debug opcional
          const res = await fetch(endpoint);
          data = await res.json();
        } else {
          const endpoint = `https://api.themoviedb.org/3/${type}/${category || (type === "movie" ? "now_playing" : "on_the_air")}?language=es-ES&page=1`;
          const res = await fetch(endpoint, tmdbOptions);
          const json = await res.json();
          data = json.results || [];
        }

        setApiData(data);
      } catch (err) {
        console.error('❌ Frontend fetch error:', err);
        setApiData([]);
      }
    };

    fetchData();
  }, [category, type]);

  const truncateDescription = (text, max = 250) => {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + '...' : text;
  };

  // Clases dinámicas según el tipo
  const containerClass = type === "game" ? "game-cards" : "title-cards";
  const listContainerClass = type === "game" ? "game-card-list-container" : "card-list-container";
  const listClass = type === "game" ? "game-card-list" : "card-list";
  const cardClass = type === "game" ? "game-card" : "card";
  const titleClass = type === "game" ? "game-card-title" : "card-title";
  const descriptionClass = type === "game" ? "game-card-description" : "card-description";
  const buttonClass = type === "game" ? "game-scroll-button" : "scroll-button";

  return (
    <div className={containerClass}>
      <h2>{title || "Popular"}</h2>
      <div className={listContainerClass}>
        <button className={`${buttonClass} left`} onClick={handleScrollLeft}>
          &larr;
        </button>
        <div className={listClass} ref={cardsRef}>
          {apiData.length > 0 ? (
            apiData.map((card, index) => {
              const displayTitle = card.title || card.name || '';

              let displayImage = '';
              if (type === "game") {
                displayImage = card.cover?.url ? card.cover.url.replace('t_thumb', 't_cover_big') : '';
              } else {
                displayImage = card.backdrop_path || card.poster_path;
                displayImage = displayImage ? 'https://image.tmdb.org/t/p/w500' + displayImage : '';
              }

              const displayDescription = card.overview || card.summary || '';

              return (
                <div
                  className={cardClass}
                  key={index}
                  onClick={() => navigate(`/${type}/${card.id}`)}
                >
                  <img
                    src={displayImage || '/no-image.jpg'}
                  alt={displayTitle}
                  />
                  <p className={titleClass}>{displayTitle}</p>
                  <p className={descriptionClass}>
                    {truncateDescription(displayDescription)}
                  </p>
                </div>
              );
            })
          ) : (
            <p>No hay resultados disponibles</p>
          )}
        </div>
        <button className={`${buttonClass} right`} onClick={handleScrollRight}>
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default TitleCards;