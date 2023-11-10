import "./App.css";
import { db, auth } from "./firebase.js";
import { useEffect, useState } from "react";
import Header from "./Header.js";
import Post from "./Post.js";

function App() {
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(function (val) {
      setUser(val?.displayName);
    });

    const unsubscribePosts = db
      .collection("posts")
      .orderBy("timeStamp", "desc")
      .onSnapshot(function (snapshot) {
        setPosts(
          snapshot.docs.map(function (document) {
            return { id: document.id, info: document.data() };
          })
        );
      });

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, []);

  return (
    <div className="App">
      <Header setUser={setUser} user={user} />
      {posts.map(function (val) {
        return <Post user={user} key={val.id} info={val.info} id={val.id} />;
      })}
    </div>
  );
}

export default App;
