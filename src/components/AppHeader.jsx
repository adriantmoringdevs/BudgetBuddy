import { useUser } from "../context/UserContext";
import Wordmark from "./Wordmark";
import "../styles/AppHeader.css";

function AppHeader() {
  const { user, logout } = useUser();

  return (
    <header className="app-header">
      <Wordmark size={34} />
      <div className="app-header-user">
        <span className="app-header-name">{user.username}</span>
        <span className="avatar" aria-hidden="true">
          {user.username.charAt(0).toUpperCase()}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
