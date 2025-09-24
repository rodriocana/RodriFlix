import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TitleCards.css';

const TitleCards = ({ title, category, type = "movie" }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();
  const navigate = useNavigate();

  const options = {
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
    const endpoint = `https://api.themoviedb.org/3/${type}/${category || (type === "movie" ? "now_playing" : "on_the_air")}?language=es-ES&page=1`;

    fetch(endpoint, options)
      .then(res => res.json())
      .then(res => setApiData(res.results || []))
      .catch(err => console.error(err));
  }, [category, type]);

  const truncateDescription = (text) => {
    if (!text) return "";
    return text.length > 250 ? text.substring(0, 250) + '...' : text;
  };

  return (
    <div className='title-cards'>
      <h2>{title || "Popular on Netflix"}</h2>
      <div className="card-list-container">
        <button className="scroll-button left" onClick={handleScrollLeft}>
          &larr;
        </button>
        <div className="card-list" ref={cardsRef}>
          {apiData.length > 0 ? (
            apiData.map((card, index) => {
              const displayTitle = card.title || card.name;
              const displayImage = card.backdrop_path || card.poster_path;

              return (
                <div
                  className="card"
                  key={index}
                  onClick={() => navigate(`/${type}/${card.id}`)}
                >
                  <img
                    src={
                      displayImage
                        ? 'https://image.tmdb.org/t/p/w500' + displayImage
                        : '/no-image.jpg'
                    }
                    alt={displayTitle}
                  />
                  <p className="card-title">{displayTitle}</p>
                  <p className="card-description">
                    {truncateDescription(card.overview)}
                  </p>
                </div>
              );
            })
          ) : (
            <p>No hay resultados disponibles</p>
          )}
        </div>
        <button className="scroll-button right" onClick={handleScrollRight}>
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default TitleCards;
