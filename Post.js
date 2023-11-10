import { db } from "./firebase.js";
import { useEffect, useState } from "react";

function Post(props) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    db.collection("posts")
      .doc(props.id)
      .collection("comments")
      .onSnapshot(function (snapshot) {
        setComments(
          snapshot.docs.map(function (document) {
            return { id: document.id, info: document.data() };
          })
        );
      });
  });

  function send(id, e) {
    e.preventDefault();
    let actualComment = document.querySelector("#comment-" + id).value;
    db.collection("posts").doc(id).collection("comments").add({
      name: props.user,
      comment: actualComment,
    });
    alert("Comment made successfully!");

    document.querySelector("#comment-" + id).value = "";
  }

  return (
    <div className="postSingle">
      <p>
        <b>{props.info.userName}</b>
      </p>
      <img src={props.info.image} alt="Post"></img>
      <p>
        <b>{props.info.userName}</b>: {props.info.subtitle}
      </p>
      <div className="comments">
        {comments.map(function (val) {
          return (
            <div className="commentSingle">
              <p>
                <b>{val.info.name}</b>: {val.info.comment}
              </p>
            </div>
          );
        })}
      </div>
      <form onSubmit={(e) => send(props.id, e)}>
        <textarea id={"comment-" + props.id}></textarea>
        <input type="submit" value="Add a comment"></input>
      </form>
    </div>
  );
}

export default Post;
