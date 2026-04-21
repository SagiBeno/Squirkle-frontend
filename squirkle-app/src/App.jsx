import { useState, useEffect } from 'react'
import './App.css'
import { Theme, Box, Flex } from '@radix-ui/themes';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import Navbar from './components/Navbars/Navbar';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import AppToast from './components/AppToast';
import UsernameInputDialog from './components/Dialogs/UsernameInputDialog';
import ItemManagementPage from './Pages/ItemManagementPage';
import GamePage from './Pages/GamePage';
import MetadataManagementPage from './Pages/MetadataManagementPage';
import AppLoader from './components/Spinners/AppLoader';

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState({ open: false, title: '', description: '', isError: false });
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
  const [loginWithGoogleUserData, setLoginWithGoogleUserData] = useState({});
  const [showAppLoader, setShowAppLoader] = useState(true);
  const loggedIn = user?.accessToken != null
  let navigate = useNavigate();

  function getUserIdFromUserObject(userObject) {
    return userObject?.user?.uid ?? userObject?.user?.user?.uid ?? null;
  }

  async function getCoinCount(userId) {
    if (!userId) return 0;

    try {
      const resultJSON = await fetch(`https://squirkle-backend.vercel.app/api/get-coins/${userId}`);
      const result = await resultJSON.json();
      const parsedCoinCount = Number(result?.coinCount ?? result?.coins ?? 0);
      return Number.isFinite(parsedCoinCount) ? parsedCoinCount : 0;
    } catch (error) {
      console.warn(error);
      return 0;
    }
  }

  async function withCoinCount(userObject) {
    if (!userObject) return userObject;

    const userId = getUserIdFromUserObject(userObject);
    const coinCount = await getCoinCount(userId);
    return { ...userObject, coinCount };
  }

  useEffect(() => {
    if (user?.user?.uid) getPermissions(user.user.uid);
  }, [user?.user?.uid])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userId = currentUser?.uid;

        if (userId) {
          const username = await getUsername(userId);
          if (!username) {
            return;
          }
          else {
            const userWithCoinCount = await withCoinCount({ user: currentUser, username: username });
            setUser(userWithCoinCount);
          }
        } else navigate('/');
      } else navigate('/login');
    });
    return unsubscribe
  }, [auth, loggedIn]);

  function getPermissions(userId) {
    setLoading(true);
    fetch(`https://squirkle-backend.vercel.app/api/get-permissions/${userId}`)
      .then(async (resJSON) => {
        const res = await resJSON.json();

        if (resJSON.status === 200) {
          if (res?.isAdmin) {
            setUser(prev => ({
              ...prev,
              isAdmin: res.isAdmin
            }));
          } else {
            setUser(prev => ({
              ...prev,
              isAdmin: false
            }));
          }
        } else {
          setUser(prev => ({
            ...prev,
            isAdmin: false
          }));
        }
      })
      .catch(console.warn)
      .finally(() => setLoading(false));
  }

  async function getUsername(userId) {
    const resultJSON = await fetch(`https://squirkle-backend.vercel.app/api/get-username/${userId}`);
    const result = await resultJSON.json();
    return result?.username;
  }

  async function handleLoginWithEmailAndPW(data) {
    setLoading(true);
    const email = data?.email;
    const password = data?.password;

    if (!email || !password) return;
    else {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const userId = result?.user?.uid;

        if (userId) {
          const username = await getUsername(userId);
          if (!username) return;
          else {
            const userWithCoinCount = await withCoinCount({ user: result, username: username });
            setUser(userWithCoinCount);
            navigate('/');
          }
        } else return;
      } catch (error) {
        console.warn(error);
        setToastData({ open: true, title: 'Failed login', description: 'Invalid email or password', isError: true })
      }
    }
    setLoading(false);
  }

  async function handleLoginWithGoogle() {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const userId = result?.user?.uid;
    const username = await getUsername(userId);
    if (username) navigate("/");
    else {
      setLoginWithGoogleUserData(result);
      setUsernameDialogOpen(true);
    }
  }

  function signOut() {
    auth.signOut();
    setUser(null);
    navigate('/');
  }

  async function existingUsername(username) {

    const resultJSON = await fetch(`https://squirkle-backend.vercel.app/api/get-username-exists/${username}`);
    const result = await resultJSON.json();
    const exists = result?.exists;
    return exists;
  }

  async function handleRegistration(data) {
    setLoading(true);
    const email = data?.email;
    const password = data?.password;
    const username = data?.username;

    if (!email || !password || !username) return;
    else {
      const existsUsername = await existingUsername(username);

      if (existsUsername) {
        setToastData({ open: true, title: 'Failed registration', description: 'The username already exist!', isError: true });
        setLoading(false);
      }
      else {
        try {
          const registerResult = await createUserWithEmailAndPassword(auth, email, password);
          const userId = registerResult?.user?.uid;

          if (userId) {
            fetch('https://squirkle-backend.vercel.app/api/create-username', {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: userId, username: username })
            })
              .then(async (res) => {
                if (res.status === 201) {
                  setToastData({ open: true, title: 'Successfully registartion!', description: '', isError: false });
                  const userWithCoinCount = await withCoinCount({ user: registerResult, username: username });
                  setUser(userWithCoinCount);
                  navigate('/');
                }
              })
              .catch(error => {
                console.warn(error);
              })
              .finally(() => { setLoading(false) });
          }
        } catch (error) {
          console.warn(error);
          setLoading(false);
          setToastData({ open: true, title: 'Failed registration', description: 'The email already exist!', isError: true });
        }
      }
    }
  }

  return (
    <>
      <Theme>
        <Routes>
          {
            <>
              <Route path='/' element={<HomePage user={user} setShowAppLoader={setShowAppLoader} />} />
              <Route path='/game' element={<GamePage user={user} signOut={signOut} setShowAppLoader={setShowAppLoader} toastData={toastData} setToastData={setToastData} />} />
              {user?.isAdmin && <Route path='/admin/item-management' element={<ItemManagementPage user={user} toastData={toastData} setToastData={setToastData} setShowAppLoader={setShowAppLoader} signOut={signOut} />} />}
              {user?.isAdmin && <Route path='/admin/metadata-management' element={<MetadataManagementPage user={user} toastData={toastData} setToastData={setToastData} setShowAppLoader={setShowAppLoader} signOut={signOut} />} />}
            </>
          }

          {
            <>
              {user === null && <Route path='/login' element={<LoginPage handleLoginWithEmailAndPW={handleLoginWithEmailAndPW} handleLoginWithGoogle={handleLoginWithGoogle} loading={loading} setShowAppLoader={setShowAppLoader} />} />}
              {user === null && <Route path='/register' element={<RegisterPage loading={loading} handleRegistration={handleRegistration} handleLoginWithGoogle={handleLoginWithGoogle} setShowAppLoader={setShowAppLoader} />} />}
            </>
          }
        </Routes>

        <AppToast
          toastData={toastData}
          setToastData={setToastData}
        />
        {
          usernameDialogOpen && <UsernameInputDialog open={usernameDialogOpen} setOpen={setUsernameDialogOpen} toastData={toastData} setToastData={setToastData} existingUsername={existingUsername} userData={loginWithGoogleUserData} setUser={async (userObject) => setUser(await withCoinCount(userObject))} />
        }
      </Theme>
      {
        showAppLoader && <AppLoader />
      }
    </>
  )
}

export default App
