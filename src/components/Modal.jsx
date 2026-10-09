import "../styles/Modal.css";
import { useState, useEffect } from "react";

function Modal({ closeModal, saveEditedItem, itemToEdit, remainingBudget }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isFixed, setIsFixed] = useState(false);
  const [error, setError] = useState(null);

  const categories = {
    "Housing": "needs",
    "Utilities": "needs",
    "Groceries": "needs",
    "Transportation": "needs",
    "Insurance": "needs",
    "Minimum Debt Payments": "needs",
    "Dining Out": "wants",
    "Shopping": "wants",
    "Streaming Services": "wants",
    "Travel": "wants",
    "Hobbies": "wants",
    "Upgraded Tech": "wants",
    "Emergency Fund": "savings",
    "Retirement Savings": "savings",
    "Investments": "savings",
    "Extra Debt Principal": "savings"
  }

  useEffect(() => {
    setName(itemToEdit["name"]);
    setCategory(itemToEdit.category.category);
    setAmount(itemToEdit["amount"]);
    setIsFixed(itemToEdit.is_fixed);
  }, [itemToEdit]);

  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  const handleCheckBoxChange = () => {
    setIsFixed((prevValue) => !prevValue);
  };

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    itemToEdit.name = name;
    itemToEdit.category.category = category;
    itemToEdit.category.subcategory = categories[category]
    itemToEdit.amount = amount;
    itemToEdit.is_fixed = isFixed
    saveEditedItem(itemToEdit);
    closeModal();
  }

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="card modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Edit budget item</h2>
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
              {Object.keys(categories).map((cat, index) => (
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
              key={itemToEdit?.id || "new-item"}
              id="isFixed"
              type="checkbox"
              checked={isFixed}
              onChange={handleCheckBoxChange}
            />
            <label htmlFor="isFixed">Fixed amount each month</label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={closeModal}>
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

export default Modal;
