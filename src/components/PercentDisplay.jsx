import "../styles/PercentDisplay.css";

function PercentDisplay({ totals, user }) {
    console.log(totals)
  function convertDecimal(num) {
    return `${(num * 100).toFixed(1)}%`;
  }
  return (
    <div className="card percent-display">
      <div className="needs">Needs: {convertDecimal(totals.needs / user.income)}</div>
      <div className="wants">Wants: {convertDecimal(totals.wants / user.income)}</div>
      <div className="savings">Savings: {convertDecimal(totals.savings / user.income)}</div>
    </div>
  );
}

export default PercentDisplay;
