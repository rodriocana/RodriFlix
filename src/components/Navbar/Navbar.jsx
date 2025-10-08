import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Añade useLocation
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


  // Actualiza activeTab según la ruta actual
  useEffect(() => {
  if (location.pathname === '/') {
    setActiveTab('Inicio');
  } else if (location.pathname === '/tv') {
    setActiveTab('Series');
  } else if (location.pathname.startsWith('/movie')) {
    setActiveTab('Películas');
  } else if (location.pathname === '/videojuegos') {
    setActiveTab('Videojuegos');
  }
}, [location.pathname]);

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
    const searchContent = async () => {
      if (query.length > 2) {
        console.log('Searching for:', query);
        try {
          // Determinar el tipo de búsqueda según la pestaña activa
          const searchType = activeTab === "Series" ? "tv" : "movie";
          const response = await axios.get(
            `https://api.themoviedb.org/3/search/${searchType}?query=${encodeURIComponent(query)}&language=es-ES`,
            options
          );
          console.log('API response:', response.data.results);
          setSearchResults(response.data.results || []);
        } catch (error) {
          console.error('Error fetching content:', error.message, error.response?.data);
          setSearchResults([]);
        }
      } else {
        console.log('Query too short, clearing results');
        setSearchResults([]);
      }
    };
    searchContent();
  }, [query, activeTab]); // Añadir activeTab como dependencia

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
      setTimeout(() => {
        if (searchRef.current) {
          const input = searchRef.current.querySelector('input');
          if (input) input.focus();
        }
      }, 0);
    }
  };

  const handleItemSelect = (itemId, type) => {
    console.log(`Navigating to /${type}/${itemId}`);
    navigate(`/${type}/${itemId}`);
    setIsSearchOpen(false);
    setQuery('');
    setSearchResults([]);
  };

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
       <img 
            src={logo} 
            alt="Logo" 
            onClick={() => {
              navigate("/");
              setActiveTab("Inicio"); // <--- importante
            }} 
          />
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
              navigate("/peliculas");
              setActiveTab("Películas");
            }}
          >
            Películas
          </li>
        <li
          className={activeTab === "Videojuegos" ? "active" : ""}
          onClick={() => {
            navigate("/videojuegos");
            setActiveTab("Videojuegos");
          }}
        >
          Videojuegos
        </li>
          <li
            className={activeTab === "Mi lista" ? "active" : ""}
            onClick={() => setActiveTab("Mi lista")}
          >
            Mi lista
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
            placeholder={activeTab === "Series" ? "Buscar series..." : "Buscar películas..."}
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
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  className="search-result-item"
                  onClick={() => handleItemSelect(item.id, activeTab === "Series" ? "tv" : "movie")}
                >
                  {item.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={item.title || item.name}
                      className="search-result-poster"
                    />
                  )}
                  <span>
                    {item.title || item.name} (
                    {(item.release_date || item.first_air_date)?.split('-')[0] || 'N/A'})
                  </span>
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