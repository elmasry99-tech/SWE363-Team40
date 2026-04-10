'use client';
import { Shield, Lock, Users, UserCog, User } from 'lucide-react';

export default function RoleSelection({ onRoleSelect }) {
  const roles = [
    {
      id: 'oso',
      name: 'Organization Security Officer',
      description: 'Create and manage a new organization',
      icon: UserCog,
      color: 'from-blue-600 to-blue-700',
      borderColor: 'border-blue-500'
    },
    {
      id: 'employee',
      name: 'Internal Secure End-User',
      description: 'Join an existing organization with invite code',
      icon: Users,
      color: 'from-green-600 to-green-700',
      borderColor: 'border-green-500'
    },
    {
      id: 'general',
      name: 'General User',
      description: 'Standard platform access',
      icon: User,
      color: 'from-orange-600 to-orange-700',
      borderColor: 'border-orange-500'
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-slate-900 to-black">
      <div className="w-full max-w-4xl">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">CypherNet</h1>
          <p className="text-slate-400 text-lg">Secure Messaging System</p>
          <p className="text-slate-500 text-sm mt-4">Select your role to get started</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map(role => {
            const IconComponent = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => onRoleSelect(role.id)}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 bg-white hover:shadow-2xl hover:-translate-y-1 ${role.borderColor} relative overflow-hidden`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} mb-4`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 text-left mb-2">{role.name}</h3>
                  <p className="text-sm text-slate-600 text-left">{role.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Demo Mode - All roles available for exploration
          </p>
        </div>
      </div>
    </div>
  );
}
