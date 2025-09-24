import React, { useEffect, useState } from 'react';
import './Login.css';
import logo from '../../assets/logo.png';
import { login, signup } from '../../firebase.js';

const Login = () => {
  const [signState, setSignState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Precarga del logo
  useEffect(() => {
    const img = new Image();
    img.src = logo;
  }, []);

  const user_auth = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    try {
      if (signState === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
        setSuccessMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setSignState('login');
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setErrorMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="login">
      <img src={logo} alt="Logo" className="login-logo" width="150" height="45" />
      <div className="login-form">
        <h1>{signState === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={user_auth}>
          {signState === 'signup' && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Tu nombre"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Correo electrónico"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Contraseña"
          />
          <button type="submit">{signState === 'login' ? 'Iniciar sesión' : 'Registrarse'}</button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label>Recuérdame</label>
            </div>
            <div className="need-help">
              <p>¿Necesitas ayuda?</p>
            </div>
          </div>
        </form>
        <div className="form-switch">
          {signState === 'login' ? (
            <p>
              ¿Nuevo en Netflix?{' '}
              <span onClick={() => setSignState('signup')}>Regístrate ahora</span>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <span onClick={() => setSignState('login')}>Inicia sesión</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;