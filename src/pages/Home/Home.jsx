import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Post } from '../../components/Post/Post';
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
        <div className='main'>
            {/* <div>
                <Link to='/write' style={{ textDecoration: "none" }}>
                    Create Post
                </Link>
            </div> */}
            <div style={{ width: "840px", marginTop: "48px" }}>
                {data.map((post) => (
                    <>
                        <div key={post.id}>
                            <Post
                                user={users.find(user => user.id === post.user_id)}
                                title={post.title}
                                date={post.date}
                                text={post.text}
                                image={post.image}
                                id={post.id} />
                            {/* Отображаем кнопку "Изменить" только если текущий пользователь создал этот пост */}
                            {currentUser && currentUser.id === post.user_id && (
                                <Link to={`/write/${post.id}`} style={{ textDecoration: "none" }}>
                                    <button>Edit</button>
                                </Link>
                            )}
                        </div>
                        <div className='divider'></div>
                    </>
                ))}
            </div>
        </div>
    )
}
