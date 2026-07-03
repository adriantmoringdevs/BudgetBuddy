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
    "Utilties": "needs",
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
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              name="page"
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category-select"
              value={category}
              onChange={handleChange}
            >
              <option value="" disabled>
                --Please choose a category--
              </option>
              {Object.keys(categories).map((cat, index) => (
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
              key={itemToEdit?.id || "new-item"}
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

export default Modal;
