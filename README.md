# BudgetBuddy

BudgetBuddy is a budgeting tool built around one idea: build your budget before you try to track spending against it. Instead of logging expenses and hoping a budget falls out of them, you set your income, add your budget items, and the app sorts each one into Needs, Wants, or Savings so you can see the shape of your spending as you go.

## Project history

This started as MoneyMind, a bigger project meant to handle income, monthly expenses, and budget targets all in one app. While building out the expense-tracking side of it, it became clear that the UX had a real problem: I wanted people to track spending against a budget, but building that budget in the first place is its own hard task, and the app wasn't helping with that at all.

So I scaled it down. I scrapped the original front end and rebuilt the project around just the budgeting piece, renamed it BudgetBuddy, and added the Needs/Wants/Savings categorization as a helper so users get some guidance on where their money is going without having to think about it themselves.

## What it does

Categories are seeded ahead of time and each one is mapped to a subcategory (Needs, Wants, or Savings), so users pick from a list rather than categorizing things manually. Users set their income before they can add anything, and a running "leftover budget" number (both as an amount and a percentage) keeps them from over-budgeting. Fixed items (rent, insurance, subscriptions) and variable items are tracked separately, and everything shows up in one table where items can be added, edited, and deleted.

## Tech stack

The frontend is React 19 on Vite, using plain `fetch` for API calls (no axios), `react-icons` for the table icons, and one CSS file per component rather than Tailwind or CSS-in-JS.

The backend is Flask with Flask-RESTful for routing, Flask-SQLAlchemy on SQLite for the database, Flask-Migrate for migrations, and Marshmallow for serialization. Auth is just a Flask session cookie set on login — there's no password field, which is fine for a local/demo project but worth knowing going in (more on this below).

## Getting started

You'll need Node (18+) and Python (3.10+) installed.

First, clone the repo and set up the backend:

```bash
cd BudgetBuddy/server
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

export FLASK_APP=app.py       # Windows: set FLASK_APP=app.py
flask db upgrade              # creates instance/app.db from migrations
python seed.py                # seeds the category list

python app.py                 # runs the API on http://127.0.0.1:5000
```

Then, in a separate terminal, set up the frontend from the repo root:

```bash
npm install
npm run dev
```

This starts Vite on http://localhost:5173. The dev server proxies any `/api/*` request straight to the Flask app at port 5000, so there's no separate API URL to configure — just make sure the backend is running before you load the page.

## Using it

Sign up or log in with a username, then set your income right away — you won't be able to add budget items until you do, since the leftover budget calculation needs it. From there, add your fixed items first (the things you know the monthly cost of), and use the leftover amount and the Needs/Wants/Savings breakdown to figure out how to budget the rest.

## Project layout

The React app lives at the repo root under `src/`, with components for the budget table, the add/edit forms, the login/signup screen, and the income and percentage displays, plus a `UserContext` that handles auth state and API calls. The Flask app lives in `server/`: `app.py` has the routes, `models.py` has the User/Category/Expense models and their schemas, `config.py` wires up the app/db/migrate objects, and `seed.py` populates the category table.

## API routes

Everything is under `/api` and depends on the session cookie set at login, so requests need `credentials: "include"`.

`POST /api/users` creates a user from a username. `POST /api/login` logs in by username and starts a session; `DELETE /api/logout` ends it. `PUT /api/users/income` sets the logged-in user's income. `/api/expenses` handles the budget items themselves — GET (with optional `subcategory`/`is_fixed` filters), POST, PUT, and DELETE all work against the logged-in user. `GET /api/budget/totals` returns the sum of budget items grouped by Needs/Wants/Savings.

A user has many expenses (budget items) and an income. Each expense belongs to one category and has a name, an amount, and whether it's fixed or variable. Each category has a name (like "Housing") and a subcategory (needs/wants/savings) — this table is seeded and isn't user-editable yet.

## Known limitations

Auth is intentionally bare-bones — a username with no password — so this isn't set up for real financial data as-is. Categories are fixed to the seeded list; there's no way for a user to add their own yet. There's also no automated test suite.

## What's next

Category CRUD is the natural next step, so users aren't stuck with the seeded list. I'd also like to add an LLM-powered summary button that looks at a user's budget relative to their income and gives some feedback on how it could be improved. Beyond that, the budget item form is a little fragile right now — some fields are sensitive enough that a stray click or keypress can drop the whole form — and the login/signup screen could use a friendlier pass.

## Credit

The budget items table, along with a lot of the initial styling approach, came out of following an open-source React table example and a related video tutorial while building this feature.
