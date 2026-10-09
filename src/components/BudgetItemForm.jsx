import { useState } from "react";
import "../styles/Modal.css";

function BudgetItemForm({ addBudgetItem, closeForm, remainingBudget }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("0");
  const [isFixed, setIsFixed] = useState(false);
  const [error, setError] = useState(null);
  const categories = [
    "Housing",
    "Utilities",
    "Groceries",
    "Transportation",
    "Insurance",
    "Minimum Debt Payments",
    "Dining Out",
    "Shopping",
    "Streaming Services",
    "Travel",
    "Hobbies",
    "Upgraded Tech",
    "Emergency Fund",
    "Retirement Savings",
    "Investments",
    "Extra Debt Principal",
  ];

  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  const handleCheckBoxChange = () => {
    setIsFixed((prevValue) => !prevValue);
  };

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const item = {
      name: name,
      category: category,
      amount: amount,
      is_fixed: isFixed,
    };

    fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(item),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("New budget expense post failed.");
      })
      .then((data) => addBudgetItem(data));
    closeForm();
  }

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeForm();
      }}
    >
      <div className="card modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Add budget item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="item-name">Name</label>
            <input
              id="item-name"
              type="text"
              placeholder="e.g. Rent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="category-select">Category</label>
            <select
              id="category-select"
              value={category}
              onChange={handleChange}
            >
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              min="0"
              max={remainingBudget}
              step="0.01"
              placeholder="$ 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group checkbox-row">
            <input
              id="isFixed"
              type="checkbox"
              checked={isFixed}
              onChange={handleCheckBoxChange}
            />
            <label htmlFor="isFixed">Fixed amount each month</label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={closeForm}>
              Cancel
            </button>
            <button type="submit" className="btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetItemForm;
