import React from 'react'
import { Link } from 'react-router-dom'
import './post.scss'
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const currentDate = new Date();
    const differenceInSeconds = Math.floor((currentDate - date) / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInMinutes < 1) {
        return 'Только что';
    } else if (differenceInMinutes < 60) {
        return `${differenceInMinutes} минут назад`;
    } else if (differenceInHours < 24) {
        return `${differenceInHours} часов назад`;
    } else {
        return `${Math.floor(differenceInHours / 24)} дней назад`;
    }
};

export const Post = ({ id, title, date, text, image, user, avatar }) => {
    const formattedDate = formatDate(date);

    return (
        <Link to={`/post/${id}`}>
            <div className='post' key={id}>
                <div className='info'>
                    {user && (
                        <div className='author-info'>
                            <img src={user.image} alt={user.fullName} />
                            <div>
                                <p className='author'>{user.fullName}</p>
                                <p className='date'>{formatDate(date)}</p>
                            </div>
                        </div>
                    )}
                    <div className='text-info'>
                        <h3 className='title'>{title}</h3>
                        <p className='text'>{text}</p>
                    </div>
                    <div className='tags'>
                        Tag
                    </div>
                </div>
                <div className='image'>
                    <img src={image} alt={title} />
                </div>
                {/* Отображаем информацию о пользователе */}

                {/* Предполагается, что ссылка на профиль пользователя доступна */}
                {/* {user && (
                <Link to={`/profile/${user.id}`} style={{ textDecoration: "none" }}>
                    Посмотреть профиль
                </Link>
            )} */}
                {/* Если вы хотите отобразить кнопку "Изменить" только для авторизованных пользователей, то можно добавить такую проверку */}
            </div>
        </Link>
    )
}