'use client';
import { useState } from 'react';
import Login from '../components/Login.jsx';
import SignUp from '../components/SignUp.jsx';
import RoleSelection from '../components/RoleSelection.jsx';
  
export default function AuthPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  // If no role selected, show role selection
  if (!selectedRole) {
    return <RoleSelection onRoleSelect={setSelectedRole} />;
  }

  return (
    <div className="min-h-screen">
      {isLogin ? (
        <Login 
          role={selectedRole}
          onSwitchToSignUp={() => setIsLogin(false)}
          onChangeRole={() => setSelectedRole(null)}
        />
      ) : (
        <SignUp 
          role={selectedRole}
          onSwitchToLogin={() => setIsLogin(true)}
          onChangeRole={() => setSelectedRole(null)}
        />
      )}
    </div>
  );
}
