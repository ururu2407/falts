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
        // Асинхронна функція для отримання даних
        const fetchData = async () => {
            try {
                // Виконуємо паралельні запити для отримання постів, користувачів та тегів
                const [postsResponse, usersResponse, tagsResponse] = await Promise.all([
                    axios.get('https://04cb5470549a62ec.mokky.dev/posts'),
                    axios.get('https://04cb5470549a62ec.mokky.dev/users'),
                    axios.get('https://04cb5470549a62ec.mokky.dev/tags')
                ]);

                // Оновлюємо теги, додаючи властивість 'selected' на основі значень з localStorage
                const updatedTags = tagsResponse.data.map((tag) => ({
                    ...tag,
                    selected: localStorage.getItem(`tag_${tag.id}`) === 'true',
                }));

                // Оновлюємо стан з отриманими даними
                setUsers(usersResponse.data);        // Зберігаємо користувачів у стані
                setData(postsResponse.data);         // Зберігаємо пости у стані
                setInitialData(postsResponse.data);  // Зберігаємо початкові дані постів у стані
                setTags(updatedTags);                // Зберігаємо оновлені теги у стані
            } catch (error) {
                // Логування помилки у випадку невдалого запиту
                console.error('Error fetching data:', error);
            }
        };

        // Викликаємо функцію для отримання даних
        fetchData();
    }, []); // Залежність масиву порожня, тому useEffect виконується тільки один раз при першому рендері компонента

    // Функція для перемикання стану вибору тегу
    const handleTagToggle = (tagId) => {
        // Оновлюємо стан тегів, перемикаючи значення 'selected' для відповідного тегу
        setTags((prevTags) =>
            prevTags.map((tag) =>
                tag.id === tagId ? { ...tag, selected: !tag.selected } : tag
            )
        );
    };

    useEffect(() => {
        // Оновлюємо стан обраних тегів на основі змінених тегів
        setSelectedTags(tags.filter((tag) => tag.selected));

        // Зберігаємо стан вибору тегів у localStorage
        tags.forEach(tag => localStorage.setItem(`tag_${tag.id}`, tag.selected));
    }, [tags]); // Виконується кожного разу, коли змінюється стан тегів

    useEffect(() => {
        // Якщо пошуковий запит порожній, відновлюємо початкові дані
        if (searchTerm === '') {
            setData(initialData);
        } else {
            // Асинхронна функція для отримання даних на основі пошукового запиту
            const fetchData = async () => {
                try {
                    // Виконуємо запит до API для отримання постів, які містять пошуковий термін у заголовку
                    const response = await axios.get(`https://04cb5470549a62ec.mokky.dev/posts?title=*${searchTerm}`);

                    // Оновлюємо стан даних з отриманими результатами
                    setData(response.data);
                } catch (error) {
                    // Логування помилки у випадку невдалого запиту
                    console.error('Error fetching data:', error);
                }
            };

            // Викликаємо функцію для отримання даних
            fetchData();
        }
    }, [searchTerm, initialData]); // Залежності: виконувати ефект при зміні searchTerm або initialData



    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    // Функція для обробки кліку на тег
    const handleTagClick = (tag) => {
        // Фільтруємо початкові дані постів, щоб знайти ті, що містять обраний тег
        const filteredData = initialData.filter(post => post.tags.some(postTag => postTag.name === tag.name));

        // Оновлюємо стан даних відфільтрованими постами
        setData(filteredData);
    };

    const handlePopularClick = () => {
        setData(initialData);
    }

    const handleNewClick = () => {
        const newData = [...initialData].sort((a, b) => new Date(b.date) - new Date(a.date));
        setData(newData);
    }

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

    // Функція handleActiveFilterPost обробляє подію натискання на елементи навігації фільтрів
    function handleActiveFilterPost(event) {
        // Знаходимо всі елементи з класом 'filter'
        const navItems = document.querySelectorAll('.filter');

        // Видаляємо клас 'active' з усіх елементів навігації
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Додаємо клас 'active' до натиснутого елемента
        event.target.classList.add('active');
    }
    return (
        <>
            <Header handleSearch={handleSearch} />
            <div className='sidebar'>
                {/* Відображаємо навігаційне меню з фільтрами */}
                <nav className='filter-posts'>
                    {/* Створюємо елементи списку, кожен з яких є фільтром */}
                    <div onClick={handlePopularClick}>
                        <li className='filter active' onClick={handleActiveFilterPost} >Моя Стрічка</li>
                    </div>
                    <div onClick={handlePopularClick}>
                        <li className='filter' onClick={handleActiveFilterPost}>Слідкую</li>
                    </div>
                    <div onClick={handlePopularClick}>
                        <li className='filter' onClick={handleActiveFilterPost}>Популярне</li>
                    </div>
                    <div onClick={handleNewClick}>
                        <li className='filter' onClick={handleActiveFilterPost}>Нове</li>
                    </div>
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
                        {/* Використовуємо метод map для перебору масиву data та відображення кожного поста */}
                        {initialData.slice(0, 3).map((post, index) => (
                            /* Використовуємо React.Fragment для обгортки кожного поста та уникнення зайвих div */
                            <React.Fragment key={post.id}>
                                <div>
                                    {/* Відображаємо компонент PopularPost з передачею необхідних пропсів */}
                                    <PopularPost
                                        user={users.find(user => user.id === post.user_id)}  // Знаходимо користувача за його id
                                        title={post.title}  // Передаємо заголовок поста
                                        date={post.date}  // Передаємо дату поста
                                        id={post.id}  // Передаємо id поста
                                        tags={post.tags}  // Передаємо теги поста
                                    />
                                </div>
                                {/* Відображаємо розділювач між постами, окрім останнього поста */}
                                {index !== initialData.slice(0, 3).length - 1 && <div className='divider'></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}