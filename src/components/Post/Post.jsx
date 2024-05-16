import React from 'react'
import { Link } from 'react-router-dom'
import { SelectedIcon, CommentsIcon, LikeIcon, OtherIcon, DeleteIcon } from '../../icons';
import './post.scss'
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const currentDate = new Date();
    const differenceInSeconds = Math.floor((currentDate - date) / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInMinutes < 1) {
        return 'Нещодавно';
    } else if (differenceInMinutes < 60) {
        return `${differenceInMinutes} хв тому`;
    } else if (differenceInHours < 24) {
        return `${differenceInHours} год тому`;
    } else {
        return `${Math.floor(differenceInHours / 24)} дн тому`;
    }
};
const truncateText = (text) => {
    if (text.length >= 200) {
        return text.substring(0, 200) + '...'
    }
    return text
}
const truncateText2 = (text) => {
    if (text.length >= 500) {
        return text.substring(0, 500) + '...'
    }
    return text
}
export const Post = ({ id, title, date, text, image, user, tags }) => {
    const formattedDate = formatDate(date);

    return (
        <Link to={`/falts/post/${id}`}>
            <div className='post' key={id}>
                <div className='info'>
                    {user && (
                        <div className='author-info'>
                            <div className='author-block'>
                                <img src={user.image} alt={user.fullName} />
                                <div>
                                    <p className='author'>{user.fullName}</p>
                                    <p className='date'>{formattedDate}</p>
                                </div>
                            </div>
                            <div className='save-icon'>
                                <SelectedIcon />
                            </div>
                        </div>
                    )}
                    <div className='text-info'>
                        <h3 className='title'>{title}</h3>
                        <div className='text' dangerouslySetInnerHTML={{ __html: truncateText(text) }} />
                    </div>
                    <div className='actions'>
                        <div className='tags'>
                            {tags.map(tag => (
                                <div key={tag.id} className='tag'>
                                    <p>{tag.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className='icons'>
                            <div className='icon comment'>
                                <CommentsIcon />
                                <p>32</p>
                            </div>
                            <div className='icon like'>
                                <LikeIcon />
                                <p>160</p>
                            </div>
                            <div className='icon other'>
                                <OtherIcon />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='image'>
                    <img src={image} alt={title} />
                </div>
            </div>
        </Link>
    )
}
export const PopularPost = ({ id, title, date, user, tags }) => {
    const formattedDate = formatDate(date);
    return (
        <Link to={`/falts/post/${id}`}>
            <div className='popular-post'>
                <div className='info'>
                    <div className='author-info'>
                        <div className='author-block'>
                            <img src={user.image} alt={user.fullName} />
                            <p className='author'>{user.fullName}</p>
                            <p className='dot'>&#x2022;</p>
                            <p className='date'>{formattedDate}</p>
                        </div>
                        <div className='save-icon'>
                            <SelectedIcon />
                        </div>
                    </div>
                    <div className='text-info'>
                        <h3 className='title'>{title}</h3>
                    </div>
                    <div className='actions'>
                        <div className='tags'>
                            {tags.map(tag => (
                                <div key={tag.id} className='tag'>
                                    <p>{tag.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export const FirstVisitPost = ({ id, title, date, text, user, tags }) => {
    const formattedDate = formatDate(date);
    const firstTag = tags[0];

    return (
        <Link to={`/falts/post/${id}`}>
            <div className='first-visit' key={id}>
                <div className='info'>
                    {user && (
                        <div className='author-info'>
                            <div className='author-block'>
                                <img src={user.image} alt={user.fullName} />
                                <div>
                                    <p className='author'>{user.fullName}</p>
                                    <p className='date'>{formattedDate}</p>
                                </div>
                            </div>
                            <div className='save-icon'>
                                <SelectedIcon />
                            </div>
                        </div>
                    )}
                    <div className='text-info'>
                        <h3 className='title'>{title}</h3>
                        <div className='text' dangerouslySetInnerHTML={{ __html: text }} />

                    </div>
                    <div className='actions'>
                        <div className='tags'>
                            {firstTag && (
                                <div key={firstTag.id} className='tag'>
                                    <p>{firstTag.name}</p>
                                </div>
                            )}
                        </div>
                        <div className='icons'>
                            <div className='icon comment'>
                                <CommentsIcon />
                                <p>32</p>
                            </div>
                            <div className='icon like'>
                                <LikeIcon />
                                <p>160</p>
                            </div>
                            <div className='icon other'>
                                <OtherIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export const UserPost = ({ id, title, date, text, image, user, tags, onDelete }) => {
    const formattedDate = formatDate(date);

    return (
        <div className='user-post' key={id}>
            <div className='info'>
                {user && (
                    <div className='author-info'>
                        <div className='author-block'>
                            <img src={user.image} alt={user.fullName} />
                            <div>
                                <p className='author'>{user.fullName}</p>
                                <p className='date'>{formattedDate}</p>
                            </div>
                        </div>
                        <div className='delete-icon' onClick={() => onDelete(id)}>
                            <DeleteIcon />
                        </div>
                    </div>
                )}
                <Link to={`/falts/edit/post/${id}`}>
                    <div className='text-info'>
                        <h3 className='title'>{title}</h3>
                        <div className='text' dangerouslySetInnerHTML={{ __html: truncateText2(text) }} />
                    </div>
                </Link>
                <div className='actions'>
                    <div className='tags'>
                        {tags.map(tag => (
                            <div key={tag.id} className='tag'>
                                <p>{tag.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className='icons'>
                        <div className='icon comment'>
                            <CommentsIcon />
                            <p>32</p>
                        </div>
                        <div className='icon like'>
                            <LikeIcon />
                            <p>160</p>
                        </div>
                        <div className='icon other'>
                            <OtherIcon />
                        </div>
                    </div>
                </div>
            </div>
            <div className='image'>
                <img src={image} alt={title} />
            </div>
        </div>
    )
}