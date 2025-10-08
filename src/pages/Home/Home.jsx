import React, { useEffect, useState } from 'react';
import './Home.css';
import NavBar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import play_icon from '../../assets/Play_icon.png';
import info_icon from '../../assets/info_icon.png';
import TitleCards from '../../components/TitleCards/TitleCards.jsx';
import { useNavigate } from 'react-router-dom';

const tmdbOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2UxMzViZjFiYjU2Y2VlNGE3NjUyYjdkYzRhMDBiMSIsIm5iZiI6MTcwOTcyOTY2NC45ODIsInN1YiI6IjY1ZTg2NzgwY2FhYjZkMDE4NTk2NjcwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lbf4T7hgr1EZ2W2GpHDw16P19eU7Rw0cgg-y_ap8UKU'
  }
};

const Home = ({ type = "movie" }) => {
  const [heroItems, setHeroItems] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  // Fetch del slider principal (hero)
  useEffect(() => {
    const fetchHero = async () => {
      try {
        let items = [];

        if (type === "game") {
          const res = await fetch('http://localhost:4000/api/games');
          const data = await res.json();
          items = data.slice(0, 5); // los primeros 5 juegos
        } else {
          const endpoint = type === "movie" ? "now_playing" : "on_the_air";
          const res = await fetch(`https://api.themoviedb.org/3/${type}/${endpoint}?language=es-ES&page=1`, tmdbOptions);
          const data = await res.json();
          items = data.results.slice(0, 5);
        }

        setHeroItems(items);
        setCurrentHeroIndex(0);
        if (items.length > 0) {
          const first = items[0];
          setHeroTitle(first.title || first.name);
          setHeroDescription(first.overview || first.summary || '');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHero();
  }, [type]);

  // Slider automático
  useEffect(() => {
    if (heroItems.length === 0) return;

    let timeoutId;
    const intervalId = setInterval(() => {
      setIsFading(true);
      timeoutId = setTimeout(() => {
        setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroItems.length);
        setIsFading(false);
      }, 500);
    }, 4000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [heroItems]);

  // Actualizar título y descripción del hero
  useEffect(() => {
    if (heroItems.length === 0) return;
    const current = heroItems[currentHeroIndex];
    setHeroTitle(current.title || current.name);
    setHeroDescription(current.overview || current.summary || '');
  }, [currentHeroIndex, heroItems]);

  const truncateDescription = (text, max = 150) => {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + "..." : text;
  };

  if (heroItems.length === 0) {
    return (
      <div className='home'>
        <NavBar />
        <p>Cargando {type === "movie" ? "películas" : type === "tv" ? "series" : "videojuegos"}...</p>
      </div>
    );
  }

  const current = heroItems[currentHeroIndex];
  const backdropUrl =
    type === "game"
      ? current.cover?.url?.replace('t_thumb', 't_original') || '/no-image.jpg'
      : `https://image.tmdb.org/t/p/original${current.backdrop_path}`;

  return (
    <div className='home'>
      <NavBar />
      <div className="hero">
        <img 
          src={backdropUrl} 
          alt={current.title || current.name} 
          className={`banner-img ${isFading ? 'fade-out' : 'fade-in'}`} 
        />
        <div className="hero-caption">
          <h2 className={`caption-img ${isFading ? 'fade-out' : 'fade-in'}`}>
            {heroTitle}
          </h2>
          <p className={isFading ? 'fade-out' : 'fade-in'}>
            {truncateDescription(heroDescription)}
          </p>
          <div className="hero-btns">
            <button className='btn'>
              <img src={play_icon} alt="" />Reproducir
            </button>
          <button className='btn dark-btn' onClick={() => navigate(`/${type}/${current.id}`)}>
          <img src={info_icon} alt="" />Más información
        </button>
          </div>
        </div>
      </div>

      <div className="more-cards">
        {type === "movie" ? (
          <>
            <TitleCards title={"En cartelera"} category={"now_playing"} type="movie" />
            <TitleCards title={"Próximamente"} category={"upcoming"} type="movie" />
            <TitleCards title={"Top 250"} category={"top_rated"} type="movie" />
              {/* <TitleCards title={"Nuevas en Netflix"} type="movie" watchProviderId="8" />
            <TitleCards title={"Nuevas en HBO Max"} type="movie" watchProviderId="384" />
           <TitleCards title={"Nuevas en Amazon Prime"} type="movie" watchProviderId="7" /> */}
          </>
        ) : type === "tv" ? (
          <>
            <TitleCards title={"Al aire"} category={"on_the_air"} type="tv" />
            <TitleCards title={"Hoy en TV"} category={"airing_today"} type="tv" />
            <TitleCards title={"Top Rated"} category={"top_rated"} type="tv" />
            <TitleCards title={"Popular"} category={"popular"} type="tv" />
          </>
        ) : type === "game" ? (
          <>
            <TitleCards title={"Videojuegos Populares"} category="popular" type="game" />
            <TitleCards title={"Top 100 Juegos"} category="top100" type="game" />
            <TitleCards title={"Juegos Top PS5"} category="ps5" type="game" />
            <TitleCards title={"Juegos Top Xbox"} category="xbox" type="game" />
            <TitleCards title={"Juegos Top Nintendo"} category="nintendo" type="game" />
          </>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default Home;