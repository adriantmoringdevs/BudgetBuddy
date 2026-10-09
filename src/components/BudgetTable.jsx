import "../styles/BudgetTable.css";
import { BsTrash3, BsPencil } from "react-icons/bs";
import { formatMoney } from "../utils/format";

function BudgetTable({ budgetItems, editItem, deleteItem, openForm }) {
  return (
    <section className="card table-card">
      <div className="table-card-head">
        <h2>Budget items</h2>
        <button className="btn btn-accent" onClick={openForm}>
          + Add budget item
        </button>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <colgroup>
            <col className="col-name" />
            <col className="col-category" />
            <col className="col-bucket" />
            <col className="col-amount" />
            <col className="col-fixed" />
            <col className="col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Bucket</th>
              <th scope="col" className="num">Amount</th>
              <th scope="col">Fixed</th>
              <th scope="col" className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  No budget items yet. Add one to start giving your dollars a job.
                </td>
              </tr>
            )}
            {budgetItems.map((item, idx) => {
              const bucket = item.category.subcategory;
              return (
                <tr key={item.id ?? idx}>
                  <th scope="row">{item.name}</th>
                  <td>{item.category.category}</td>
                  <td>
                    <span className={`chip chip-${bucket}`}>{bucket}</span>
                  </td>
                  <td className="num amount">{formatMoney(item.amount)}</td>
                  <td>
                    {item.is_fixed ? (
                      <span className="fixed">Fixed</span>
                    ) : (
                      <span className="variable">Variable</span>
                    )}
                  </td>
                  <td className="actions-col">
                    <span className="actions">
                      <button
                        className="icon-btn"
                        aria-label={`Edit ${item.name}`}
                        onClick={() => editItem(idx)}
                      >
                        <BsPencil />
                      </button>
                      <button
                        className="icon-btn icon-btn-danger"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => deleteItem(item)}
                      >
                        <BsTrash3 />
                      </button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default BudgetTable;
