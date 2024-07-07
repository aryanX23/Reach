import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../modules/dashboard/Dashboard";

export default function AuthorizedRoutes(props) {

  return (
    <div>
      <Routes>
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard/>
            }
          ></Route>
        </Routes>
    </div>
  );
}
