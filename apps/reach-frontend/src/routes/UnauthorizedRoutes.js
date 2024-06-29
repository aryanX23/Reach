export default function UnauthorizedRoutes(props) {

  return (
    <>
      <div>
        <Routes>
          <Route path="*" element={<Navigate to="/login" />} />
          <Route
            path="/register"
            element={
              <></>
            }
          ></Route>

          <Route
            path="/login"
            element={
              <></>
            }
          ></Route>
        </Routes>
      </div>
    </>
  );
}
