import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";

import AuthorizedRoutes from "./routes/AuthorizedRoutes";
import UnauthorizedRoutes from "./routes/UnauthorizedRoutes";

function App() {
  const authState = useSelector(state => state?.login?.loginDetails?.authenticated || false);

  return (
    <>
      <BrowserRouter>
        {
          authState ? <AuthorizedRoutes /> : 
            <UnauthorizedRoutes/>
        }
			</BrowserRouter>
    </>
  )
}

export default App
