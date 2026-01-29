import { useState, useEffect } from 'react'
import './App.css'
import Game from './components/Game'
import { Theme } from '@radix-ui/themes';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';

function App() {
  // TODO - Login
  const [loggedIn, setLoggedIn] = useState(false);

  var navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) navigate('/login');
  }, []);

  return (
    <>
      <Theme>
        <Routes>
          <Route path='/' element={<HomePage />} />
          {
            !loggedIn &&
              <>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
              </>
          }
        </Routes>
       
      </Theme>
      
    </>
  )
}

export default App
