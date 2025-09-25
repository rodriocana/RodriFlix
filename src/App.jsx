import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
  const location = useLocation();
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

  // Animation for left-to-right (used for non-home routes)
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -40,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: 40,
    },
  };

  // Animation for fade from back to front (used for home route)


  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 1,
  };

    const pageTransitionInicio = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 1.2,
  };

   const pageVariantsInicio = {
    initial: {
      opacity: 0,
      scale: 0.9, // Slightly scaled down to simulate coming from "back"
    },
    in: {
      opacity: 1,
      scale: 1, // Scales to normal size
    },
    out: {
      opacity: 0,
      scale: 1.2, // Slightly scales up to simulate moving "back"
    },
  };

  const pageVariantsLogin = {
  initial: {
    opacity: 0,
    scale: 0.9,       // empieza más pequeño
    zIndex: -1         // opcional: efecto de “atrás”
  },
  in: {
    opacity: 1,
    scale: 1,
    zIndex: 0,
  },
  out: {
    opacity: 0,
    scale: 0.9,
    zIndex: -1
  }
};

  const pageTransitionLogin = {
  type: "tween",       // o "spring" para rebote
  ease: "easeOut",
  duration: 1.5
};

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
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
         <Route
          path="/login"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariantsLogin}
              transition={pageTransitionLogin}
            >
              <Login />
            </motion.div>
          }
        />
          <Route
            path="/"
            element={
              user ? (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariantsInicio} // Use fade animation for home route
                  transition={pageTransitionInicio}
                >
                  <Home type="movie" />
                </motion.div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="in"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Login />
                </motion.div>
              )
            }
          />
          <Route
            path="/tv"
            element={
              user ? (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Home type="tv" />
                </motion.div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Login />
                </motion.div>
              )
            }
          />
          <Route
            path="/movie/:id"
            element={
              user ? (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MovieDetail />
                </motion.div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Login />
                </motion.div>
              )
            }
          />
          <Route
            path="/tv/:id"
            element={
              user ? (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MovieDetail />
                </motion.div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Login />
                </motion.div>
              )
            }
          />
          <Route
            path="/person/:id"
            element={
              user ? (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MovieDetailActor />
                </motion.div>
              ) : (
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Login />
                </motion.div>
              )
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;