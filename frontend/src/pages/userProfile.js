import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from "../components/post/Post";
import './user.css'
import PropTypes from 'prop-types'

const image = require('./images/image.png') // adds image

const UserProfile = ({ navigate }) => {

  UserProfile.propTypes = {
    navigate: PropTypes.func
  }

  const [posts, setPosts] = useState([])
  const [user, setUser] = useState({});
  const [description, setDescription] = useState("");
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const current_user_id = window.localStorage.getItem('user_id')
  const { id } = useParams();
  
  useEffect(() => {
    if(token) {
      fetch("/users", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User_ID': `${id}`
        }
      })
        .then(response => response.json())
        .then(async data => {
          window.localStorage.setItem("token", data.token)
          setToken(window.localStorage.getItem("token"))
          setUser(data.user);
        })
    }
  }, [])

  useEffect(() => {
    if(token) {
      fetch("/posts/user/", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User_ID': `${id}`
        }
      })
        .then(response => response.json())
        .then(async data => {
          window.localStorage.setItem("token", data.token)
          setToken(window.localStorage.getItem("token"))
          setPosts(data.posts);
        })
    }
  }, [])

  const logout = () => {
    window.localStorage.removeItem("token")
    navigate('/login')
  }

  const feed = () => {
    navigate('/posts')
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    
    let response = await fetch(`/users/${user._id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: description })
    })
    
    let data = await response.json()

    if (response.status !== 201) {
      console.log("description NOT added")

    } else {
      console.log("description added")
      window.localStorage.setItem("token", data.token)
      setToken(window.localStorage.getItem("token"))
      setDescription("")

      if (token) {
        fetch("/users", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User_ID': `${id}`
          }
        })
          .then((response) => response.json())
          .then(async (data) => {
            window.localStorage.setItem("token", data.token)
            setToken(window.localStorage.getItem("token"))
            setUser(data.user);
          })
      }
    }
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const personalProfile = current_user_id === user._id
  const personalApos = personalProfile ? `Your` : `${user.username}'s`
  const personal = personalProfile ? `you` : `${user.username}`

  
  return (
    <>
    <nav id="nav"> 
      <h1>acebook</h1>      
      <h2 data-cy="user">{`${personalApos} profile!`}</h2>
      <div>
        <button onClick={feed}>Feed</button>
        <button onClick={logout}>Logout</button>
      </div>
    </nav> 
    <div className="profilecontainer">
    <div className='profilecontent'>
    <div className="img" > 
      <img src={image} alt="dp1" /> 
    </div>
    <div className="aboutyou">
      <h3> {`about ${personal}`} </h3>
        <div>
          {user.description}
        </div>
      { personalProfile && <div className='aboutyouform'>
        <form onSubmit={handleSubmit}>
        <textarea placeholder="About you: DOB, Occupation, Relationship Status, Hobbies..." id="description" type='text' value={ description } onChange={handleDescriptionChange} />
        <button data-cy="submitButton" id="submitButton" type="submit" value="Submit">Submit</button>
      </form>
      </div> }
    </div>
    </div>
    </div>
    <div className="center">
      <h3> {`${personalApos} posts`} </h3>
    </div>
    
    <div data-cy="post">
          {posts.map((post) => <Post post={post} token={token} setToken={setToken} key={post._id} post_id={post._id} setPosts={setPosts} profile ={true}/>).reverse()}
    </div>
    </>
  );

};

export default UserProfile;