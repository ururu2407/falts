import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.scss';
import { LogoIcon, SearchIcon, WriteIcon, SaveIcon, NotificationsIcon } from '../../icons';

export const Header = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    handleSearch(event.target.value);
  };

  return (
    <header>
      <nav className='nav-left'>
        <Link to={'/falts/'} style={{ textDecoration: 'none', height: '24px' }}>
          <LogoIcon />
        </Link>
        <div className='search'>
          <SearchIcon />
          <input
            type="text"
            placeholder='Пошук...'
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
      </nav>
      <Link to={'/falts/login'}>Login</Link>
      <Link to={'/falts/registration'}>Registration</Link>
      <nav className='nav-right'>
        <Link to={'/falts/write'}>
          <li>
            <WriteIcon />
            <p>Писати</p>
          </li>
        </Link>
        <li>
          <SaveIcon />
        </li>
        <li>
          <NotificationsIcon />
        </li>
      </nav>
    </header>
  );
};
