
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, AuthState } from "@/types/auth";

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@skyvoyager.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    role: "user",
    createdAt: new Date(),
  },
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => User[];
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setAuthState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("user");
        setAuthState({ ...authState, isLoading: false });
      }
    } else {
      setAuthState({ ...authState, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      // In a real app, you would verify the password here
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    // Check if email is already in use
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      email,
      name,
      role: "user", // New users are always regular users
      createdAt: new Date(),
    };

    setUsers([...users, newUser]);
    
    // Auto login after registration
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    localStorage.setItem("user", JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem("user");
  };

  const getAllUsers = () => {
    return users;
  };

  const addUser = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      createdAt: new Date(),
    };
    
    setUsers([...users, newUser]);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        getAllUsers,
        addUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
