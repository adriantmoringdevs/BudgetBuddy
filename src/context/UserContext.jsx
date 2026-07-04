import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  function signup(username) {
    return fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Signup failed");
      })
      .then((data) => {
        return {
          success: true,
          message: `Account for ${data.username} created succesfully!`,
        };
      });
  }

  function login(username) {
    return fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Login failed");
      })
      .then((data) => setUser(data));
  }

  function logout() {
    return fetch("/api/logout", {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setUser(null);
      }
    });
  }

  function updateIncome(income) {
    return fetch("/api/users/income", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ income: income }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Income Update Failed");
      })
      .then((data) => setUser(data));
  }

  return (
    <UserContext.Provider value={{ user, signup, login, logout, updateIncome }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
