import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPost } from '../../components/Post/Post';
import { Header } from '../../components/Header/Header';
import './UserPosts.scss';

export const UserPosts = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [initialData, setInitialData] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsResponse = await axios.get('https://04cb5470549a62ec.mokky.dev/posts');
                setPosts(postsResponse.data);
                setInitialData(postsResponse.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setPosts(initialData);
        } else {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`https://04cb5470549a62ec.mokky.dev/posts?title=*${searchTerm}`);
                    setPosts(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [searchTerm, initialData]);

    const userPosts = posts.filter(post => post.user_id === user.id).sort((a, b) => new Date(b.date) - new Date(a.date));

    const DeletePost = async (id) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот пост?');
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`https://04cb5470549a62ec.mokky.dev/posts/${id}`);
            console.log(response.data);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    return (
        <>
            <Header handleSearch={handleSearch} />
            <div className='main'>
                <div className='user-posts'>
                    {userPosts.length > 0 ? (
                        userPosts.map((post, index) => (
                            <React.Fragment key={post.id}>
                                <UserPost
                                    user={user}
                                    title={post.title}
                                    date={post.date}
                                    image={post.image}
                                    text={post.text}
                                    id={post.id}
                                    tags={post.tags}
                                    onDelete={DeletePost}
                                />
                                {index !== userPosts.length - 1 && <div className='divider' />}
                            </React.Fragment>
                        ))
                    ) : (
                        <p>No posts found for this user.</p>
                    )}
                </div>
            </div>
        </>
    );
};
