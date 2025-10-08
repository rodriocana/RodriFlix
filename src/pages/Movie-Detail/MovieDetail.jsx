import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState(null); // Nuevo estado para el director
  const [trailer, setTrailer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [watchProviders, setWatchProviders] = useState([]);
  const [soundtrack, setSoundtrack] = useState([]);
  const [, setSpotifyToken] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);
  const [isSoundtrackModalOpen, setIsSoundtrackModalOpen] = useState(false);
  const [albumImage, setAlbumImage] = useState(null);

  const type = location.pathname.includes('/movie/') ? 'movie' : 'tv';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2Y2UxMzViZjFiYjU2Y2VlNGE3NjUyYjdkYzRhMDBiMSIsIm5iZiI6MTcwOTcyOTY2NC45ODIsInN1YiI6IjY1ZTg2NzgwY2FhYjZkMDE4NTk2NjcwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lbf4T7hgr1EZ2W2GpHDw16P19eU7Rw0cgg-y_ap8UKU'
    }
  };

  const getSpotifyToken = async () => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa('7b289bf402df4fb9aa7758de8a72ed0b:76f5315b16564653b97e21ef9204158e')}`,
        },
        body: 'grant_type=client_credentials',
      });
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log('Spotify Token:', data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('Error al obtener token de Spotify:', error);
      return null;
    }
  };

  const searchSoundtrack = async (title, originalTitle, year, composer, token) => {
    try {
      if (!token) {
        throw new Error('Token de Spotify no disponible');
      }
      console.log('Token de Spotify utilizado:', token.substring(0, 20) + '...');

      let query = `banda%20sonora%20${encodeURIComponent(title)}`;
      console.log('Query de Spotify (título en español prioritario):', query);
      
      let response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=album&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText} - ${errorText}`);
      }
      
      let data = await response.json();
      console.log('Resultados de Spotify (álbumes, español):', data);
      console.log('Álbumes devueltos (español):', data.albums.items.map(album => ({ name: album.name, artists: album.artists.map(a => a.name), release_date: album.release_date })));
      
      let targetAlbum = data.albums.items.find(album => 
        album.name.toLowerCase().includes(title.toLowerCase()) &&
        (composer ? album.artists.some(artist => artist.name.toLowerCase().includes(composer.toLowerCase())) : true)
      );
      
      if (!targetAlbum) {
        query = `banda%20sonora%20original%20${encodeURIComponent(title)}`;
        console.log('Query de respaldo (español con "original"): ', query);
        response = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=album&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText} - ${errorText}`);
        }
        data = await response.json();
        console.log('Resultados de Spotify (álbumes, español original):', data);
        console.log('Álbumes devueltos (español original):', data.albums.items.map(album => ({ name: album.name, artists: album.artists.map(a => a.name), release_date: album.release_date })));
        targetAlbum = data.albums.items.find(album => 
          album.name.toLowerCase().includes(title.toLowerCase()) &&
          (composer ? album.artists.some(artist => artist.name.toLowerCase().includes(composer.toLowerCase())) : true)
        );
      }
      
      if (!targetAlbum && originalTitle && originalTitle !== title) {
        query = `soundtrack%20${encodeURIComponent(originalTitle)}`;
        console.log('Query de respaldo (título original en inglés):', query);
        response = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=album&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText} - ${errorText}`);
        }
        data = await response.json();
        console.log('Resultados de Spotify (álbumes, inglés):', data);
        console.log('Álbumes devueltos (inglés):', data.albums.items.map(album => ({ name: album.name, artists: album.artists.map(a => a.name), release_date: album.release_date })));
        targetAlbum = data.albums.items.find(album => 
          album.name.toLowerCase().includes(originalTitle.toLowerCase()) &&
          (composer ? album.artists.some(artist => artist.name.toLowerCase().includes(composer.toLowerCase())) : true)
        );
      }
      
      if (!targetAlbum) {
        query = `banda%20sonora%20${encodeURIComponent(title)}%20${year}${composer ? `%20artist:${encodeURIComponent(composer)}` : ''}`;
        console.log('Query de respaldo (español con año):', query);
        response = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=album&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText} - ${errorText}`);
        }
        data = await response.json();
        console.log('Resultados de Spotify (álbumes, español con año):', data);
        console.log('Álbumes devueltos (español con año):', data.albums.items.map(album => ({ name: album.name, artists: album.artists.map(a => a.name), release_date: album.release_date })));
        targetAlbum = data.albums.items.find(album => 
          album.name.toLowerCase().includes(title.toLowerCase()) &&
          (composer ? album.artists.some(artist => artist.name.toLowerCase().includes(composer.toLowerCase())) : true)
        );
      }
      
      if (!targetAlbum) {
        console.log('No se encontró el álbum correcto para:', title, 'o', originalTitle);
        setSoundtrack([]);
        setAlbumImage(null);
        return;
      }
      
      console.log('Álbum seleccionado:', targetAlbum.name);
      
      const albumImageUrl = targetAlbum.images && targetAlbum.images.length > 0 ? targetAlbum.images[0].url : null;
      setAlbumImage(albumImageUrl);
      
      const tracksResponse = await fetch(
        `https://api.spotify.com/v1/albums/${targetAlbum.id}/tracks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (!tracksResponse.ok) {
        const errorText = await tracksResponse.text();
        throw new Error(`Error HTTP al obtener pistas: ${tracksResponse.status} - ${tracksResponse.statusText} - ${errorText}`);
      }
      
      const tracksData = await tracksResponse.json();
      const tracks = tracksData.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || 'Desconocido',
        previewUrl: track.preview_url || 'No disponible',
        album: targetAlbum.name,
      }));
      
      console.log('Tracks filtradas:', tracks);
      setSoundtrack(tracks);
    } catch (error) {
      console.error('Error al buscar soundtrack:', error);
      setSoundtrack([]);
      setAlbumImage(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?language=es-ES`, options);
        if (!response.ok) throw new Error('Error al obtener los detalles');
        const data = await response.json();
        if (isMounted) {
          console.log('Datos de la película/serie:', data);
          setItem(data);

          const creditsResponse = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?language=es-ES`, options);
          if (!creditsResponse.ok) throw new Error('Error al obtener los créditos');
          const creditsData = await creditsResponse.json();
          const composer = creditsData.crew.find(member => member.job === 'Original Music Composer')?.name || '';
          const director = creditsData.crew.find(member => member.job === 'Director');
          console.log('Compositor encontrado:', composer);
          console.log('Director encontrado:', director);

          setCast(creditsData.cast.slice(0, 6));
          setDirector(director ? {
            id: director.id,
            name: director.name,
            profile_path: director.profile_path
          } : null);

          const token = await getSpotifyToken();
          if (token && isMounted) {
            setSpotifyToken(token);
            const title = type === 'movie' ? data.title : data.name;
            const originalTitle = data.original_title || title;
            const year = data.release_date?.substring(0, 4) || data.first_air_date?.substring(0, 4) || '';
            console.log('Buscando soundtrack para:', title, 'Título original:', originalTitle, 'Año:', year, 'Compositor:', composer);
            await searchSoundtrack(title, originalTitle, year, composer, token);
          }
        }
      } catch (err) {
        console.error('Error en fetchData:', err);
      }
    };

    fetchData();

    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`, options)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener el trailer');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          const trailerVideo = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
          setTrailer(trailerVideo);
        }
      })
      .catch(err => console.error(err));

    fetch(`https://api.themoviedb.org/3/${type}/${id}/watch/providers`, options)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener las plataformas');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          const providers = data.results?.ES || {};
          setWatchProviders(providers.flatrate || []);
        }
      })
      .catch(err => console.error(err));

    return () => {
      isMounted = false;
    };
  }, [id, type]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setCurrentTrack(null);
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openSoundtrackModal = () => setIsSoundtrackModalOpen(true);
  const closeSoundtrackModal = () => setIsSoundtrackModalOpen(false);

  const handleActorClick = (actorId) => {
    navigate(`/person/${actorId}`);
  };

  const handleDirectorClick = (directorId) => {
    navigate(`/person/${directorId}`);
  };

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      audioRef.current.pause();
      setCurrentTrack(null);
    } else {
      audioRef.current.src = track.previewUrl;
      audioRef.current.play();
      setCurrentTrack(track);
    }
  };

  if (!item) return <div>Cargando...</div>;

  const title = type === 'movie' ? item.title : item.name;
  const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
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
            ← Volver
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
              <button className="soundtrack-btn" onClick={openSoundtrackModal}>
                🎵 Banda Sonora
              </button>
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
            {watchProviders.length > 0 && (
              <div className="watch-providers">
                <h3>Disponible en:</h3>
                <div className="provider-list">
                  {watchProviders.map(provider => (
                    <div key={provider.provider_id} className="provider-item">
                      <img
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        alt={provider.provider_name}
                        title={provider.provider_name}
                        className="provider-logo"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {watchProviders.length === 0 && (
              <p>No hay plataformas de streaming disponibles para esta región.</p>
            )}
          </div>
        </div>
      </div>
      <div className="cast-section">
        <h2>Reparto</h2>
        <div className="cast-and-director-container">
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
          {director && (
            <div className="director-card">
             
              <img
                src={
                  director.profile_path
                    ? `https://image.tmdb.org/t/p/w200${director.profile_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Image'
                }
                alt={director.name}
                className="director-img"
                onClick={() => handleDirectorClick(director.id)}
                style={{ cursor: 'pointer' }}
              />
              <p>{director.name}</p>
               <h4>Director</h4>
            </div>
          )}
        </div>
      </div>
      {trailer && isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeModal}>
              ×
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
      {isSoundtrackModalOpen && (
        <div className="modal">
          <div className="modal-content-soundtrack soundtrack-modal-content">
            <button className="modal-close-btn" onClick={closeSoundtrackModal}>
              ×
            </button>
            <h2 style={{ marginBottom: '10px' }}>🎵 Banda Sonora Original</h2>
            {soundtrack.length > 0 ? (
              <div className="soundtrack-container">
                {albumImage && (
                  <div className="album-image-container">
                    <img
                      src={albumImage}
                      alt="Álbum de la banda sonora"
                      className="album-image"
                    />
                  </div>
                )}
                <div className="soundtrack-list">
                  {soundtrack.map((track) => (
                    <div key={track.id} className="track-item">
                      <div className="track-info">
                        <strong>{track.name}</strong>
                        <p>por {track.artist} (Álbum: {track.album})</p>
                      </div>
                      {track.previewUrl !== 'No disponible' ? (
                        <button
                          className={`play-btn ${currentTrack?.id === track.id ? 'playing' : ''}`}
                          onClick={() => playTrack(track)}
                        >
                          {currentTrack?.id === track.id ? '⏸️ Pausar' : '▶️ Reproducir (30s)'}
                        </button>
                      ) : (
                        <a
                          href={`https://open.spotify.com/track/${track.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="spotify-link"
                        >
                          Escuchar en Spotify
                        </a>
                      )}
                    </div>
                  ))}
                  <audio ref={audioRef} preload="auto" />
                </div>
              </div>
            ) : (
              <p>No se encontraron pistas para "{title}".</p>
            )}
          </div>
        </div>
      )}
      <button className="btn-volver-inicio" onClick={() => navigate('/')}>
        Volver a inicio
      </button>
    </div>
  );
};

export default MovieDetail;