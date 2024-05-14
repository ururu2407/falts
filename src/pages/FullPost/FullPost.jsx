import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './FullPost.scss'
import { SelectedIcon, CommentsIcon, LikeIcon, OtherIcon } from '../../icons';
import { Header } from '../../components/Header/Header';
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};


export const FullPost = () => {
    const params = useParams()
    const [postWithUser, setPostWithUser] = useState(null)

    useEffect(() => {
        const fetchPostWithUser = async () => {
            try {
                const postResponse = await axios.get(`https://04cb5470549a62ec.mokky.dev/posts/${params.id}`)
                const post = postResponse.data

                const userResponse = await axios.get(`https://04cb5470549a62ec.mokky.dev/users/${post.user_id}`)
                const user = userResponse.data

                const postWithUser = {
                    id: post.id,
                    title: post.title,
                    text: post.text,
                    image: post.image,
                    tags: post.tags,
                    date: post.date,
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        image: user.image
                    }
                }

                setPostWithUser(postWithUser)
            } catch (error) {
                console.error('Error fetching post with user:', error)
            }
        }
        fetchPostWithUser()
    }, [params.id])

    const formattedDate = formatDate(postWithUser?.date);
    return (
        <>
            <Header />
            <div className='full-post'>
                <div className='content'>
                    <div className='author-field'>
                        <h1 className='title'>{postWithUser?.title}</h1>
                        <div className='info'>
                            {postWithUser && (
                                <div className='author-block'>
                                    <img src={postWithUser.user.image} alt={postWithUser.user.fullName} />
                                    <div className='author-info'>
                                        <p className='author'>{postWithUser.user.fullName}</p>
                                        <p className='date'>{formattedDate}</p>
                                    </div>
                                </div>
                            )}
                            <div className='icons'>
                                <div className='icon comment'>
                                    <CommentsIcon />
                                    <p>32</p>
                                </div>
                                <div className='icon like'>
                                    <LikeIcon />
                                    <p>160</p>
                                </div>
                                <div className='icon save'>
                                    <SelectedIcon />
                                </div>
                                <div className='icon other'>
                                    <OtherIcon />
                                </div>
                            </div>
                        </div>
                        <div className='tags'>
                            {postWithUser?.tags.map(tag => (
                                <div className='tag'>{tag.name}</div>
                            ))}
                        </div>
                    </div>
                    <div className='text-field'>
                        <div className='text' dangerouslySetInnerHTML={{ __html: postWithUser?.text }} />
                        <img className='post-image' src={postWithUser?.image} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}
