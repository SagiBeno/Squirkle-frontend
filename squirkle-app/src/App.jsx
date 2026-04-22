import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { Theme } from '@radix-ui/themes';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import AppToast from './components/AppToast';
import UsernameInputDialog from './components/Dialogs/UsernameInputDialog';
import ItemManagementPage from './Pages/ItemManagementPage';
import GamePage from './Pages/GamePage';
import MetadataManagementPage from './Pages/MetadataManagementPage';
import AppLoader from './components/Spinners/AppLoader';

function getFirebaseUser(userObject) {
  if (userObject?.uid) return userObject;
  if (userObject?.user?.uid) return userObject.user;
  if (userObject?.user?.user?.uid) return userObject.user.user;
  return null;
}

function getUserIdFromUserObject(userObject) {
  return getFirebaseUser(userObject)?.uid ?? null;
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

async function getPermissions(userId) {
  if (!userId) return false;

  try {
    const resJSON = await fetch(`https://squirkle-backend.vercel.app/api/get-permissions/${userId}`);
    const res = await resJSON.json();
    return resJSON.status === 200 ? Boolean(res?.isAdmin) : false;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

async function getUsername(userId) {
  const resultJSON = await fetch(`https://squirkle-backend.vercel.app/api/get-username/${userId}`);
  const result = await resultJSON.json();
  return result?.username;
}

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
  let navigate = useNavigate();

  const loadCurrentUserData = useCallback(async (userObject, options = {}) => {
    const firebaseUser = getFirebaseUser(userObject);
    const userId = getUserIdFromUserObject(firebaseUser);

    if (!userId) {
      setUser(null);
      return null;
    }

    try {
      const username = options.username ?? await getUsername(userId);

      if (!username) return null;

      const [coinCount, isAdmin] = await Promise.all([
        getCoinCount(userId),
        getPermissions(userId),
      ]);

      const currentUserData = {
        user: firebaseUser,
        username,
        coinCount,
        isAdmin,
      };

      setUser(currentUserData);
      return currentUserData;
    } catch (error) {
      console.warn(error);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const currentUserData = await loadCurrentUserData(currentUser);
        if (!currentUserData) return;
      } else {
        setUser(null);
        // navigate('/');
      }
    });
    return unsubscribe
  }, [auth, navigate, loadCurrentUserData]);

  async function handleLoginWithEmailAndPW(data) {
    setLoading(true);
    const email = data?.email;
    const password = data?.password;

    if (!email || !password) {
      setLoading(false);
      return;
    } else {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const currentUserData = await loadCurrentUserData(result);
        if (!currentUserData) return;
        navigate('/game');
      } catch (error) {
        console.warn(error);
        setToastData({ open: true, title: 'Failed login', description: 'Invalid email or password', isError: true })
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleLoginWithGoogle() {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const userId = result?.user?.uid;
    const username = await getUsername(userId);
    if (username) {
      const currentUserData = await loadCurrentUserData(result, { username });
      if (!currentUserData) return;
      navigate('/game');
    } else {
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

    if (!email || !password || !username) {
      setLoading(false);
      return;
    } else {
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
                  await loadCurrentUserData(registerResult, { username });
                  navigate('/game');
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
              {<Route path='/login' element={<LoginPage handleLoginWithEmailAndPW={handleLoginWithEmailAndPW} handleLoginWithGoogle={handleLoginWithGoogle} loading={loading} setShowAppLoader={setShowAppLoader} />} />}
              {<Route path='/register' element={<RegisterPage loading={loading} handleRegistration={handleRegistration} handleLoginWithGoogle={handleLoginWithGoogle} setShowAppLoader={setShowAppLoader} />} />}
            </>
          }
        </Routes>

        <AppToast
          toastData={toastData}
          setToastData={setToastData}
        />
        {
          usernameDialogOpen && <UsernameInputDialog open={usernameDialogOpen} setOpen={setUsernameDialogOpen} setToastData={setToastData} existingUsername={existingUsername} userData={loginWithGoogleUserData} loadCurrentUserData={loadCurrentUserData} />
        }
      </Theme>
      {
        showAppLoader && <AppLoader />
      }
    </>
  )
}

export default App
