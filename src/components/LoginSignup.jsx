import {useState} from "react"
import {useUser} from "../context/UserContext"
import "../styles/LoginSignup.css"


function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const {user, signup, login, logout} = useUser()

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const authFunction = isLogin ? login : signup
    const result = await authFunction(username)
    if (!isLogin) {
      setSuccess(result.message)
    }
    setUsername("")
  }

  return (
    <>
      <h1 className="app-header">BudgetBuddy</h1>

      {!user && (
        <>
          <div className="toggle-container">
            <button className={`login ${isLogin ? "active" : ""}`} onClick={() => {setIsLogin(true); setSuccess(null);}}>Login</button>
            <button className={`signup ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
                Sign Up
            </button>
         </div>

          <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn" type="submit">
                {isLogin ? "Login" : "Signup"}
            </button>
          </form>
          {success && <p className="success-message" >{success}</p>}
          </div>
        </>
      )}

      {user && <button className="btn" onClick={logout}>Logout</button>}
    </>
  );
}

export default LoginSignup;
