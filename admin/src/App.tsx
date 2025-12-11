
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './components/pages/Login'
import AdminDashboard from './components/pages/AdminDashboard'
import StaffDashboard from './components/pages/StaffDashboard'
import AccountsManagement from './components/admin/AccountsManagement'
import StaffManagement from './components/admin/StaffManagement'
import LoanApproval from './components/admin/LoanApproval'
import CustomerAccounts from './components/staff/CustomerAccounts'
import KYCVerification from './components/staff/KYCVerification'
import DailyTransactions from './components/staff/DailyTransactions'
import NewBankAccountRequest from './components/staff/customer-account/NewBankAccountRequest'


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      { path: "accounts", element: <AccountsManagement /> },
      { path: "staff", element: <StaffManagement /> },
      { path: "loans", element: <LoanApproval /> },
    ]
  },
  {
    path: "/staff",
    element: <StaffDashboard />,
    children: [
      {
        path: "customer-accounts",
        element: <CustomerAccounts />,
        children: [
          { path: "new-account", element: <NewBankAccountRequest /> },
        ],
      },
      { path: "kyc", element: <KYCVerification /> },
      { path: "transactions", element: <DailyTransactions /> },
    ],
  }




])

function App() {

  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  )
}

export default App
