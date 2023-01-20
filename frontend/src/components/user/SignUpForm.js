import React, { useState } from 'react';
import PropTypes from "prop-types"

const SignUpForm = ({ navigate }) => {

  SignUpForm.propTypes = {
    navigate: PropTypes.func,
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [UserExsistsErrorMessage, setUserExsistsErrorMessage] = useState('');
  const [EmptyFieldErrorMessage, setEmptyFieldErrorMessage] = useState('')
  const [GeneralErrorMessage, setGeneralErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();

    fetch( '/users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password, username: username })
    })
      .then(response => {
        if(response.status === 201) {
          console.log(response.body)
          navigate('/login')
        } else if (email === '' || password === '' || username === '') {
          console.log(response.body)
          setEmptyFieldErrorMessage('All fields are required - please try again')

        } else if (response.status === 400){
          console.log(response.body)
          navigate('/signup');
          setUserExsistsErrorMessage('That user already exists - Please create a new account or login');
          console.log(response.json().error)
        } else {
          console.log(response)
          navigate('/signup');
          setGeneralErrorMessage("Oops that didn't work. Please try again")
        }
      })
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handleError = () => {
    setGeneralErrorMessage('')
    setUserExsistsErrorMessage('')
    setEmptyFieldErrorMessage('')

  }


    return (
    <>
      <div className="titlecenter">
        <h2 className='title'>  Welcome to acebook! </h2>
        <div className='content'>Already have an account? </div>
        <a className='content' href="../login">login here</a>
      </div>

      <div className="signupform">
      <div className='content'>Signup here!</div>
      <div className='errorMessages'>
              {UserExsistsErrorMessage && (<p className="error"> {UserExsistsErrorMessage} </p>)}
              {EmptyFieldErrorMessage && (<p className="error"> {EmptyFieldErrorMessage} </p>)}
              {GeneralErrorMessage && (<p className="error"> {GeneralErrorMessage} </p>)}
            </div>
        <form onSubmit={handleSubmit}>
            <input placeholder="Email" id="email" type='text' value={ email } onChange={handleEmailChange} onClick={handleError} />
            <input placeholder="Password" id="password" type='password' value={ password } onChange={handlePasswordChange} onClick={handleError}  />
            <input placeholder="Username" id="username" type='text' value={ username } onChange={handleUsernameChange} onClick={handleError}  />
          <input id='submit' type="submit" value="Submit" />
        </form>
      </div>
      </>
    );
}

export default SignUpForm;
