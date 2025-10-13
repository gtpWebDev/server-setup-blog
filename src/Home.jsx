import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h3>Home Page</h3>
      <p>
        <Link to="register">Register here</Link>
      </p>
      <p>
        <Link to="login">Login here</Link>
      </p>
    </div>
  );
}

export default Home;
