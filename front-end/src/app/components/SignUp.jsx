'use client';
import { useState } from 'react';

export default function SignUp() {
  const [role, setRole] = useState('general'); // 'general', 'oso' or 'employee'
  
  // Unified state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Role-specific fields
  const [orgName, setOrgName] = useState(''); // Only for OSO
  const [inviteCode, setInviteCode] = useState(''); // Only for Employee
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (role === 'oso' && !orgName) {
       setError("Organization Name is required to register a new organization.");
       setLoading(false);
       return;
    }

    if (role === 'employee' && !inviteCode) {
       setError("An Organization Invite Code is required for employees.");
       setLoading(false);
       return;
    }

    try {
      const payload = {
        role,
        email,
        password,
        ...(role === 'oso' ? { orgName } : role === 'employee' ? { inviteCode } : {})
      };

      console.log('Sending signup request...', payload);
      // alert('Sign Up payload sent - check console');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <div>
        <label>Select Role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="general">CipherNet General User</option>
          <option value="employee">Internal Secure End (Employee)</option>
          <option value="oso">Organization Security Officer</option>
        </select>
      </div>

      <br/>

      {role === 'oso' ? (
        <div>
          <label>Organization Name (Creating New Org)</label>
          <input 
            type="text" 
            value={orgName} 
            onChange={(e) => setOrgName(e.target.value)} 
          />
        </div>
      ) : role === 'employee' ? (
        <div>
          <label>Organization Invite Code</label>
          <input 
            type="text" 
            value={inviteCode} 
            onChange={(e) => setInviteCode(e.target.value)} 
          />
        </div>
      ) : null}

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
      <div>
        <label>Confirm Password</label>
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Sign Up'}
      </button>
    </form>
  );
}
