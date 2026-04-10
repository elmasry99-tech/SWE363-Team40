'use client';
import { useState } from 'react';

export default function Login() {
  const [loginType, setLoginType] = useState('standard'); // 'standard' or 'guest'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Guest specific
  const [guestCode, setGuestCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (loginType === 'guest' && !guestCode) {
       setError("Guest Code is required to login.");
       setLoading(false);
       return;
    }

    try {
      if (loginType === 'guest') {
         console.log('Sending Guest login request...', { guestCode });
      } else {
         console.log('Sending Standard login request...', { email, password });
      }
      
      // alert('Login payload sent - check console');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Login As: </label>
        <select value={loginType} onChange={(e) => setLoginType(e.target.value)}>
          <option value="standard">Standard User (Email)</option>
          <option value="guest">Guest User (Enter Code)</option>
        </select>
      </div>

      <br/>

      {loginType === 'guest' ? (
        <div>
          <label>Guest Code</label>
          <input 
            type="text" 
            value={guestCode} 
            onChange={(e) => setGuestCode(e.target.value)} 
            placeholder="Enter your guest access code"
          />
        </div>
      ) : (
        <>
          <div>
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
        </>
      )}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}