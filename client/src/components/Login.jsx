import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"


function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // New state for error message
  const navigate = useNavigate();

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        console.log({username});
        navigate('/invoiceGenerator');
      } else {
        setError('Incorrect username or password'); // Set error message
      }
    } catch (error) {
      // Handle error
      setError('An error occurred. Please try again.'); // Set error message for other errors
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <input
        className="input-field"
        type="text"
        placeholder="Username"
        value={username}
        onChange={event => setUsername(event.target.value)}
      />
      <input
        className="input-field"
        type="password"
        placeholder="Password"
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <button className="login-button" type="submit">Login</button>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
    </form>
  );
}

export default LoginForm;
