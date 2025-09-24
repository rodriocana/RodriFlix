import React, { useEffect, useState } from 'react';
import './Home.css';
import NavBar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import play_icon from '../../assets/Play_icon.png';
import info_icon from '../../assets/info_icon.png';
import TitleCards from '../../components/TitleCards/TitleCards.jsx';
import { useNavigate } from 'react-router-dom';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer TU_TOKEN_AQUI'
  }
};

const Home = ({ type = "movie" }) => { // 👈 ahora puede ser "movie" o "tv"
  const [heroItems, setHeroItems] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 👇 si es movie usa now_playing, si es tv usa on_the_air
    const endpoint = type === "movie" ? "now_playing" : "on_the_air";
    fetch(`https://api.themoviedb.org/3/${type}/${endpoint}?language=es-ES&page=1`, options)
      .then(res => res.json())
      .then(res => {
        const items = res.results.slice(0, 5);
        setHeroItems(items);
        if (items.length > 0) {
          const first = items[0];
          setHeroTitle(type === "movie" ? first.title : first.name);
          setHeroDescription(first.overview);
        }
      })
      .catch(err => console.error(err));
  }, [type]);

  useEffect(() => {
    if (heroItems.length === 0) return;
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroItems.length);
        setIsFading(false);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroItems]);

  useEffect(() => {
    if (heroItems.length === 0) return;
    const current = heroItems[currentHeroIndex];
    setHeroTitle(type === "movie" ? current.title : current.name);
    setHeroDescription(current.overview);
  }, [currentHeroIndex, heroItems, type]);

  const truncateDescription = (text) => {
    if (!text) return "";
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };

  if (heroItems.length === 0) {
    return (
      <div className='home'>
        <NavBar />
        <p>Cargando {type === "movie" ? "películas" : "series"}...</p>
      </div>
    );
  }

  const current = heroItems[currentHeroIndex];
  const backdropUrl = `https://image.tmdb.org/t/p/original${current.backdrop_path}`;

  return (
    <div className='home'>
      <NavBar />
      <div className="hero">
        <img 
          src={backdropUrl} 
          alt={type === "movie" ? current.title : current.name} 
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
          </>
        ) : (
          <>
            <TitleCards title={"Al aire"} category={"on_the_air"} type="tv" />
            <TitleCards title={"Hoy en TV"} category={"airing_today"} type="tv" />
            <TitleCards title={"Top Rated"} category={"top_rated"} type="tv" />
            <TitleCards title={"Popular"} category={"popular"} type="tv" />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
