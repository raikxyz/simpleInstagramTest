import { useEffect, useState } from "react";
import firebase from "firebase";
import { auth, storage, db } from "./firebase.js";

function Header(props) {
  const [progress, setProgress] = useState(0);

  const [file, setFile] = useState(null);

  useEffect(() => {}, []);

  function createAccount(e) {
    e.preventDefault();
    let email = document.querySelector("#emailSignUp").value;
    let password = document.querySelector("#passwordSignUp").value;
    let username = document.querySelector("#usernameSignUp").value;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
        alert("Welcome to Instagram");
        let modal = document.querySelector(".modalCreateAccount");

        modal.style.display = "none";
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function Login(e) {
    e.preventDefault();
    let email = document.querySelector("#emailLogin").value;
    let password = document.querySelector("#passwordLogin").value;

    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        props.setUser(auth.user.displayName);
        alert("Logged in");
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  function openModalCreateAccount(e) {
    e.preventDefault();
    let modal = document.querySelector(".modalCreateAccount");
    modal.style.display = "block";
    document.body.classList.add("modal-open");
  }

  function closeModalCreate() {
    let modal = document.querySelector(".modalCreateAccount");
    modal.style.display = "none";
  }

  function openModalUpload(e) {
    e.preventDefault();

    let modal = document.querySelector(".modalUpload");

    modal.style.display = "block";
  }

  function closeModalUpload() {
    let modal = document.querySelector(".modalUpload");

    modal.style.display = "none";
  }

  function logout(e) {
    e.preventDefault();
    auth
      .signOut()
      .then(() => {
        props.setUser(null);
      })
      .catch((error) => {
        console.error("Error while doing logout:", error);
      });
  }

  function uploadPost(e) {
    e.preventDefault();

    let postSubtitle = document.getElementById("subtitleUpload").value;
    let progressEl = document.getElementById("progressUpload");

    const uploadTask = storage.ref(`images/${file.name}`).put(file);

    uploadTask.on(
      "state_changed",
      function (snapshot) {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      function (error) {},
      function () {
        storage
          .ref("images")
          .child(file.name)
          .getDownloadURL()
          .then(function (url) {
            const postId = `${props.user}_${Date.now()}`;

            db.collection("posts").doc(postId).set({
              subtitle: postSubtitle,
              image: url,
              userName: props.user,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            });

            setProgress(0);
            setFile(null);

            alert("Successfully uploaded a post");

            document.getElementById("formUpload").reset();
            closeModalUpload();
          })
          .catch(function (error) {});
      }
    );
  }

  return (
    <div className="header">
      <div className="modalCreateAccount">
        <div className="formCreateAccount">
          <div onClick={() => closeModalCreate()} className="closeModalCreate">
            X
          </div>

          <h2>Sign up</h2>
          <form onSubmit={(e) => createAccount(e)}>
            <input
              id="emailSignUp"
              type="text"
              placeholder="Your email..."
            ></input>
            <input
              id="usernameSignUp"
              type="text"
              placeholder="Your username..."
            ></input>
            <input
              id="passwordSignUp"
              type="password"
              placeholder="Your password..."
            ></input>
            <input type="submit" value="Create Account"></input>
          </form>
        </div>
      </div>

      <div className="modalUpload">
        <div className="formUpload">
          <div onClick={() => closeModalUpload()} className="closeModalCreate">
            X
          </div>
          <h2>Make an upload</h2>
          <form id="formUpload" onSubmit={(e) => uploadPost(e)}>
            <progress id="progressUpload" value={progress}></progress>
            <input
              id="subtitleUpload"
              type="text"
              placeholder="Subtitle to your post..."
            ></input>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              id="usernameSignUp"
              type="file"
              name="Submit your file..."
            ></input>
            <input type="submit" value="Create a post!"></input>
          </form>
        </div>
      </div>

      <div className="center">
        <div className="header_logo">
          <a href="">
            <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"></img>
          </a>
        </div>
        {props.user ? (
          <div className="header_loggedInfo">
            <span>
              Hello, <b>{props.user}</b>
            </span>
            <a onClick={(e) => openModalUpload(e)} href="#">
              Create
            </a>
            <a onClick={(e) => logout(e)}>Sign Out</a>
          </div>
        ) : (
          <div className="header_loginForm">
            <form onSubmit={(e) => Login(e)}>
              <input
                id="emailLogin"
                type="text"
                placeholder="Username..."
              ></input>
              <input
                id="passwordLogin"
                type="password"
                placeholder="Password"
              ></input>
              <input type="submit" value="Log in"></input>
            </form>
            <div className="btn_createAccount">
              <a onClick={(e) => openModalCreateAccount(e)} href="#">
                Create Account!
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
