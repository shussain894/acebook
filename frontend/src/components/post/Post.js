import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import moment from "moment";
import PropTypes from "prop-types";
import Comments from "../comment/Comments";
// import Popup from "../likesPopup/LikesPopup"

const Post = ({ post, token, setToken, post_id, setPosts, profile }) => {
  Post.propTypes = {
    token: PropTypes.string,
    setToken: PropTypes.func,
    post_id: PropTypes.string,
    post: PropTypes.object,
    createdAt: PropTypes.string,
    _id: PropTypes.string,
    message: PropTypes.string,
    setPosts: PropTypes.func,
    profile: PropTypes.bool,
  };

  const totalLikes = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

  const [commentsView, setCommentsView] = useState(false);
  const [user, setUser] = useState({});
  const [formattedLikes] = useState({
    likes: post.likes.length,
    hearts: post.hearts.length,
    fires: post.fires.length,
    angrys: post.angrys.length,
  });
  const [likes, setLikes] = useState(totalLikes(formattedLikes));
  // const[isOpen, setIsOpen] = useState(false);
  const user_id = window.localStorage.getItem("user_id");

  const showComments = () => {
    setCommentsView(!commentsView);
  };

  // const togglePopup = () => {
  //   setIsOpen(!isOpen);
  // }

  const deleteButtonView = post.user_id === user_id;

  const dateTimeAgo = moment(new Date(post.createdAt)).fromNow();
  const [liked, setLiked] = useState(
    post.likes.includes(user_id) ||
      post.hearts.includes(user_id) ||
      post.fires.includes(user_id) ||
      post.angrys.includes(user_id)
  );
  const [formatPost, setFormatPost] = useState(true);
  const path = profile ? "/user" : "/";

  useEffect(() => {
    if (token) {
      fetch("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          User_ID: `${post.user_id}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          window.localStorage.setItem("token", data.token);
          setToken(window.localStorage.getItem("token"));
          setUser(data.user);
        });
    }
  }, []);

  const likePost = async (emoji) => {
    // A true/false toggle on whether the user has liked the post already
    // setLiked((state) => !state);

    let response = await fetch(`/posts/${post._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: user_id, liked, emoji: emoji }),
    });

    let data = await response.json();

    if (response.status !== 200) {
      console.log("likes not updated");
    } else {
      console.log("likes updated");
      window.localStorage.setItem("token", data.token);
      setToken(window.localStorage.getItem("token"));

      // State passed from feed used to update number of likes on post
      if (token) {
        fetch(`/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then(async (data) => {
            window.localStorage.setItem("token", data.token);
            setToken(window.localStorage.getItem("token"));
            data.posts.map((post) => {
              if (post._id === post_id) {
                setLiked(
                  post.likes.includes(user_id) ||
                    post.hearts.includes(user_id) ||
                    post.fires.includes(user_id) ||
                    post.angrys.includes(user_id)
                );
                formattedLikes.likes = post.likes.length;
                formattedLikes.hearts = post.hearts.length;
                formattedLikes.fires = post.fires.length;
                formattedLikes.angrys = post.angrys.length;
                setLikes(totalLikes(formattedLikes));
              }
            });
          });
      }
    }
  };

  // The delete the post with POST_ID
  const deletePost = async () => {
    const response = await fetch("/posts", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Post_ID: post._id,
      },
    });

    const data = await response.json();

    if (response.status !== 200) {
      console.log("post NOT deleted");
    } else {
      console.log("post deleted");
      window.localStorage.setItem("token", data.token);
      setToken(window.localStorage.getItem("token"));

      // State passed from feed used to update all posts on Feed.js
      // This refreshes post list after deletion
      if (token) {
        fetch(`/posts${path}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            User_ID: user_id,
          },
        })
          .then((response) => response.json())
          .then(async (data) => {
            window.localStorage.setItem("token", data.token);
            setToken(window.localStorage.getItem("token"));
            setPosts(data.posts);
          });
      }
    }
  };

  // Confirm delete pop up
  const confirmDeletePost = () => {
    confirmAlert({
      title: "Delete post?",
      message: "Are you sure you want to delete this post?",
      buttons: [
        {
          id: "confirmDeleteButton",
          label: "Yes",
          onClick: () => deletePost(),
        },
        {
          label: "No",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  const postFormatter = (postToFormat) => {
    if (postToFormat.length > 100) {
      const revealButton = (
        <>
          <button
            className="revealButton"
            onClick={() => setFormatPost((state) => !state)}
          >
            {formatPost ? "(show me more!)" : "(hide the rest)"}
          </button>
        </>
      );
      const formattedPost = postToFormat.slice(0, 100);
      return (
        <>
          {formatPost ? formattedPost + "..." : postToFormat}
          <br />
          {revealButton}
        </>
      );
    }
    return postToFormat;
  };

  return (
    <article data-cy="post" key={post._id} className="post">
      <div className="messageContainer">
        
        <div className="messageContent">
          <div className="postText">
            <strong><a href={`/profile/${user._id}`}>{`@${user.username}`}</a></strong>
            <br />
          </div>
          {post.photo !== "" && (
            <img className="postimg"
              src={`http://localhost:8080/images/${post.photo}`}
              alt={"image"}
            />
          )}
          
          <div className="postContent">{postFormatter(post.message)}</div>
          <div className="reactButtons">
            {likes}
            <button
              className="emoji-buttons"
              data-cy="heartButton"
              id="heartButton"
              onClick={() => likePost("heart")}
            >
              &#x1F49A;
            </button>
            <button
              className="emoji-buttons"
              data-cy="fireButton"
              id="fireButton"
              onClick={() => likePost("fire")}
            >
              &#x1F525;
            </button>
            <button
              className="emoji-buttons"
              data-cy="angryButton"
              id="angryButton"
              onClick={() => likePost("angry")}
            >
              &#x1F621;
            </button>
          </div>
          <div className="revealLikes">
            &#x1F49A;: {formattedLikes.hearts}
            &#x1F525;: {formattedLikes.fires}
            &#x1F621;: {formattedLikes.angrys}
          </div>
          <div className="timestamp">{dateTimeAgo} </div>
          {deleteButtonView && (
            <span
              data-cy="deleteButton"
              className="material-symbols-outlined"
              onClick={confirmDeletePost}
            >
              delete
            </span>
          )}
        </div>
        <button className="commentButton" onClick={showComments}>
          Comments
        </button>
      </div>
      {commentsView && (
        <div display="none">
          <Comments
            display={commentsView}
            token={token}
            setToken={setToken}
            post_id={post_id}
          />
        </div>
      )}
    </article>
  );
};

export default Post;
