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

  const firstPage = pathname === '/falts/' || pathname === '/falts';
  return (
    <>
      <Routes>
        <Route path='/falts/' element={<FirstVisit />} />
        <Route path='/falts/home' element={<Home />} />
        <Route path='/falts/userPosts' element={<UserPosts />} />
        <Route path='/falts/post/:id' element={<FullPost />} />
        <Route path='/falts/write' element={<CreatePost />} />
        <Route path='/falts/edit/post/:id' element={<EditPost />} />
      </Routes>
      {!firstPage && <footer />}
    </>
  );
}

export default App;
