import React, {useState} from 'react'
import './Login.css'
import logo from '../../assets/logo.png'

const Login = () => {


  const[signState, setSignState] = useState('Iniciar sesion')


  return (
    <div className='login'>
      <img src={logo} alt="" className='login-logo' />
      <div className="login-form">
        <h1>{signState}</h1>
        <form>
          {signState === 'Registrarse' ?
             <input type="text"  placeholder='Your name' />:<></>}
          <input type="email" placeholder='email' />
          <input type="password" placeholder='password' />
          <button>{signState}</button>
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
          {signState === 'Inicia sesion' ?
        <p>Nuevo en netflix? <span onClick={()=> setSignState('Registrarse')}>Registrate ahora</span></p> : <p>Ya tienes cuenta? <span onClick={()=> setSignState('Inicia sesion')}>Inicia sesión</span></p>  }
          
        </div>
      </div>
      
    </div>
  )
}


export default Login
