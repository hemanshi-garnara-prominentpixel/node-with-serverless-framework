import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type JSX,
} from "react";
import { io, Socket } from "socket.io-client";

interface IAuthContext {
  authenticated: boolean;
  loading: boolean;
  userData: {
    id: string;
    email: string;
    username: string;
    status: string;
  } | null;
  allUsers: { id: string; username: string; status: string }[];
  refreshAuth: () => void;
  socket: Socket | null;
}

const authContext = createContext<IAuthContext>({
  authenticated: false,
  loading: true,
  userData: null,
  allUsers: [],
  refreshAuth: () => {},
  socket: null,
});

const AuthProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<IAuthContext["userData"]>(null);
  const [allUsers, setAllUsers] = useState<IAuthContext["allUsers"]>([]);
  const [socket, setSocket] = useState<IAuthContext["socket"]>(null);

  const checkAuthenticate = async () => {
    try {
      const currentUser = await axios.get(
        "http://localhost:3000/users/currentUser",
        { withCredentials: true }
      );
      setAuthenticated(true);
      setUserData(currentUser.data);
    } catch {
      setAuthenticated(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users initially with status inactive
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users/all", {
        withCredentials: true,
      });
      // Initialize all users with status inactive
      const usersWithStatus = res.data.map((u: any) => ({
        ...u,
        status: "Inactive",
      }));
      setAllUsers(usersWithStatus);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkAuthenticate();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (!userData) return;

    const newSocket = io("http://localhost:4000/");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("userOnline", userData.id);
    });

    // Listen for status updates
    newSocket.on(
      "userStatusUpdate",
      (update: { userId: string; status: string }) => {
        setAllUsers((prev) => {
          // If user exists, update status
          const userExists = prev.some((u) => u.id === update.userId);
          if (userExists) {
            return prev.map((user) =>
              user.id === update.userId
                ? { ...user, status: update.status }
                : user
            );
          } else {
            // If user not in list, add them
            return [
              ...prev,
              { id: update.userId, username: "Unknown", status: update.status },
            ];
          }
        });
      }
    );

    return () => {
      newSocket.disconnect();
    };
  }, [userData]);

  return (
    <authContext.Provider
      value={{
        authenticated,
        loading,
        userData,
        allUsers,
        refreshAuth: checkAuthenticate,
        socket,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(authContext)!;
