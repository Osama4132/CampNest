import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doSignOut } from "../firebase/auth";
import axios from "axios";
import { useToast } from "./ToastProvider";

interface UserContextType {
  user: string | null;
  getUser: (userId: string | number, email: string | number) => void;
  removeUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  getUser: () => {},
  removeUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const showToast = useToast()

  const getUser = (userId: string | number) => {
    setUser(String(userId));
    console.log("context user:", user);
  };

  const removeUser = async () => {
    doSignOut();
    setUser(null);
    showToast("User logged out", "green")
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const response = await axios.get("/api/user/id", {
          params: {email: user.email},
        });
        console.log("API:", response.data)
        setUser(response.data.userId);
      }
    });
  }, []);
  console.log(user)

  return (
    <UserContext.Provider value={{ user, getUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
