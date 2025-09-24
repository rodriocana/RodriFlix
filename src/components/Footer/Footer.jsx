import React from 'react'
import './Footer.css'
import youtube_icon from '../../assets/youtube_icon.png'
import instagram_icon from '../../assets/instagram_icon.png'
import twitter_icon from '../../assets/twitter_icon.png'
import facebook_icon from '../../assets/facebook_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-icons">
        <img src={youtube_icon} alt="YouTube" />
        <img src={instagram_icon} alt="Instagram" />
        <img src={twitter_icon} alt="Twitter" />
        <img src={facebook_icon} alt="Facebook" />
      </div>
       <ul>
      <li>Descripción de audio</li>
      <li>Centro de ayuda</li>
      <li>Centro de medios</li>
      <li>Empleos</li>
      <li>Empleos</li>
      <li>Empleos</li>
      <li>Términos de uso</li>
      <li>Avisos legales</li>
      <li>Preferencias de cookies</li>
      <li>Información corporativa</li>
      <li>Contáctanos</li>
       </ul>
       <p className='copyright-text'> ©1997-2025 Netflix, Inc.</p>
      </div>
  )
}

export default Footer
