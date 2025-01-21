// ===============================
// Types of Auth Context
// ===============================

export type SignInAugument = { email: string; pass: string };

export type CurrentUserType = {
  uid: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  photoURL: string;
  providerId: string;
};

export interface AuthContextType {
  loading: boolean;
  currentUser: CurrentUserType | undefined;
  SignOut: () => Promise<void>;
  SignIn: ({}: SignInAugument) => Promise<void>;
}
