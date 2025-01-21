import { getAuth, onAuthStateChanged } from "firebase/auth";
import { SubmitSignIn, SubmitSignOut } from "./functions";
import { AuthContextType, CurrentUserType, SignInAugument } from "./types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading from "@/components/Loading";

export const AuthContext = createContext({} as AuthContextType);
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUserType>();

  const SignIn = (formData: SignInAugument) => {
    return SubmitSignIn({ formData });
  };

  const SignOut = () => {
    return SubmitSignOut();
  };

  useEffect(() => {
    const auth = getAuth();
    // setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || "",
          providerId: user.providerId,
          photoURL: user.photoURL || "",
          emailVerified: user.emailVerified,
          displayName: user.displayName || "",
        });
      } else {
        setCurrentUser(undefined);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = { loading, currentUser, SignIn, SignOut };

  return (
    <AuthContext.Provider value={value}>
      <AuthContext.Consumer>
        {({ loading }) => (loading ? <Loading /> : children)}
      </AuthContext.Consumer>
    </AuthContext.Provider>
  );
};
