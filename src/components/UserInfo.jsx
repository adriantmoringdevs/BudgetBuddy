import { useState } from "react";
import { formatMoney } from "../utils/format";
import "../styles/UserInfo.css";

function UserInfo({ user, updateIncome, remainingBudget }) {
  const [income, setIncome] = useState("");
  const [error, setError] = useState(null);
  const overBudget = remainingBudget < 0;

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    updateIncome(income);
    setIncome("");
  }

  return (
    <section className="user-info">
      <div className="card stat-card">
        <span className="label">Monthly income</span>
        <div className="amount stat-amount">{formatMoney(user.income)}</div>
      </div>
      <div className={`card stat-card stat-card-hero ${overBudget ? "over" : ""}`}>
        <span className="label">
          {overBudget ? "Over budget" : "Left to budget"}
        </span>
        <div className="amount stat-amount">{formatMoney(remainingBudget)}</div>
      </div>
      <div className="card stat-card">
        <label className="label" htmlFor="income">
          Update income
        </label>
        <form className="income-form" onSubmit={handleSubmit}>
          <input
            id="income"
            className="input"
            type="number"
            min="0"
            step="0.01"
            placeholder="$ 0.00"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
          <button className="btn" type="submit">
            Set income
          </button>
        </form>
      </div>
    </section>
  );
}

export default UserInfo;
