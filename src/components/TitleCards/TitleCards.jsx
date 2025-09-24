import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TitleCards.css';

const TitleCards = ({ title, category }) => {
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
    fetch(`https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=es-ES&page=1`, options)
      .then(res => res.json())
      .then(res => setApiData(res.results))
      .catch(err => console.error(err));
  }, [category]);

  const truncateDescription = (text) => {
    if (text.length > 250) {
      return text.substring(0, 250) + '...';
    }
    return text;
  };

  return (
    <div className='title-cards'>
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list-container">
        <button className="scroll-button left" onClick={handleScrollLeft}>
          &larr;
        </button>
        <div className="card-list" ref={cardsRef}>
          {apiData.map((card, index) => {
            return (
              <div
                className="card"
                key={index}
                onClick={() => navigate(`/movie/${card.id}`)}
              >
                <img src={'https://image.tmdb.org/t/p/w500' + card.backdrop_path} alt={card.title} />
                <p className="card-title">{card.original_title}</p>
                <p className="card-description">{truncateDescription(card.overview)}</p>
              </div>
            );
          })}
        </div>
        <button className="scroll-button right" onClick={handleScrollRight}>
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default TitleCards;