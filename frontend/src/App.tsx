import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Profile from "./components/auth/Profile";
import { Accounts } from "./components/pages/Accounts";
import Services from "./components/pages/Services";
import TransactionScreen from "./components/transaction/TransactionScreen";
import Contant from "./components/pages/Contact";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/accounts",
    element: <Accounts />
  },
  {
    path: "/services",
    element: <Services />
  },
  {
    path: "/transaction/:type",
    element: <TransactionScreen />
  },
  {
    path: "/contact",
    element: <Contant />
  }

]);


function App() {

  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  );
}

export default App;