import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CommentForm from '../commentForm/CommentForm'

const Comments = ({ token, setToken, post_id }) => {

  Comments.propTypes = {
    token: PropTypes.string,
    setToken: PropTypes.func,
    post_id: PropTypes.string
  }

  const [comments, setComments] = useState([])

  useEffect(() => {
    if (token) {
      fetch("/comments", {
        headers: {
          Authorization: `Bearer ${token}`,
          post_id: `${post_id}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          window.localStorage.setItem("token", data.token);
          setToken(window.localStorage.getItem("token"));
          setComments(data.comments);
        });
    }
  }, []);

  return (
    <div>
      <div data-cy="comment">
        {comments.map((comment) => {
          return <p className="comment-p" key={comment._id}>{comment.text}</p>
        })}
      </div>
      <CommentForm setComments={setComments} token={token} setToken={setToken} post_id={post_id} />
    </div>
  )
}

export default Comments;