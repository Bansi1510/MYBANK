
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
import AdminNewAccountRequests from './components/admin/account-management/AdminNewAccountRequests'
import NewAccountRequestHistory from './components/admin/account-management/NewAccountRequestHistory'
import AccountStatusView from './components/admin/account-management/AccountStatusView'
import AccountDetails from './components/admin/account-management/AccountDetails'
import AddStaff from './components/admin/staff-management/AddStaff'
import StaffTable from './components/admin/staff-management/StaffTable'
import AccountsTable from './components/staff/customer-account/AccountsTable'
import CustomerLoan from './components/staff/CustomerLoan'
import LoanRequestList from './components/common/LoanRequestList'
import SingleLoanRequest from './components/staff/customer-loan/SingleLoanRequest'
import AdminSingleLoanRequest from './components/admin/loan-approve/AdminSingleLoanRequest'
import LoanEmiPanel from './components/staff/customer-loan/LoanEmiPanel'
import CustomerCards from './components/staff/CustomerCards'
import NewCardRequest from './components/staff/customer-cards/NewCardRequest'
import CardManagement from './components/admin/CardManagement'
import AdminCardRequestList from './components/admin/card-management/AdminCardRequestList'
import AllCardsList from './components/common/AllCardsList'
import CardReqList from './components/staff/customer-cards/CardReqList'
import CardDetails from './components/common/CardDetails'



const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      {
        path: "accounts",
        element: <AccountsManagement />,
        children: [

          { path: "new-requests", element: <AdminNewAccountRequests /> },
          { path: "acc-req-history", element: <NewAccountRequestHistory /> },
          // { path: "loan-requests", element: <LoanRequests /> },
          // { path: "transactions", element: <AccountsTransactionHistory /> },
          { path: ":status", element: <AccountStatusView /> },
          { path: ":status/:accountId", element: <AccountDetails /> },
          // { path: "reports", element: <AccountReports /> },
          // { path: "alerts", element: <AccountAlerts /> },

          // { path: "settings", element: <AccountSettings /> },
        ],
      },

      {
        path: "staff",
        element: <StaffManagement />,
        children: [
          { path: "add", element: <AddStaff /> },
          { path: "profiles", element: <StaffTable /> }
        ]


      },
      {
        path: "loan",
        element: <LoanApproval />,
        children: [
          { path: "pending", element: <LoanRequestList /> },
          { path: "pending/details/:loan_id", element: <AdminSingleLoanRequest /> },
        ]

      },
      {
        path: "card-management",
        element: <CardManagement />,
        children: [
          { path: "card-requests", element: <AdminCardRequestList /> },
          { path: "all-cards", element: <AllCardsList /> }
        ]
      }
    ],
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
          { path: "all-accounts", element: <AccountsTable /> }
        ],
      },
      {
        path: "customer-loan",
        element: <CustomerLoan />,
        children: [
          { path: "loan-applications", element: <LoanRequestList /> },
          { path: "loan-applications/details/:loan_id", element: <SingleLoanRequest /> },
          { path: "loan-emi-payment", element: <LoanEmiPanel /> }

        ]
      },
      {
        path: "cutomer-card",
        element: <CustomerCards />,
        children: [
          { path: "new-card", element: <NewCardRequest /> },
          { path: "all-req-cards", element: <CardReqList /> },
          { path: "all-cards", element: <AllCardsList /> },
          { path: "all-cards/:id", element: <CardDetails /> }
        ]
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
