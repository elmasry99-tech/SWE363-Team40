'use client';
import { useState } from 'react';
import { Shield, Lock, Mail, KeyRound } from 'lucide-react';

export default function SignUp({ role, onSwitchToLogin, onChangeRole }) {
  const [roleState, setRoleState] = useState(role); // 'general', 'oso' or 'employee'
  
  // Unified state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Role-specific fields
  const [orgName, setOrgName] = useState(''); // Only for OSO
  const [inviteCode, setInviteCode] = useState(''); // Only for Employee
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const roles = [
    { id: 'oso', name: 'Organization Security Officer', description: 'Create a new organization', color: 'from-blue-600 to-blue-700' },
    { id: 'employee', name: 'Internal Secure End-User', description: 'Join with invite code', color: 'from-green-600 to-green-700' },
    { id: 'general', name: 'General User', description: 'Standard platform access', color: 'from-orange-600 to-orange-700' },
  ];

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

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (roleState === 'oso' && !orgName) {
       setError("Organization Name is required to register a new organization.");
       setLoading(false);
       return;
    }

    if (roleState === 'employee' && !inviteCode) {
       setError("An Organization Invite Code is required for employees.");
       setLoading(false);
       return;
    }

    try {
      const payload = {
        role: roleState,
        email,
        password,
        ...(roleState === 'oso' ? { orgName } : roleState === 'employee' ? { inviteCode } : {})
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-slate-900 to-black">
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CypherNet</h1>
          <p className="text-slate-400">Create Your Secure Account</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Role Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm">
              <p className="text-slate-500 text-xs">Selected Role:</p>
              <p className="text-slate-900 font-semibold capitalize">{role.replace('-', ' ')}</p>
            </div>
            <button
              type="button"
              onClick={onChangeRole}
              className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Change Role
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Role Selection */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-slate-600" />
                <label className="text-lg font-semibold text-slate-900">Select Your Role</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setRoleState(r.id);
                      setError(null);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      roleState === r.id
                        ? 'border-slate-900 bg-gradient-to-br ' + r.color + ' text-white'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-900'
                    }`}
                  >
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className={`text-xs mt-1 ${roleState === r.id ? 'text-white/80' : 'text-slate-500'}`}>
                      {r.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Role-Specific Fields */}
            {roleState === 'oso' && (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Organization Name
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Enter organization name"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}

            {roleState === 'employee' && (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Organization Invite Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter your invite code"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-xs text-slate-500 text-center">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-slate-900 hover:underline font-medium bg-none border-none cursor-pointer"
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
