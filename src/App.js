import './App.scss';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { FullPost } from './pages/FullPost/FullPost';
import { CreatePost } from './pages/CreatePost/CreatePost';
import { FirstVisit } from './pages/FirstVisit/FirstVisit';
import { UserPosts } from './pages/UserPosts/UserPosts';
import { EditPost } from './pages/EditPost/EditPost';
function App() {
  const location = useLocation();
  const { pathname } = location;
  // Перевіряємо, чи користувач першій сторінці
  const firstPage = pathname === '/falts/' || pathname === '/falts';
  return (
    <>
      {/* Використовуємо компоненти маршрутизації для відображення відповідних компонентів для кожного шляху */}
      <Routes>
        {/* Компонент для першого відвідування */}
        <Route path='/falts/' element={<FirstVisit />} />
        {/* Головна сторінка */}
        <Route path='/falts/home' element={<Home />} />
        {/* Сторінка з постами користувача */}
        <Route path='/falts/userPosts' element={<UserPosts />} />
        {/* Повний пост */}
        <Route path='/falts/post/:id' element={<FullPost />} />
        {/* Сторінка для створення нового поста */}
        <Route path='/falts/write' element={<CreatePost />} />
        {/* Сторінка для редагування існуючого поста */}
        <Route path='/falts/edit/post/:id' element={<EditPost />} />
      </Routes>
      {/* Відображаємо підвал, якщо користувач не першій сторінці */}
      {!firstPage && <footer />}
    </>
  );
}

export default App;
