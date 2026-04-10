'use client';
import { useState } from 'react';
import Login from '../components/Login.jsx';
import SignUp from '../components/SignUp.jsx';
  
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <h1>{isLogin ? 'Login Page' : 'Sign Up Page'}</h1>
      
      {isLogin ? <Login /> : <SignUp />}

      <div style={{ marginTop: '20px' }}>
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
