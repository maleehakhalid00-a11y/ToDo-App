import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginRegister from "./components/LoginRegister";
import Dashboard from "./components/Dashboard";
import TodoList from "./components/TodoList";
import CompletedTasks from "./components/CompletedTasks";
import Profile from "./components/profile";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginRegister setToken={setToken} />
            )
          }
        />


        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard token={token} setToken={setToken} />
            ) : (
              <Navigate to="/" />
            )
          }/>
        <Route
          path="/todos"
          element={
            token ? (
              <TodoList token={token} setToken={setToken} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/completed"
          element={
            token ? <CompletedTasks token={token} /> : <Navigate to="/" />
          }
        />

        <Route
          path="/profile"
          element={
            token ? (
              <Profile token={token} setToken={setToken} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
