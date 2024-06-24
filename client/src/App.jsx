import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout, { ProtectedLayout } from "./components/Layout/Layout";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import AddMember from "./pages/AddMember/AddMember";
import MemberLoanPage from "./pages/MemberLoanPage/MemberLoanPage";
import LoanDetailPage from "./pages/LoanDetailPage/LoanDetailPage";
import AddLoan from "./pages/AddLoan.jsx/AddLoan";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register";
import DailyCollectionSettlementPage from "./pages/DailyCollectionSettlementPage/DailyCollectionSettlementPage";
import PaymentsPage from "./pages/PaymentPage/PaymentPage";
import Home from "./pages/Home/Home";
import HomePage from "./pages/HomePage/HomePage";
import TransactionPage from "./pages/TransactionPage/TransactionPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
      ],
    },
    {
      path: "/",
      element: <ProtectedLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/home_page", element: <HomePage /> },
        { path: "/Add_Loan", element: <AddLoan /> },
        { path: "/Add_Member", element: <AddMember /> },
        { path: "/member/:id", element: <MemberLoanPage /> },
        { path: "/loan/:loanId", element: <LoanDetailPage /> },
        { path: "/Dashboard", element: <Dashboard /> },
        { path: "/payments", element: <PaymentsPage /> },
        { path: "/settlements", element: <DailyCollectionSettlementPage /> },
        { path: "/transactions", element: <TransactionPage /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
