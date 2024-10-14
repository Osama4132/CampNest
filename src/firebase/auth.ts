import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await sendEmailVerification(userCredential.user);

  doSignOut();

  return userCredential;
};
export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  if (!userCredential.user.emailVerified) {
    doSignOut();
    throw new Error("Please verify your email before signing in.");
  }

  return userCredential;
};
export const doSignOut = () => {
  return auth.signOut();
};
