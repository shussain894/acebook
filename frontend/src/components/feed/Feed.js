import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import PostForm from "../postForm/PostForm";
import PropTypes from "prop-types";
import "./Feed.css";

const Feed = ({ navigate }) => {
  Feed.propTypes = {
    navigate: PropTypes.func,
  };
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const user_id = window.localStorage.getItem("user_id");
  const [user, setUser] = useState({});

  useEffect(() => {
    if (token) {
      fetch("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          window.localStorage.setItem("token", data.token);
          setToken(window.localStorage.getItem("token"));
          setPosts(data.posts);
        });
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          User_ID: `${user_id}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          setUser(data.user);
        });
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  const profilePage = () => {
    navigate(`/profile/${user_id}`);
  };

  if (token) {
    return (
      <>
        <nav className="navbar" id="nav">
          <h1>acebook</h1>
          <h2>Posts</h2>
          <div>
            <button onClick={profilePage}>Profile</button>
            <button onClick={logout}>Logout</button>
          </div>
        </nav>
        <div className="welcome">Welcome {user.username}!</div>
        <PostForm setPosts={setPosts} token={token} setToken={setToken} />
        <div data-cy="feed" id="feed" role="feed">
          {posts
            .map((post) => (
              <Post
                post={post}
                token={token}
                setToken={setToken}
                key={post._id}
                post_id={post._id}
                setPosts={setPosts}
                profile={false}
              />
            ))
            .reverse()}
        </div>
      </>
    );
  } else {
    navigate("/signin");
  }
};

export default Feed;
