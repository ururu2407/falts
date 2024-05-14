import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BackdropLogin } from '../../components/Login-Register/Login';
import { BackdropRegistertion } from '../../components/Login-Register/Registration';
import { LogoIcon, VectorIcon, DawnIcon, ArrowRightIcon } from '../../icons';
import './FirstVisit.scss';
import axios from 'axios';
import { FirstVisitPost } from '../../components/Post/Post';
export const FirstVisit = () => {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);

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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, usersResponse] = await Promise.all([
                    axios.get('https://04cb5470549a62ec.mokky.dev/posts'),
                    axios.get('https://04cb5470549a62ec.mokky.dev/users'),
                    axios.get('https://04cb5470549a62ec.mokky.dev/tags')
                ]);
                setUsers(usersResponse.data);
                setData(postsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    return (
        <div className='first-visit'>
            <div className='left-block'>
                <div className='header'>
                    <nav className='nav-left'>
                        <Link to={'/falts/home'} style={{ textDecoration: 'none', height: '24px' }}>
                            <LogoIcon />
                        </Link>
                    </nav>
                    <nav className='nav-right'>
                        <li>Про нас</li>
                        <li>Контакти</li>
                        <li onClick={handleLoginModalOpen}>Увійти</li>
                        <li className='btn' onClick={handleRegistrationModalOpen}>Зареєструватись</li>
                    </nav>
                </div>
                <div className='body'>
                    <div className='title'>
                        <p>Думки, натхнення і місце, де починаються історії</p>
                        <div className='group'>
                            <div className='icon'>
                                <VectorIcon />
                            </div>
                            <p>Читай</p>
                            <p>Досліджуй нове</p>
                        </div>
                    </div>
                    <div className='text'>
                        <div className='icon'>
                            <DawnIcon />
                        </div>
                        <p>
                            Мрієте про власний блог? Тоді вам до нас! Найкраща платформа для блогів, яка допоможе вам створити та розвинути свій власний унікальний контент.
                        </p>
                    </div>
                    <Link to={'/falts/home'}>
                        <div className='btn'>
                            <p>Почати читати</p>
                            <ArrowRightIcon />

                        </div>
                    </Link>
                    <div className='top-5'>
                        <ul>
                            <div className="divider" />
                            <li>
                                <p>Розвиток Український Стартапів</p>
                                <p>01</p>
                            </li>
                            <div className="divider" />
                            <li>
                                <p>Бізнес. Заробіток. Криптовалюта</p>
                                <p>02</p>
                            </li>
                            <div className="divider" />
                            <li>
                                <p>Програмування та ШІ</p>
                                <p>03</p>
                            </li>
                            <div className="divider" />
                            <li>
                                <p>Війна в Україні</p>
                                <p>04</p>
                            </li>
                            <div className="divider" />
                            <li>
                                <p>Життя та Здоров’я</p>
                                <p>05</p>
                            </li>
                            <div className="divider" />
                        </ul>
                    </div>
                </div>
            </div>
            <div className='right-block'>
                <div className="background">
                    <div className="posts">
                        <div className='column first'>
                            {data.slice(0, 5).map((post, index) => (
                                <div key={post.id}>
                                    <FirstVisitPost
                                        user={users.find(user => user.id === post.user_id)}
                                        title={post.title}
                                        date={post.date}
                                        text={post.text}
                                        id={post.id}
                                        tags={post.tags}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='column second'>
                            {data.slice(5, 10).map((post, index) => (
                                <div key={post.id}>
                                    <FirstVisitPost
                                        user={users.find(user => user.id === post.user_id)}
                                        title={post.title}
                                        date={post.date}
                                        text={post.text}
                                        id={post.id}
                                        tags={post.tags}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='column third'>
                            {data.slice(10, 15).map((post, index) => (
                                <div key={post.id}>
                                    <FirstVisitPost
                                        user={users.find(user => user.id === post.user_id)}
                                        title={post.title}
                                        date={post.date}
                                        text={post.text}
                                        id={post.id}
                                        tags={post.tags}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <BackdropLogin open={loginModalOpen}
                onClick={handleLoginModalClose}
                account={haveNoAccount}
                onClose={handleLoginModalClose} />
            <BackdropRegistertion open={registrationModalOpen}
                onClick={handleRegistrationModalClose}
                account={haveAccount}
                onClose={handleRegistrationModalClose} />
        </div>
    )
}
