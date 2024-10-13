import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0tjlCJkunklIsUMnk01a-s1ks2ZgorQI",
  authDomain: "campnest-b3ece.firebaseapp.com",
  projectId: "campnest-b3ece",
  storageBucket: "campnest-b3ece.appspot.com",
  messagingSenderId: "364853041945",
  appId: "1:364853041945:web:5e6ede6748a49f59920388",
  measurementId: "G-1LL0Q10MXR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
