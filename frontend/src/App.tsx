import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import PublicRoute from "./Components/PublicRoute";
import ProtectedRoute from "./Components/ProtectedRoute";
import SelectRole from "./Pages/SelectRole";
import Navbar from "./Components/Navbar";
import Account from "./Pages/Account";
import { UseAppData } from "./Context/AppContext";
import Restaurant from "./Pages/Restaurant";

function App() {
  const { user } = UseAppData();
  if (user && user.role === "seller") {
    return <Restaurant />;
  }
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/account" element={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
