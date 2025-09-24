import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import MovieDetail from './pages/Movie-Detail/MovieDetail.jsx';
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  './spinner.css';
import netflixLogo from './assets/netflix_spinner.gif';

const App = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const minLoadingTime = 2000; // 2 seconds minimum loading time
    const startTime = Date.now();

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        // Calculate remaining time to ensure minimum 2s loading
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        setTimeout(() => {
          setLoading(false);
          if (currentUser) {
            console.log("User is signed in:", currentUser);
            navigate('/');
          } else {
            console.log("Logged out");
            navigate('/login');
          }
        }, remainingTime);
      },
      (error) => {
        console.error("Error checking auth state:", error);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setLoading(false);
          navigate('/login');
        }, remainingTime);
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
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/movie/:id" element={user ? <MovieDetail /> : <Login />} />
      </Routes>
    </div>
  );
};

export default App;