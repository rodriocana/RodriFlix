import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import MovieDetail from './pages/Movie-Detail/MovieDetail.jsx';
import MovieDetailActor from './pages/Movie-Detail-Actor/Movie-Detail-Actor.jsx';
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './spinner.css';
import netflixLogo from './assets/netflix_spinner.gif';

const App = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        if (currentUser) {
          console.log("User is signed in:", currentUser);
        } else {
          console.log("Logged out");
          navigate('/login', { replace: true });
        }
      },
      (error) => {
        console.error("Error checking auth state:", error);
        setLoading(false);
        navigate('/login', { replace: true });
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">
          <div className="spinner-ring"></div>
          <img src={netflixLogo} alt="Netflix Logo" className="spinner-logo" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
  <Route path="/login" element={<Login />} />

  {/* Home con películas */}
  <Route path="/" element={user ? <Home type="movie" /> : <Login />} />

  {/* Home con series */}
  <Route path="/tv" element={user ? <Home type="tv" /> : <Login />} />

  {/* Detalle de película */}
  <Route path="/movie/:id" element={user ? <MovieDetail /> : <Login />} />

  {/* Detalle de serie */}
  <Route path="/tv/:id" element={user ? <MovieDetail /> : <Login />} />

  {/* Detalle de actor */}
  <Route path="/person/:id" element={user ? <MovieDetailActor /> : <Login />} />
</Routes>
    </div>
  );
};

export default App;