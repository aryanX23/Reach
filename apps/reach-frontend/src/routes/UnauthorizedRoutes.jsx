import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../modules/register/Register";

export default function UnauthorizedRoutes(props) {

  return (
    <div>
      <Routes>
        <Route path="*" element={<Navigate to="/register" />} />
        <Route
          exact path="/register"
          element={
            <Register />
          }
        />

        {/* <Route
            path="/login"
            element={
              <></>
            }
          ></Route> */}
      </Routes>
    </div>
  );
}
