import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "../modules/register/Register";
import Login from "../modules/login/Login";

export default function UnauthorizedRoutes(props) {

  return (
    <div>
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route
          exact path="/register"
          element={
            <Register />
          }
        />

        <Route
            path="/login"
            element={
              <Login/>
            }
          ></Route>
      </Routes>
    </div>
  );
}
