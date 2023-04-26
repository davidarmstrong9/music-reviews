'use client';
import styles from './Login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  password: string;
}

interface LoginProps {
  initialUsername: string;
  initialPassword: string;
  onLogin: () => void;
}

interface Data {
  items: User[];
}

export default function Login({ initialUsername, initialPassword, onLogin }: LoginProps) {
  const [user, setUser] = useState<User>({ username: initialUsername, password: initialPassword });
  const [loggedInUser, setLoggedInUser] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch(`http://127.0.0.1:8090/api/collections/userbase/records?username=${user.username}&password=${user.password}`);
    const data: Data = await response.json();

    const matchingUser = data.items.find((item: User) => item.username === user.username && item.password === user.password);

    if (matchingUser) {
      setLoggedInUser(user.username);
      onLogin(); // Call the onLogin callback
    } else {
      alert('Invalid login credentials');
    }

    setUser({ username: '', password: '' });
  };

  const handleLogout = () => {
    setLoggedInUser('');
  };



  return (
    <div className={styles['form-wrapper']}>
      <div className={styles['form-container']}>
        <form onSubmit={handleSubmit}>
          <h3>Login</h3>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button type="submit">Login</button>
        </form>
        {loggedInUser && (
          <div>
            <p>Logged in as {loggedInUser}!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
