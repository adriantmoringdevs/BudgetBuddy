import "../styles/PercentDisplay.css";

const BUCKETS = [
  { key: "needs", name: "Needs", goal: 50 },
  { key: "wants", name: "Wants", goal: 30 },
  { key: "savings", name: "Savings", goal: 20 },
];

function PercentDisplay({ totals, user }) {
  function percentOf(total) {
    const income = Number(user.income);
    return income > 0 ? (total / income) * 100 : 0;
  }

  return (
    <section className="percent-display">
      {BUCKETS.map(({ key, name, goal }) => {
        const percent = percentOf(totals[key]);
        // Beating the savings goal is good; only spending buckets go "over".
        const over = key !== "savings" && percent > goal;
        return (
          <div key={key} className={`bucket bucket-${key} ${over ? "over" : ""}`}>
            <div className="bucket-head">
              <span className="bucket-name">{name}</span>
              <span className="bucket-goal">goal {goal}%</span>
            </div>
            <div className="amount bucket-percent">{percent.toFixed(1)}%</div>
            <div
              className="bucket-track"
              role="progressbar"
              aria-label={`${name} vs ${goal}% goal`}
              aria-valuenow={Math.round(percent)}
              aria-valuemin={0}
              aria-valuemax={goal}
            >
              <div
                className="bucket-fill"
                style={{ width: `${Math.min(percent / goal, 1) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default PercentDisplay;
