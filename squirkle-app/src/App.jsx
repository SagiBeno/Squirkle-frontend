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

/**
 * Extracts the Firebase user object from different possible authentication result structures.
 * 
 * @param { Object | null } userObject - Firebase user object or nested authentication result object
 * @returns { Object | null } Firebase user object if found, otherwise null
 */
function getFirebaseUser(userObject) {
  if (userObject?.uid) return userObject;
  if (userObject?.user?.uid) return userObject.user;
  if (userObject?.user?.user?.uid) return userObject.user.user;
  return null;
}

/**
 * Gets the Firebase user ID from a user or authentication result object
 * 
 * @param { Object | null } userObject - Firebase user object or nested authentication result object
 * @returns { Object | null } Firebase user ID, or null if it cannot be found
 */
function getUserIdFromUserObject(userObject) {
  return getFirebaseUser(userObject)?.uid ?? null;
}

/**
 * Fetches the coin count of a user from the backend.
 * 
 * Returns 0 if the user ID is missing, the request fails,
 * or the response does not contain a valid coun coint.
 * 
 * @param { string } userId - Fireabse user ID
 * @returns { Promise<number> } User coin count
 */
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

/**
 * Fetches the admin permission status of a user from the backend.
 * 
 * @param { string } userId - Firebase user ID 
 * @returns { Promise<boolean> } True if the user is an admin, otherwise false
 */
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

/**
 * Fetches the username assigned to a Firebase user ID.
 * 
 * @param { string } userId - Firebase user ID 
 * @returns { Promise<boolean | undefined> } USername if found
 */
async function getUsername(userId) {
  const resultJSON = await fetch(`https://squirkle-backend.vercel.app/api/get-username/${userId}`);
  const result = await resultJSON.json();
  return result?.username;
}

/**
 * Main application component.
 * 
 * Initalizes Firebase, manages global authentication state,
 * loads current user data, handles login, registration, logout,
 * routing, toast messages, username dialog state, and global loadin screen visibility.
 * 
 * @component
 * @returns { JSX.Element } Application root component
 */
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

  /**
   * Loads the currently authenticated user's application data.
   * 
   * Extracts the Firebase user ID, retrieves the username, coin count,
   * and permission status from the backend, then stores the combined user data
   * int the application state.
   * 
   * @param { Object } userObject - Firabase user object or authentication result object
   * @param { Object } [options={}] - Optional loading configuration
   * @param { string } [options.username] - Username to user instead of fetching it from the backend
   * @return { Promise<Object | null> } Loaded user data, or null if loading fails
   */
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
      }
    });
    return unsubscribe
  }, [auth, navigate, loadCurrentUserData]);

  /**
   * Handles user login with emai and password.
   * 
   * Signs in the user with Firebase Authentication,
   * loads the user's application data, and navigates to the game page.
   * 
   * @param { Object } data - Login form data
   * @param { string } data.email - User email address
   * @param { string } data.password - User password 
   * @returns { Promise<void> }
   */
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

  /**
   * Handles user login with Google.
   * 
   * Sings in the user using a Google popup. If the user already has
   * a username, their application data is loaded and they are redirected
   * to the game page. Otherwise, the username dialog is opened.
   * 
   * @returns { PRomise<void> }
   */
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

  /**
   * Signs out the current user.
   * 
   * Clears the current user staet and redirects the user to the home page.
   * 
   * @returns { void }
   */
  function signOut() {
    auth.signOut();
    setUser(null);
    navigate('/');
  }

  /**
   * Checks wether a username already exists.
   * 
   * @param { string } username - Username to check 
   * @returns { Promise<boolean> } True if the username already exists, otherwise false
   */
  async function existingUsername(username) {

    const resultJSON = await fetch(`https://squirkle-backend.vercel.app/api/get-username-exists/${username}`);
    const result = await resultJSON.json();
    const exists = result?.exists;
    return exists;
  }

  /**
   * Handles user registration with email, password, and username.
   * 
   * Checks wether the username already exists, creates a Firebase user,
   * strores the username in the backend, loads the new user data,
   * and redirects the user to the game page.
   * 
   * @param { Object } data - Registration form data 
   * @param { string } data.email - User email address
   * @param { string } data.password - User password
   * @param { string } data.username - Chosen username
   * @returns { Promise<void> }
   */
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
          <Route path='/' element={<HomePage user={user} setShowAppLoader={setShowAppLoader} />} />
              <Route path='/game' element={<GamePage user={user} signOut={signOut} setShowAppLoader={setShowAppLoader} toastData={toastData} setToastData={setToastData} refreshUser={loadCurrentUserData}/>} />
              <Route path='/login' element={<LoginPage handleLoginWithEmailAndPW={handleLoginWithEmailAndPW} handleLoginWithGoogle={handleLoginWithGoogle} loading={loading} setShowAppLoader={setShowAppLoader} user={user} />} />
              <Route path='/register' element={<RegisterPage loading={loading} handleRegistration={handleRegistration} handleLoginWithGoogle={handleLoginWithGoogle} setShowAppLoader={setShowAppLoader} user={user} />} />
              {user?.isAdmin && <Route path='/admin/item-management' element={<ItemManagementPage user={user} toastData={toastData} setToastData={setToastData} setShowAppLoader={setShowAppLoader} signOut={signOut} />} />}
              {user?.isAdmin && <Route path='/admin/metadata-management' element={<MetadataManagementPage user={user} toastData={toastData} setToastData={setToastData} setShowAppLoader={setShowAppLoader} signOut={signOut} />} />}
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
