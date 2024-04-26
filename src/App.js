import logo from './logo.svg';
import './App.scss';
import { Header } from './components/Header/Header';
import { Routes, Route, useLocation } from 'react-router-dom'; // Импортируем useLocation
import { Home } from './pages/Home/Home';
import { Registration } from './pages/Registration/Registration';
import { Login } from './pages/Login/Login';
import { FullPost } from './pages/FullPost/FullPost';
import { CreatePost } from './pages/CreatePost/CreatePost';

function App() {
  // Получаем текущий путь из объекта location
  const location = useLocation();
  const { pathname } = location;

  // Проверяем, находимся ли мы на главной странице
  const isHomePage = pathname === '/falts/';
  const isCreatePage = pathname === '/falts/write';
  return (
    <>
      {/* Условно отображаем Header в зависимости от того, на какой странице мы находимся */}
      {(!isHomePage && !isCreatePage) && <Header />}
      <Routes>
        <Route path='/falts/' element={<Home />} />
        <Route path='/falts/login' element={<Login />} />
        <Route path='/falts/registration' element={<Registration />} />
        <Route path='/falts/post/:id' element={<FullPost />} />
        <Route path='/falts/write' element={<CreatePost />} />
      </Routes>
    </>
  );
}

export default App;
