import { useSelector } from "react-redux";
import { Toaster } from 'sonner';

import AuthorizedRoutes from "./routes/AuthorizedRoutes";
import UnauthorizedRoutes from "./routes/UnauthorizedRoutes";

function App() {
  const authState = useSelector(state => state?.login?.loginDetails?.authenticated || false);
  console.log(authState)

  return (
    <div>
      <Toaster />
      {
        authState ? <AuthorizedRoutes /> :
          <UnauthorizedRoutes />
      }
    </div>
  )
}

export default App;
