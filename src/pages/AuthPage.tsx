import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  );

  useEffect(() => {
    if (user && profile && !loading) {
      const redirectPath = profile.role === 'CUSTOMER' ? '/customer' : '/dashboard';
      navigate(redirectPath);
    }
  }, [user, profile, loading, navigate]);

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return <AuthForm mode={mode} onToggleMode={toggleMode} />;
}