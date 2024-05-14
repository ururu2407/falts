import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.scss';
import { LogoIcon, SearchIcon, WriteIcon, SaveIcon, NotificationsIcon } from '../../icons';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import { BackdropLogin } from '../Login-Register/Login';
import { BackdropRegistertion } from '../Login-Register/Registration';

export const Header = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    handleSearch(event.target.value);
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  const handleLoginModalOpen = () => {
    setLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };
  const handleRegistrationModalOpen = () => {
    setRegistrationModalOpen(true);
  };

  const handleRegistrationModalClose = () => {
    setRegistrationModalOpen(false);
  };
  const haveNoAccount = () => {
    setLoginModalOpen(false);
    setRegistrationModalOpen(true);
  }
  const haveAccount = () => {
    setRegistrationModalOpen(false);
    setLoginModalOpen(true);
  }
  return (
    <header>
      <nav className='nav-left'>
        <Link to={'/falts/home'} style={{ textDecoration: 'none', height: '24px' }}>
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
      {user ? (
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
          <li>
            <Avatar onClick={handleOpenUserMenu} src={user?.image} />
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <div className='user-menu'>
                <p onClick={handleCloseUserMenu}>{user?.fullName}</p>
                <p onClick={handleCloseUserMenu}>Moї Пости</p>
                <p onClick={logout}>Вийти</p>
              </div>
            </Menu>
          </li>
        </nav>
      ) : (
        <nav className='nav-right-unlogged'>
          <li>Про нас</li>
          <li>Контакти</li>
          <li onClick={handleLoginModalOpen}>Увійти</li>
          <li className='btn' onClick={handleRegistrationModalOpen}>Зареєструватись</li>
        </nav>
      )}
      <BackdropLogin open={loginModalOpen}
        onClick={handleLoginModalClose}
        account={haveNoAccount} 
        onClose={handleLoginModalClose}/>
      <BackdropRegistertion open={registrationModalOpen}
        onClick={handleRegistrationModalClose}
        account={haveAccount} 
        onClose={handleRegistrationModalClose}/>
    </header>
  );
};
