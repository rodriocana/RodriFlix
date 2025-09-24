import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search_icon.svg';
import bell_icon from '../../assets/bell_icon.svg';
import profile_img from '../../assets/profile_img.png';
import caret_icon from '../../assets/caret_icon.svg';
import { logout } from '../../firebase.js';
import axios from 'axios';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Inicio");


  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2UxMzViZjFiYjU2Y2VlNGE3NjUyYjdkYzRhMDBiMSIsIm5iZiI6MTcwOTcyOTY2NC45ODIsInN1YiI6IjY1ZTg2NzgwY2FhYjZkMDE4NTk2NjcwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lbf4T7hgr1EZ2W2GpHDw16P19eU7Rw0cgg-y_ap8UKU'
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (query.length > 2) {
        console.log('Searching for:', query);
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
            options
          );
          console.log('API response:', response.data.results);
          setSearchResults(response.data.results || []);
        } catch (error) {
          console.error('Error fetching movies:', error.message, error.response?.data);
          setSearchResults([]);
        }
      } else {
        console.log('Query too short, clearing results');
        setSearchResults([]);
      }
    };
    searchMovies();
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        console.log('Clicked outside search container');
        setIsSearchOpen(false);
        setQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setQuery('');
      setSearchResults([]);
      // Set focus on the input when opening the search
      setTimeout(() => {
        if (searchRef.current) {
          const input = searchRef.current.querySelector('input');
          if (input) input.focus();
        }
      }, 0);
    }
  };

  const handleMovieSelect = (movieId) => {
    console.log(`Navigating to /movie/${movieId}`);
    navigate(`/movie/${movieId}`);
    setIsSearchOpen(false);
    setQuery('');
    setSearchResults([]);
  };

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <img src={logo} alt="Logo" onClick={() => navigate("/")}/>
    <ul>
  <li
    className={activeTab === "Inicio" ? "active" : ""}
    onClick={() => {
      navigate("/");
      setActiveTab("Inicio");
    }}
  >
    Inicio
  </li>
  <li
    className={activeTab === "Series" ? "active" : ""}
    onClick={() => {
      navigate("/tv");
      setActiveTab("Series");
    }}
  >
    Series
  </li>
  <li
    className={activeTab === "Películas" ? "active" : ""}
    onClick={() => {
      navigate("/");
      setActiveTab("Películas");
    }}
  >
    Películas
  </li>
  <li
    className={activeTab === "Popular" ? "active" : ""}
    onClick={() => setActiveTab("Popular")}
  >
    Popular
  </li>
  <li
    className={activeTab === "Mi lista" ? "active" : ""}
    onClick={() => setActiveTab("Mi lista")}
  >
    Mi lista
  </li>
  <li
    className={activeTab === "Buscar por lenguaje" ? "active" : ""}
    onClick={() => setActiveTab("Buscar por lenguaje")}
  >
    Buscar por lenguaje
  </li>
</ul>
      </div>
      <div className="navbar-right">
        <div className="search-container" ref={searchRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              console.log('Query changed:', e.target.value);
              setQuery(e.target.value);
            }}
            placeholder="Buscar películas..."
            className={`search-input ${isSearchOpen ? 'open' : ''}`}
            autoFocus={isSearchOpen}
          />
          <img
            src={search_icon}
            alt="Search"
            className="icons search-icon"
            onClick={toggleSearch}
          />
          {isSearchOpen && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="search-result-item"
                  onClick={() => handleMovieSelect(movie.id)}
                >
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="search-result-poster"
                    />
                  )}
                  <span>{movie.title} ({movie.release_date?.split('-')[0] || 'N/A'})</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <p>Children</p>
        <img src={bell_icon} alt="Notifications" className="icons" />
        <div className="navbar-profile">
          <img src={profile_img} alt="Profile" className="profile" />
          <img src={caret_icon} alt="Dropdown" />
          <div className="dropdown">
            <span onClick={logout}>Cerrar sesión de Netflix</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;