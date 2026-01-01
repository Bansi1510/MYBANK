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
import UPIService from "./components/services_page/upi/UPIService";
import MobileUPI from "./components/services_page/upi/MobileUPI";
import AccountUPI from "./components/services_page/upi/AccountUPI";
import BankingService from "./components/services_page/banking/LoanService";
import CheckBalance from "./components/services_page/banking/CheckBalance";
import MoneyTransfer from "./components/services_page/banking/MoneyTransfer";
import ElectricityBill from "./components/services_page/utility/ElectricityBill";
import MobileRecharge from "./components/services_page/utility/MobileRecharge";
import InsurancePremium from "./components/services_page/utility/InsurancePremium";
import UpiSuccess from "./components/services_page/upi/UpiSuccess";
import Loans from "./components/pages/Loans";
import LoanApplicationPage from "./components/Loans/LoanApplicationPage";
import LoanPaymentForm from "./components/services_page/loan/LoanPaymentForm";
import Cards from "./components/pages/Cards";
import CardRequestForm from "./components/cards/CardRequestForm";

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
  },
  {
    path: "/loans",
    element: <Loans />
  },

  //services

  {
    path: "/services/upi",
    element: <UPIService />
  },
  {
    path: "/services/upi/mobile",
    element: <MobileUPI />
  },
  {
    path: "/services/upi/account",
    element: <AccountUPI />
  },
  {
    path: "/upi-success",
    element: <UpiSuccess />
  },
  {
    path: "/services/banking",
    element: <BankingService />
  },
  {
    path: "/services/banking/balance",
    element: <CheckBalance />
  },
  {
    path: "/services/banking/transfer",
    element: <MoneyTransfer />
  },
  {
    path: "/services/utility/electricity",
    element: <ElectricityBill />
  },
  {
    path: "/services/utility/mobile-recharge",
    element: <MobileRecharge />
  },
  {
    path: "/services/loan/emi",
    element: <LoanPaymentForm />
  },
  {
    path: "/services/utility/insurance",
    element: <InsurancePremium />
  },
  //loan
  {
    path: "/loan/:loanType",
    element: <LoanApplicationPage />
  },
  {
    path: "/cards",
    element: <Cards />
  },
  {
    path: "/cards/new-request",
    element: <CardRequestForm />
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