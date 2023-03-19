import { starwars } from "./data/starwars";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "./firebaseConfig/firebase";
import { useEffect, useState } from "react";

import ShowEpisodeTable from "./components/ShowEpisodeTable";

import "./App.css";

function App() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [userInfo, setUserInfo] = useState("");

  const onSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Sign in success!");
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
      })
      .catch((error) => {
        console.log("Sign in error!");
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const onSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out");
      })
      .catch((error) => {
        console.log("Could not sign out");
        console.log("Error: " + error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log("State changed to signed in");
        setUserInfo(user);
      } else {
        // User is signed out
        console.log("State changed to signed out");
        setUserInfo("");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <nav>
        <div className="user-info">
          <p>Username: {userInfo && userInfo.displayName}</p>
        </div>
        {!userInfo && (
          <div>
            <button onClick={onSignIn}>Sign In</button>
          </div>
        )}
        {userInfo && (
          <div>
            <button onClick={onSignOut}>Sign Out</button>
          </div>
        )}
      </nav>
      <main>
        <div className="container">
          <div className="page-header">
            <h1>Track your shows!</h1>
            <p>
              Use the list to track how many episodes you have watched from your
              favorite shows
            </p>
          </div>
          <div className="show-table">
            {starwars.map((showDetails, index) => {
              return (
                <div key={index}>
                  <ShowEpisodeTable showDetails={showDetails} />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
