import { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";
import LoginSignup from "./components/LoginSignup";
import UserInfo from "./components/UserInfo";
import PercentDisplay from "./components/PercentDisplay";
import BudgetTable from "./components/BudgetTable";
import BudgetItemForm from "./components/BudgetItemForm";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const { user, updateIncome } = useUser();
  const [formOpen, setFormOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [budgetItems, setBudgetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [remainingBudget, setRemainingBudget] = useState(0);

  useEffect(() => {
    if (!user) {
      setBudgetItems([]);
      return;
    }
    fetch("/api/expenses")
      .then((r) => r.json())
      .then((data) => {
        setBudgetItems(data);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!budgetItems) {
      setTotals(null);
      return;
    }
    const category_map = { needs: 0, wants: 0, savings: 0 };
    for (const item of budgetItems) {
      category_map[item.category.subcategory] =
        category_map[item.category.subcategory] + Number(item.amount);
    }
    setTotals(category_map);
    setRemainingBudget(
      Number(user?.income) -
        (category_map.needs + category_map.wants + category_map.savings),
    );
  }, [budgetItems]);

  function addBudgetItem(newItem) {
    setBudgetItems((prevItems) => [...prevItems, newItem]);
  }

  function handleEditItem(idx) {
    setItemToEdit(idx);
    setModalOpen(true);
  }

  function handleDeleteItem(itemToDelete) {
    fetch("/api/expenses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(itemToDelete),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Expense deletion failed");
      })
      .then(() => {
        setBudgetItems((prevItems) =>
          prevItems.filter((item) => item.id != itemToDelete.id),
        );
      })
      .catch((err) => {
        console.error("Error deleting item:", err);
      });
  }

  function saveEditedItem(item) {
    fetch("/api/expenses", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`Failed to updated item ${item.id}`);
      })
      .then((data) => {
        setBudgetItems((prevItems) =>
          prevItems.map((item) => (item.id === data.id ? data : item)),
        );
      });
  }

  return (
    <div className="App">
      <LoginSignup />
      {user && <p className="greeting">Hello, {user.username}!</p>}
      {user && (
        <UserInfo
          user={user}
          updateIncome={updateIncome}
          remainingBudget={remainingBudget}
        />
      )}
      {user && totals && <PercentDisplay totals={totals} user={user} />}
      {/* {user && editedItems.length > 0 && (
        <button className="btn" onClick={saveEditedItems}>
          Save Budget Changes
        </button>
      )} */}
      {user && budgetItems.length > 0 && (
        <BudgetTable
          budgetItems={budgetItems}
          addBudgetItem={addBudgetItem}
          editItem={handleEditItem}
          deleteItem={handleDeleteItem}
        />
      )}
      {user && (
        <button className="btn" onClick={() => setFormOpen(true)}>
          Add
        </button>
      )}
      {user && formOpen && (
        <BudgetItemForm
          addBudgetItem={addBudgetItem}
          remainingBudget={remainingBudget}
          closeForm={() => {
            setFormOpen(false);
          }}
        />
      )}
      {user && modalOpen && (
        <Modal
          saveEditedItem={saveEditedItem}
          remainingBudget={remainingBudget}
          closeModal={() => {
            setModalOpen(false);
          }}
          itemToEdit={itemToEdit !== null && budgetItems[itemToEdit]}
        />
      )}
    </div>
  );
}

export default App;
