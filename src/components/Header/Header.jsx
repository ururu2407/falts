import React from 'react'
import { Link } from 'react-router-dom'
import './header.scss'
import { LogoIcon, SearchIcon, WriteIcon, SaveIcon, NotificationsIcon } from '../../icons'

export const Header = () => {
  return (
    <header>
      <nav className='nav-left'>
        <Link to={'/'} style={{ textDecoration: 'none', height: '24px' }}>
          <LogoIcon />
        </Link>
        <div className='search'>
          <SearchIcon />
          <input type="text" placeholder='Пошук...' />
        </div>
      </nav>
      <Link to={'/login'}>Login</Link>
      <Link to={'/registration'}>Registration</Link>
      <nav className='nav-right'>
        <li>
          <WriteIcon />
          <p>Писати</p>
        </li>
        <li>
          <SaveIcon />
        </li>
        <li>
          <NotificationsIcon />
        </li>
      </nav>
    </header>
  )
}