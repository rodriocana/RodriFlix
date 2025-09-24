import React, { useEffect, useState } from 'react' 
import './Home.css'
import NavBar from '../../components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import play_icon from '../../assets/Play_icon.png'
import info_icon from '../../assets/info_icon.png'
import TitleCards from '../../components/TitleCards/TitleCards.jsx'
import { useNavigate } from 'react-router-dom';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2UxMzViZjFiYjU2Y2VlNGE3NjUyYjdkYzRhMDBiMSIsIm5iZiI6MTcwOTcyOTY2NC45ODIsInN1YiI6IjY1ZTg2NzgwY2FhYjZkMDE4NTk2NjcwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lbf4T7hgr1EZ2W2GpHDw16P19eU7Rw0cgg-y_ap8UKU'
  }
};

const Home = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch now playing movies for hero section
    fetch(`https://api.themoviedb.org/3/movie/now_playing?language=es-ES&page=1`, options)
      .then(res => res.json())
      .then(res => {
        const movies = res.results.slice(0, 5); // Get first 5 movies for rotation
        setHeroMovies(movies);
        if (movies.length > 0) {
          // Set initial movie
          const initialMovie = movies[0];
          setHeroTitle(initialMovie.title);
          setHeroDescription(initialMovie.overview);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (heroMovies.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroMovies.length);
        setIsFading(false);
      }, 500); // Match CSS transition duration
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [heroMovies]);

  useEffect(() => {
    if (heroMovies.length === 0) return;

    // Update title and description when index changes
    const currentMovie = heroMovies[currentHeroIndex];
    setHeroTitle(currentMovie.title);
    setHeroDescription(currentMovie.overview);
  }, [currentHeroIndex, heroMovies]);

  const truncateDescription = (text) => {
    if (text.length > 150) {
      return text.substring(0, 150) + '...';
    }
    return text;
  };

  if (heroMovies.length === 0) {
    return (
      <div className='home'>
        <NavBar />
        <div className="hero">
          <div className="banner-img" style={{background: 'linear-gradient(45deg, #141414, #e50914)'}} />
          <div className="hero-caption">
            <div className='caption-img' style={{width: '90%', maxWidth: '420px', height: '80px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>Cargando...</div>
            <p>Cargando películas en cartelera...</p>
            <div className="hero-btns">
              <button className='btn'><img src={play_icon} alt="" />Player</button>
              <button className='btn dark-btn'><img src={info_icon} alt="" />More Info</button>
            </div>
          </div>
        </div>
        <div className="more-cards">
          <TitleCards title={"En cartelera"} category={"now_playing"}  />
          <TitleCards  title={"Próximamente"} category={"upcoming"}/>
          <TitleCards title={"Top 250"} category={"top_rated"}  />
        </div>
        <Footer />
      </div>
    );
  }

  const currentMovie = heroMovies[currentHeroIndex];
  const backdropUrl = `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`;

  return (
    <div className='home'>
      <NavBar />
      <div className="hero">
        <img 
          src={backdropUrl} 
          alt={currentMovie.title} 
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
            <button className='btn' onClick={() => {/* Navigate to play */}}>
              <img src={play_icon} alt="" />Reproducir
            </button>
            <button className='btn dark-btn' onClick={() => navigate(`/movie/${currentMovie.id}`)}>
              <img src={info_icon} alt="" />Más información
            </button>
          </div>
        </div>
      </div>
      <div className="more-cards">
        <TitleCards title={"En cartelera"} category={"now_playing"}  />
        <TitleCards  title={"Próximamente"} category={"upcoming"}/>
        <TitleCards title={"Top 250"} category={"top_rated"}  />
      </div>
      <Footer />
    </div>
  )
}

export default Home