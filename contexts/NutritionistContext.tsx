import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Nutritionist } from '@/types/chat';
import { getCurrentUser } from '@/lib/appwrite';

interface NutritionistContextType {
  nutritionist: Nutritionist | null;
  setNutritionist: (nutritionist: Nutritionist | null) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const NutritionistContext = createContext<NutritionistContextType | undefined>(undefined);

export function NutritionistProvider({ children }: { children: React.ReactNode }) {
  const [nutritionist, setNutritionist] = useState<Nutritionist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        // TODO: Fetch nutritionist data based on user ID
        // For now, we'll just set authenticated state
      } else {
        setIsAuthenticated(false);
        setNutritionist(null);
        // Redirect to login if not in login page
        if (!router.canGoBack()) {
          router.replace('/(root)/(ahligizi)' as any);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setNutritionist(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    nutritionist,
    setNutritionist,
    isLoading,
    isAuthenticated
  };

  return (
    <NutritionistContext.Provider value={value}>
      {children}
    </NutritionistContext.Provider>
  );
}

export function useNutritionist() {
  const context = useContext(NutritionistContext);
  if (context === undefined) {
    throw new Error('useNutritionist must be used within a NutritionistProvider');
  }
  return context;
}
