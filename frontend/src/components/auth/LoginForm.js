import React, { useState } from 'react';
import PropTypes from 'prop-types'

const LogInForm = ({ navigate }) => {

  LogInForm.propTypes = {
    navigate: PropTypes.func
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [UserDoesntExsistsErrorMessage, setUserDoesntExsistsErrorMessage] = useState('');
  const [EmptyFieldErrorMessage, setEmptyFieldErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault();

    let response = await fetch( '/tokens', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password })
    })

    if (email === '' || password === ''){
      console.log('empty field')
      navigate('/login')
      setEmptyFieldErrorMessage('Please enter both your password and email')
    } else if (response.status !== 201) {
      console.log("oop")
      navigate('/login')
      setUserDoesntExsistsErrorMessage('This user is not registered - please signup first')
    } else{
      console.log("yay")
      let data = await response.json()
      window.localStorage.setItem("token", data.token)
      window.localStorage.setItem("user_id", data.user_id)
      navigate('/posts');
    }
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleError = () => {
    setEmptyFieldErrorMessage('')
    setUserDoesntExsistsErrorMessage('')
  }


    return (
      <div>
        <div className='content-login'>
          Login
        </div>
        <div className='errorMessages'>
        {UserDoesntExsistsErrorMessage && (<p className="error"> {UserDoesntExsistsErrorMessage} </p>)}
              {EmptyFieldErrorMessage && (<p className="error"> {EmptyFieldErrorMessage} </p>)}
        </div>
        <form onSubmit={handleSubmit}>
          <input placeholder='Email' id="email" type='text' value={ email } onChange={handleEmailChange} onClick={handleError}/>
          <input placeholder='Password' id="password" type='password' value={ password } onChange={handlePasswordChange} onClick={handleError}/>
          <input role='submit-button' id='submit' type="submit" value="Submit" />
        </form>
        <div className='content'>Not a user?<a href='./signup'>&nbsp;Signup here</a></div>
      </div>

    );
}

export default LogInForm;
