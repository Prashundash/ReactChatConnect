import logo from "./logo.svg";
import "./App.css";
import React, { useRef, useState } from "react";

import firebase from "firebase/compat/app";

import "firebase/compat/auth";
import "firebase/auth";

import "firebase/compat/firestore";

import "firebase/analytics";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";

import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyAU6H7IQdC5CAACo4Cv7_S2wxnRWSzMT6Y",
  authDomain: "react-chat-app-cb35a.firebaseapp.com",
  projectId: "react-chat-app-cb35a",
  databaseURL: "https:/react-chat-app-cb35a.fiebaseio.com",
  storageBucket: "react-chat-app-cb35a.appspot.com",
  messagingSenderId: "901303215890",
  appId: "1:901303215890:web:46994a6fdbe6adabc2b5cb",
  measurementId: "G-98S6KR2PBK",
});

const auth = firebase.auth();

const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Let's talk</h1>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}
function SignIn() {
  const auth = firebase.auth(); // Make sure you have initialized firebase properly

  const useSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={useSignInWithGoogle}>
        Sign In with Google
      </button>
      <p>Let's Connect to talk!</p>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection("messages");

  const query = messagesRef.orderBy("createdAt").limit(100);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" }); // Fixed typo: "behaviour" -> "behavior"
  };

  return (
    <>
      {messages &&
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type something"
        />
        <button type="submit" disabled={!formValue}>
          Let's go!
        </button>
      </form>
      <div ref={dummy}></div>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="User" />
      <p>{text}</p>
    </div>
  );
}

export default App;
