import { useState } from "react";
import { axiosPost } from "./lib/axiosUtility";
import AuthService from "./lib/AuthService";

import { REGISTER_URI, HEADER_JSON_CONFIG } from "./constants/backendRequests";
import { Navigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [existingUser, setExistingUser] = useState(null);
  const [loginMsg, setLoginMsg] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = { username, password };
    const response = await axiosPost(REGISTER_URI, body, HEADER_JSON_CONFIG);
    if (response.success) {
      const credentials = response.data;
      console.log("received credentials", credentials);
      // store credentials in local storage and update current user
      const authService = new AuthService();
      authService.setLocalStorage(credentials);
      setExistingUser(credentials.user._id);
    } else {
      setLoginMsg(response.error.message);
    }
  };

  return (
    <div>
      {/* User available after successful login, redirect to dashboard */}
      {existingUser && <Navigate to={`/dashboard`} replace={false} />}

      <h3>Register Page</h3>

      <form method="post" onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="text"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <input type="submit" value="Submit" />
        {/* Message for login issues */}
        {loginMsg.length > 0 ? <p>{loginMsg}</p> : <></>}
      </form>
    </div>
  );
};

export default Register;
