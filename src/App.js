import './App.scss';
import { Routes, Route } from 'react-router-dom'; 
import { Home } from './pages/Home/Home';
import { FullPost } from './pages/FullPost/FullPost';
import { CreatePost } from './pages/CreatePost/CreatePost';
import { FirstVisit } from './pages/FirstVisit/FirstVisit';
function App() {
  return (
    <>
      <Routes>
        <Route path='/falts/' element={<FirstVisit />} />
        <Route path='/falts/home' element={<Home />} />
        <Route path='/falts/post/:id' element={<FullPost />} />
        <Route path='/falts/write' element={<CreatePost />} />
      </Routes>
      <footer/>
    </>
  );
}

export default App;
