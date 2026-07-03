import { useState } from "react";
import "../styles/UserInfo.css";

function UserInfo({ user, updateIncome, remainingBudget }) {
  const [income, setIncome] = useState("");
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    updateIncome(income);
    setIncome("")
  }

  return (
    <div className="card user-info">
      <div className="income">{user.income ? `Income: $${user.income}` : `Income: $0`}</div>
      <div className="budget-total">Remaining Total Budget: ${remainingBudget}</div>
      <form onSubmit={handleSubmit}>
        <input
            type="number"
            min="0"
          placeholder="User Income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
        <button className="btn" type="submit">
          Submit new income for {user.username}
        </button>
      </form>
    </div>
  );
}

export default UserInfo;
