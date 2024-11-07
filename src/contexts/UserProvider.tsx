import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doSignOut } from "../firebase/auth";

interface UserContextType {
  user: string | null;
  getUser: (userId: string | number) => void;
  removeUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  getUser: () => {},
  removeUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  const getUser = (userId: string | number) => {
    setUser(String(userId));
  };

  const removeUser = async () => {
    doSignOut();
    setUser(null);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, getUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
