
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './components/pages/Login'
import AdminDashboard from './components/pages/AdminDashboard'
import StaffDashboard from './components/pages/StaffDashboard'
import AccountsManagement from './components/admin/AccountsManagement'
import StaffManagement from './components/admin/StaffManagement'
import LoanApproval from './components/admin/LoanApproval'


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
      // Add other admin functionalities here
    ]
  },
  {
    path: "/staff",
    element: <StaffDashboard />,
    children: [
      // Add staff nested routes here
    ]
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
