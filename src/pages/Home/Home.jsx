import React, { useState, useEffect, useRef } from 'react';
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
    const [selectedTags, setSelectedTags] = useState([]);
    const [activeTag, setActiveTag] = useState(false);
    const tagsDropdownRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, usersResponse, tagsResponse] = await Promise.all([
                    axios.get('https://04cb5470549a62ec.mokky.dev/posts'),
                    axios.get('https://04cb5470549a62ec.mokky.dev/users'),
                    axios.get('https://04cb5470549a62ec.mokky.dev/tags')
                ]);
                const updatedTags = tagsResponse.data.map((tag) => ({
                    ...tag,
                    selected: localStorage.getItem(`tag_${tag.id}`) === 'true',
                }));
                setUsers(usersResponse.data);
                setData(postsResponse.data);
                setInitialData(postsResponse.data);
                setTags(updatedTags);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleTagToggle = (tagId) => {
        setTags((prevTags) =>
            prevTags.map((tag) =>
                tag.id === tagId ? { ...tag, selected: !tag.selected } : tag
            )
        );
    };

    useEffect(() => {
        setSelectedTags(tags.filter((tag) => tag.selected));
        tags.forEach(tag => localStorage.setItem(`tag_${tag.id}`, tag.selected));
    }, [tags]);

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

    const handleTagClick = (tag) => {
        const filteredData = initialData.filter(post => post.tags.some(postTag => postTag.name === tag.name));
        setData(filteredData);
    };

    const handleActiveTag = () => {
        setActiveTag(!activeTag);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
                setActiveTag(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    function handleActiveFilterPost(event) {
        const navItems = document.querySelectorAll('.filter');
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        event.target.classList.add('active');
    }
    return (
        <>
            <Header handleSearch={handleSearch} />
            <div className='sidebar'>
                <nav className='filter-posts'>
                    <li className='filter active' onClick={handleActiveFilterPost}>Моя Стрічка</li>
                    <li className='filter' onClick={handleActiveFilterPost}>Слідкую</li>
                    <li className='filter' onClick={handleActiveFilterPost}>Популярне</li>
                    <li className='filter' onClick={handleActiveFilterPost}>Нове</li>
                </nav>
                <div className='divider'></div>
                <nav className='my-tags'>
                    <li className='addTag'>
                        <div className='plus' onClick={handleActiveTag}>
                            <PlusIcon />
                        </div>
                        <div ref={tagsDropdownRef} className={`tags-dropdown ${activeTag ? 'active' : ''}`}>
                            <ul className={`tag-dropdown ${activeTag ? 'active' : ''}`}>
                                {tags.map((tag, index) => (
                                    <div key={index} className='tag'>
                                        <input
                                            type="checkbox"
                                            id={tag.id}
                                            checked={tag.selected}
                                            onChange={() => handleTagToggle(tag.id)}
                                        />
                                        <label htmlFor={tag.id}>{tag.name}</label>
                                    </div>
                                ))}
                            </ul>
                            <div className='fade-top'></div>
                            <div className='fade-bot'></div>
                        </div>
                    </li>
                    {selectedTags.map((tag, index) => (
                        <div className='filter-tags' key={index} onClick={() => handleTagClick(tag)}>
                            <li className='filter' onClick={handleActiveFilterPost}>{tag.name}</li>
                        </div>
                    ))}
                </nav>
            </div>
            <div className='main'>
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