import React, { createContext, ReactNode,useContext, useState } from 'react';

interface AuthModalContextType {
  showLogin: boolean;
  showSignup: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  openSignup: () => void;
  closeSignup: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const closeLogin = () => setShowLogin(false);

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const closeSignup = () => setShowSignup(false);

  return (
    <AuthModalContext.Provider
      value={{
        showLogin,
        showSignup,
        openLogin,
        closeLogin,
        openSignup,
        closeSignup,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

