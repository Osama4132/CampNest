import {
  doCreateUserWithEmailAndPassword,
  doSignOut,
  doSignInWithEmailAndPassword,
  doResetPassword,
} from "../firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  const handleRegister = async (e) => {
    const formData = new FormData(e.target);
    e.preventDefault();
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      username: formData.get("username"),
    };
    console.log(data);
    const { email, password, username } = data;
    const response = await doCreateUserWithEmailAndPassword(email, password);
    console.log(response);
  };
  const handleLogin = async (e) => {
    const formData = new FormData(e.target);
    e.preventDefault();
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    console.log(data);
    const { email, password } = data;
    await doSignInWithEmailAndPassword(email, password);
    console.log("Signed in!");
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    const email = 
  e.target
  [0].value;
    doResetPassword(email);
  }; 
  

  const handleLogout = () => {
    doSignOut();
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <>
      <form onSubmit={handleRegister}>
        <h1>Register</h1>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" />
        <br />
        <label htmlFor="username">username</label>
        <input type="username" name="username" />
        <br />
        <label htmlFor="password">password</label>
        <input type="password" name="password" />
        <br />
        <button>Submit</button>
      
  </form>

  <form onSubmit={handleLogin}>
  <h1>Login</h1>
  <label htmlFor="email">Email</label>
  <input type="email" name="email" />
  <br />
  <label htmlFor="password">password</label>
  <input type="password" name="password" />
  <br />
  <button>Submit</button>
</form>

  <form onSubmit={handleForgetPassword}>
  <label htmlFor="email">email</label>
  <input type="email" name="email" />
  <button>Reset Password</button>
</form>; 
      <div>{user ? <h1>LOGGED IN!</h1> : <h1>NOT LOGGED IN</h1>}</div>
    </>
  );
}
