import { SignInAugument } from "./types";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

interface SignInProps {
  formData: SignInAugument;
}

export const SubmitSignIn = async ({ formData }: SignInProps) => {
  const auth = getAuth();
  const { email, pass } = formData;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (error: any) {
    if (error.code === "auth/invalid-credential") {
      throw new Error("Invalid Email or Password");
    } else {
      throw new Error("Something went wrong, [ " + error.code + " ]");
    }
  }
};

export const SubmitSignOut = async () => {
  const auth = getAuth();
  return await signOut(auth);
};
