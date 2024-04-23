import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Post, PopularPost } from '../../components/Post/Post';
import { PlusIcon } from '../../icons';
import './home.scss';
export const Home = () => {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://04cb5470549a62ec.mokky.dev/posts');
                const users = await axios.get('https://04cb5470549a62ec.mokky.dev/users');
                setUsers(users.data);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className='sidebar'>
                <nav className='filter-posts'>
                    <li className='active'>Моя Стрічка</li>
                    <li>Слідкую</li>
                    <li>Популярне</li>
                    <li>Нове</li>
                </nav>
                <div className='divider'></div>
                <nav className='my-tags'>
                    <li className='addTag'><PlusIcon/></li>
                    <li>Design</li>
                    <li>Web Development</li>
                    <li>Штучний інтелект</li>
                </nav>
            </div>
            <div className='main'>
                {/* <div>
                <Link to='/write' style={{ textDecoration: "none" }}>
                    Create Post
                </Link>
            </div> */}
                <div className='home-content'>
                    <div className='posts'>
                        {data.map((post, index) => (
                            <React.Fragment key={post.id}>
                                <div>
                                    <Post
                                        user={users.find(user => user.id === post.user_id)}
                                        title={post.title}
                                        date={post.date}
                                        text={post.text}
                                        image={post.image}
                                        id={post.id} />
                                    {/* Отображаем кнопку "Изменить" только если текущий пользователь создал этот пост */}
                                    {currentUser && currentUser.id === post.user_id && (
                                        <Link to={`/falts/write/${post.id}`} style={{ textDecoration: "none" }}>
                                            <button>Edit</button>
                                        </Link>
                                    )}
                                </div>
                                {index !== data.length - 1 && <div className='divider'></div>}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className='popular-posts'>
                        <p className='title-posts'>Популярне сьогодні</p>
                        {data.map((post, index) => (
                            <React.Fragment key={post.id}>
                                <div>
                                    <PopularPost
                                        user={users.find(user => user.id === post.user_id)}
                                        title={post.title}
                                        date={post.date}
                                        id={post.id} />
                                </div>
                                {index !== data.length - 1 && <div className='divider'></div>}
                            </React.Fragment>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}
