import logo from './logo.svg';
import './App.scss';
import { Header } from './components/Header/Header';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Registration } from './pages/Registration/Registration';
import { Login } from './pages/Login/Login';
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/falts' element={<Home />}/>
        <Route path='/falts/login' element={<Login />}/>
        <Route path='/falts/registration' element={<Registration />}/>
      </Routes>
    </>
  );
}

export default App;
