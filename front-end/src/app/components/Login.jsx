'use client';
import { useState } from 'react';
import { Shield, Lock, Mail, KeyRound } from 'lucide-react';

export default function Login({ role, onSwitchToSignUp, onChangeRole }) {
  const [loginType, setLoginType] = useState('standard'); // 'standard' or 'guest'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Guest specific
  const [guestCode, setGuestCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginOptions = [
    { id: 'standard', name: 'Standard Login', description: 'Email & Password', icon: Mail },
    { id: 'guest', name: 'Guest Access', description: 'Enter access code', icon: KeyRound },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (loginType === 'guest' && !guestCode) {
       setError("Guest Code is required to login.");
       setLoading(false);
       return;
    }

    if (loginType === 'standard' && (!email || !password)) {
       setError("Email and password are required.");
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-slate-900 to-black">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CypherNet</h1>
          <p className="text-slate-400">Secure Messaging System</p>
        </div>

        {/* Login Card */}
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

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Login Type Selection */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-slate-600" />
                <label className="text-lg font-semibold text-slate-900">Login Method</label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {loginOptions.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setLoginType(option.id);
                        setError(null);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        loginType === option.id
                          ? 'border-slate-900 bg-slate-100'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 mx-auto mb-2 ${loginType === option.id ? 'text-slate-900' : 'text-slate-400'}`} />
                      <div className="text-sm font-medium text-slate-900">{option.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{option.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Login */}
            {loginType === 'guest' && (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Guest Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={guestCode}
                    onChange={(e) => setGuestCode(e.target.value)}
                    placeholder="Enter your guest access code"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Standard Login */}
            {loginType === 'standard' && (
              <>
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
                
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </>
            )}

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
              {loading ? 'Logging In...' : 'Login'}
            </button>

            <p className="text-xs text-slate-500 text-center">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-slate-900 hover:underline font-medium bg-none border-none cursor-pointer"
              >
                Sign up here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}