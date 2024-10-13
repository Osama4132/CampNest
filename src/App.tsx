import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
    <h1>Hello, this is the temporary home page</h1>
    <Link to="/register">Redirect to Register</Link>
    </>
  )
}
export default App;
