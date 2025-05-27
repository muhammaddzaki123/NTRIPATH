import React, { createContext, ReactNode, useContext } from "react";
import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";

import { Models } from 'appwrite';

interface NutritionistProfile {
  specialization: string;
  type: string;
  experience: number;
  rating: number;
  status: 'online' | 'offline';
  available: boolean;
}

interface User extends Models.Document {
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'nutritionist';
  nutritionistProfile?: NutritionistProfile;
}

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => void;
  isNutritionist: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const {
    data: userData,
    loading,
    refetch,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  const user = userData as User | null;

  const isLogged = !!user;
  const isNutritionist = user?.role === 'nutritionist';

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user,
        loading,
        refetch,
        isNutritionist
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
