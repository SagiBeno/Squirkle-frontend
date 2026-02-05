import { useState, useEffect } from 'react'
import './App.css'
import Game from './components/Game'
import { Theme } from '@radix-ui/themes';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import Navbar from './Components/Navbar';
import { Container } from '@radix-ui/themes';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import AppToast from './Components/AppToast';

function App() {
  const firebaseApp = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_authDomain,
    projectId: import.meta.env.VITE_FIREBASE_projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_appId
  });
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ open: false, title: '', description: '', isError: false });
  let navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  async function handleLoginWithEmailAndPW(data) {
    setLoading(true);
    const email = data?.email;
    const password = data?.password;

    if (!email || !password) return;
    else {

      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('hahandleLoginWithEmailAndPW result: ', result)
      } catch (error) {
        console.warn(error);
        setToastData({ open: true, title: 'Failed login', description: 'Ivalid email or password', isError: true })
      }

    }
    setLoading(false);
  }

  async function handleLoginWithGoogle() {
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  return (
    <>

      <Theme>
        <Container className='container'>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            {

              <>
                <Route path='/login' element={<LoginPage handleLoginWithEmailAndPW={handleLoginWithEmailAndPW} handleLoginWithGoogle={handleLoginWithGoogle} loading={loading} />} />
                <Route path='/register' element={<RegisterPage />} />
              </>
            }
          </Routes>
        </Container>
        <AppToast
          toastData={toastData}
          setToastData={setToastData}
        />
      </Theme>

    </>
  )
}

export default App
