import { useState } from "react";
import { useUser } from "../context/UserContext";
import Wordmark from "./Wordmark";
import "../styles/LoginSignup.css";

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { signup, login } = useUser();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const authFunction = isLogin ? login : signup;
    const result = await authFunction(username);
    if (!isLogin) {
      setSuccess(result.message);
    }
    setUsername("");
  }

  function showLogin() {
    setIsLogin(true);
    setSuccess(null);
  }

  function showSignup() {
    setIsLogin(false);
  }

  return (
    <main className="auth">
      <div className="auth-brand">
        <h1>
          <Wordmark size={64} />
        </h1>
        <p className="auth-tagline">Give every dollar a job.</p>
      </div>

      <div className="toggle-container" role="tablist">
        <button
          role="tab"
          aria-selected={isLogin}
          className={isLogin ? "active" : ""}
          onClick={showLogin}
        >
          Log in
        </button>
        <button
          role="tab"
          aria-selected={!isLogin}
          className={!isLogin ? "active" : ""}
          onClick={showSignup}
        >
          Sign up
        </button>
      </div>

      <div className="card auth-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="e.g. atmporkandbeans"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-block" type="submit">
            {isLogin ? "Log in" : "Sign up"}
          </button>
        </form>
        {success && <p className="success-message">{success}</p>}
      </div>

      <p className="auth-footer">
        {isLogin ? (
          <>
            New here?{" "}
            <button className="link-btn" onClick={showSignup}>
              Create an account
            </button>{" "}
            — it takes 30 seconds.
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button className="link-btn" onClick={showLogin}>
              Log in
            </button>
          </>
        )}
      </p>
    </main>
  );
}

export default LoginSignup;
