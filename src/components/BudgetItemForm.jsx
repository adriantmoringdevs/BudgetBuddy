import { useState } from "react";
import "../styles/BudgetItemForm.css";

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
      className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeForm();
      }}
    >
      <div className="form">
        Add Budget Item
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Choose Category</label>
            <select
              id="category-select"
              value={category}
              onChange={handleChange}
            >
              <option value="" disabled>
                --Please choose a category--
              </option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              min="0"
              max={remainingBudget}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="isFixed">Is Fixed</label>
            <input
              type="checkbox"
              checked={isFixed}
              onChange={handleCheckBoxChange}
            />
          </div>
          <button type="submit" className="btn">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default BudgetItemForm;
