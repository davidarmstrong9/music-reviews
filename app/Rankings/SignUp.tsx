'use client';
import styles from './SignUp.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Login from './LogIn';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  const router = useRouter();

  const signUp = async() => {
    await fetch('http://127.0.0.1:8090/api/collections/userbase/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    setUsername('');
    setPassword('');
    setSignedUp(true);
  }

  const handleLogin = () => {
    router.push('/login');
  }

  return (
    <div className={styles['form-wrapper']}>
      <div className={styles['form-container']}>
        {!signedUp && (
          <form onSubmit={signUp}>
            <h3>Sign Up</h3>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </form>
        )}
        {signedUp && (
          <>
            <p>Successfully signed up as {username}!</p>
            <Login
              initialUsername={username}
              initialPassword={password}
              onLogin={handleLogin}
            />
          </>
        )}
      </div>
    </div>
  );
}
