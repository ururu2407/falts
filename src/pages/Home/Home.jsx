import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Post, PopularPost } from '../../components/Post/Post';
import { PlusIcon } from '../../icons';
import './home.scss';
import { Header } from '../../components/Header/Header';
export const Home = () => {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [initialData, setInitialData] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]); // Выбранные теги

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, usersResponse, tagsResponse] = await Promise.all([
                    axios.get('https://04cb5470549a62ec.mokky.dev/posts'),
                    axios.get('https://04cb5470549a62ec.mokky.dev/users'),
                    axios.get('https://04cb5470549a62ec.mokky.dev/tags')
                ]);
                setUsers(usersResponse.data);
                setData(postsResponse.data);
                setInitialData(postsResponse.data);
                setTags(tagsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setData(initialData);
        } else {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`https://04cb5470549a62ec.mokky.dev/posts?title=*${searchTerm}`);
                    setData(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [searchTerm, initialData]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleTagSelect = (tag) => {
        setSelectedTags([...selectedTags, tag]);
    };

    const handleTagClick = (tag) => {
        // Фильтруем статьи по выбранному тегу
        const filteredData = initialData.filter(post => post.tags.some(postTag => postTag.name === tag.name));
        setData(filteredData);
    };

    return (
        <>
            <Header handleSearch={handleSearch} />
            <div className='sidebar'>
                <nav className='filter-posts'>
                    <li className='active'>Моя Стрічка</li>
                    <li>Слідкую</li>
                    <li>Популярне</li>
                    <li>Нове</li>
                </nav>
                <div className='divider'></div>
                <nav className='my-tags'>
                    <li className='addTag'>
                        <PlusIcon />
                        <ul className="tag-dropdown">
                            {tags.map((tag, index) => (
                                <li key={index} onClick={() => handleTagSelect(tag)}>{tag.name}</li>
                            ))}
                        </ul>
                    </li>
                    {/* Отображаем выбранные теги */}
                    {selectedTags.map((tag, index) => (
                        <li key={index} onClick={() => handleTagClick(tag)}>{tag.name}</li>
                    ))}
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
                                        id={post.id}
                                        tags={post.tags} />
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
                                        id={post.id}
                                        tags={post.tags} />
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
